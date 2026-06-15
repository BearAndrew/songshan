import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  OVERLAY_DATA,
  OVERLAY_RESULT,
} from '../../../shared/components/message-dialog/message-dialog.inject-token';
import { CalendarTriggerComponent } from '../../../shared/components/calendar-trigger/calendar-trigger.component';
import { Option } from '../../../shared/components/dropdown/dropdown.component';
import { OpsSelectComponent } from './ops-select.component';
import { ApiService } from '../../../core/services/api-service.service';
import { parseTwDateTime } from '../../../core/utils/parse-tw-datetime';
import {
  CounterApplicationManualRequest,
  CounterApplyEditRequest,
  CounterInfo,
  CounterSeason,
} from '../../../models/counter.model';
import {
  ApplyType,
  dayOfWeekNumbers,
  flightCode,
  getApplyType,
  hhmm,
} from '../reset-shared';

/** openCustomDialog 帶入的資料 */
export interface ApplicationFormData {
  /** new = 新增申請;modify = 異動申請 */
  mode: 'new' | 'modify';
  /** 異動 / 預填時的既有資料 */
  info?: CounterInfo;
  /** 航空公司代碼(新增時帶入 agent) */
  agent?: string;
}

/** 送出後回傳給呼叫頁,由頁面負責打 API */
export type ApplicationFormResult =
  | { mode: 'new'; payload: CounterApplicationManualRequest }
  | { mode: 'modify'; payload: CounterApplyEditRequest };

@Component({
  selector: 'app-application-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarTriggerComponent, OpsSelectComponent],
  templateUrl: './application-form-modal.component.html',
})
export class ApplicationFormModalComponent implements OnInit {
  mode: 'new' | 'modify' = 'new';
  info?: CounterInfo;
  agent = '';

  /** 申請別:整季 / 指定期間 */
  dateType: ApplyType = 'season';

  // 表單欄位
  flightNo = '';
  departureIata = '';
  depHH = '';
  depMM = '';
  openHH = '';
  openMM = '';
  closeHH = '';
  closeMM = '';
  weekdays = new Set<number>(); // 1..7 (7=日)
  season = '';
  note = '';

  // 日期(Date 物件給 calendar-trigger;送出時格式化)
  rangeStart: Date | null = null;
  rangeEnd: Date | null = null;
  effectiveStart: Date | null = null;

  submitted = false;

  weekList = [
    { v: 1, l: '一' },
    { v: 2, l: '二' },
    { v: 3, l: '三' },
    { v: 4, l: '四' },
    { v: 5, l: '五' },
    { v: 6, l: '六' },
    { v: 7, l: '日' },
  ];

  airportOptions: Option[] = [];
  seasonList: CounterSeason[] = [];

  /** 季度下拉:僅顯示英文代號 */
  get seasonOptions(): Option[] {
    return this.seasonList.map((s) => ({ label: s.season, value: s.season }));
  }

  /** 時 / 分下拉選項 */
  hourOptions: Option[] = Array.from({ length: 24 }, (_, i) => {
    const v = String(i).padStart(2, '0');
    return { label: v, value: v };
  });
  minuteOptions: Option[] = Array.from({ length: 60 }, (_, i) => {
    const v = String(i).padStart(2, '0');
    return { label: v, value: v };
  });

  constructor(
    @Inject(OVERLAY_DATA) public data: ApplicationFormData,
    @Inject(OVERLAY_RESULT) private result$: Subject<ApplicationFormResult | null>,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.mode = this.data?.mode ?? 'new';
    this.info = this.data?.info;
    this.agent = this.data?.agent ?? '';

    // 航點下拉
    this.apiService
      .getAirportListByTypeAirline('nondomestic', '')
      .subscribe((res) => {
        this.airportOptions = res.map((a) => ({ label: a.name_zhTW, value: a.iata }));
      });

    // 季度下拉
    this.apiService.getSeasons().subscribe((res) => {
      this.seasonList = res;
      if (!this.season && res.length) this.season = res[0].season;
    });

    if (this.info) this.prefill(this.info);
  }

  get title(): string {
    if (this.mode === 'new') return '新增櫃檯使用申請';
    const code = this.info ? flightCode(this.info) : '';
    const counter = this.info?.assignedCounterArea
      ? ` · 櫃檯 ${this.info.assignedCounterArea}`
      : '';
    return `異動申請 · ${code}${counter}`;
  }

  get typeLabel(): string {
    return this.dateType === 'range' ? '指定期間' : '整季定期航班';
  }

  private prefill(info: CounterInfo): void {
    this.flightNo = flightCode(info);
    this.departureIata = info.departureIata || '';
    this.dateType = getApplyType(info);
    this.season = info.season || '';

    const [dh, dm] = hhmm(info.departure_time).split(':');
    this.depHH = dh || '';
    this.depMM = dm || '';

    const [sh, sm] = hhmm(info.startTime).split(':');
    this.openHH = sh || '';
    this.openMM = sm || '';

    const [eh, em] = hhmm(info.endTime).split(':');
    this.closeHH = eh || '';
    this.closeMM = em || '';

    this.weekdays = new Set(dayOfWeekNumbers(info.dayOfWeek));

    if (info.applyForPeriod && info.applyForPeriod.includes('~')) {
      const [s, e] = info.applyForPeriod.split('~');
      this.rangeStart = this.parseYmd(s?.trim());
      this.rangeEnd = this.parseYmd(e?.trim());
    }
    this.note = info.reason || '';
  }

  toggleWeekday(v: number): void {
    if (this.weekdays.has(v)) this.weekdays.delete(v);
    else this.weekdays.add(v);
  }

  setDateType(t: ApplyType): void {
    this.dateType = t;
  }

  onDate(field: 'rangeStart' | 'rangeEnd' | 'effectiveStart', d: Date): void {
    this[field] = d;
    // 起始更動 → 若結束日 <= 起始日,清除結束日
    if (field === 'rangeStart' && this.rangeEnd && this.dayMs(this.rangeEnd) <= this.dayMs(this.rangeStart)) {
      this.rangeEnd = null;
    }
    // 結束更動防呆(月曆已禁選,但仍保險)→ 不可 <= 起始
    if (field === 'rangeEnd' && this.rangeStart && this.dayMs(d) <= this.dayMs(this.rangeStart)) {
      this.rangeEnd = null;
    }
  }

  private dayMs(d: Date | null): number {
    return d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() : NaN;
  }

  /** 結束日月曆的最小可選日 = 起始日 + 1 天(強制結束 > 起始) */
  get endAnchor(): Date {
    const s = this.rangeStart ?? new Date();
    return new Date(s.getFullYear(), s.getMonth(), s.getDate() + 1);
  }

  // ---- 申請時間(開櫃 ~ 關櫃)範圍控制 ----
  private toMin(hh: string, mm: string): number {
    return +hh * 60 + +mm;
  }
  /** 開櫃(起始)時間是否已選完整 */
  get openComplete(): boolean {
    return this.openHH !== '' && this.openMM !== '';
  }
  get closeComplete(): boolean {
    return this.closeHH !== '' && this.closeMM !== '';
  }
  /** 關櫃可選「時」:不得早於開櫃時 */
  get closeHourOptions(): Option[] {
    if (!this.openComplete) return this.hourOptions;
    return this.hourOptions.filter((o) => +o.value >= +this.openHH);
  }
  /** 關櫃可選「分」:同一小時時不得早於等於開櫃分 */
  get closeMinuteOptions(): Option[] {
    if (!this.openComplete) return this.minuteOptions;
    if (this.closeHH !== '' && +this.closeHH === +this.openHH) {
      return this.minuteOptions.filter((o) => +o.value > +this.openMM);
    }
    return this.minuteOptions;
  }
  /** 開櫃時間更動 → 若關櫃 <= 開櫃,清除關櫃 */
  onOpenTimeChange(): void {
    if (
      this.openComplete &&
      this.closeComplete &&
      this.toMin(this.closeHH, this.closeMM) <= this.toMin(this.openHH, this.openMM)
    ) {
      this.closeHH = '';
      this.closeMM = '';
    }
  }
  /** 關櫃「時」更動 → 同開櫃時但分鐘 <= 開櫃分,清除分鐘重選 */
  onCloseHourChange(): void {
    if (
      this.openComplete &&
      this.closeHH !== '' &&
      +this.closeHH === +this.openHH &&
      this.closeMM !== '' &&
      +this.closeMM <= +this.openMM
    ) {
      this.closeMM = '';
    }
  }

  // ---- 驗證 ----
  private timeOk(hh: string, mm: string): boolean {
    return /^\d{1,2}$/.test(hh) && /^\d{1,2}$/.test(mm) && +hh < 24 && +mm < 60;
  }

  get invalid(): boolean {
    if (!this.flightNo.trim()) return true;
    if (!this.departureIata) return true;
    if (!this.timeOk(this.depHH, this.depMM)) return true;
    if (!this.timeOk(this.openHH, this.openMM)) return true;
    if (!this.timeOk(this.closeHH, this.closeMM)) return true;
    // 關櫃必須晚於開櫃
    if (this.toMin(this.closeHH, this.closeMM) <= this.toMin(this.openHH, this.openMM)) return true;
    if (this.weekdays.size === 0) return true;

    if (this.mode === 'new') {
      if (this.dateType === 'season' && !this.season) return true;
      if (this.dateType === 'range' && (!this.rangeStart || !this.rangeEnd)) return true;
    } else {
      if (this.dateType === 'season' && !this.effectiveStart) return true;
      if (this.dateType === 'range' && (!this.rangeStart || !this.rangeEnd)) return true;
    }
    return false;
  }

  // ---- 個別欄位錯誤(送出後才顯示紅字)----
  get flightNoErr(): boolean {
    return this.submitted && !this.flightNo.trim();
  }
  get departureErr(): boolean {
    return this.submitted && !this.departureIata;
  }
  get depTimeErr(): boolean {
    return this.submitted && !this.timeOk(this.depHH, this.depMM);
  }
  get applyTimeErr(): boolean {
    if (!this.submitted) return false;
    if (!this.timeOk(this.openHH, this.openMM) || !this.timeOk(this.closeHH, this.closeMM)) return true;
    return this.toMin(this.closeHH, this.closeMM) <= this.toMin(this.openHH, this.openMM);
  }
  get weekdayErr(): boolean {
    return this.submitted && this.weekdays.size === 0;
  }
  get seasonErr(): boolean {
    return this.submitted && this.mode === 'new' && this.dateType === 'season' && !this.season;
  }
  get rangeErr(): boolean {
    return this.submitted && this.dateType === 'range' && (!this.rangeStart || !this.rangeEnd);
  }
  get effectiveErr(): boolean {
    return (
      this.submitted && this.mode === 'modify' && this.dateType === 'season' && !this.effectiveStart
    );
  }

  // ---- 工具 ----
  private pad(v: string): string {
    return v.padStart(2, '0');
  }
  private toTime(hh: string, mm: string): string {
    return `${this.pad(hh)}:${this.pad(mm)}:00`;
  }
  /**
   * 生效起始日所屬季度的結束日(yyyy-MM-dd)。
   * 季別代碼(record.season)與 GetSeasons 代碼可能不一致,故改用日期區間判定。
   */
  private seasonEndYmd(): string {
    const ref = this.effectiveStart ?? new Date();
    const s = this.seasonList.find((x) => {
      const a = parseTwDateTime(x.startDate);
      const b = parseTwDateTime(x.endDate);
      return a && b && ref >= a && ref <= b;
    });
    const d = s ? parseTwDateTime(s.endDate) : null;
    return d ? this.fmtYmd(d) : '';
  }

  private fmtYmd(d: Date | null): string {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }
  private parseYmd(s?: string): Date | null {
    if (!s) return null;
    const [y, m, d] = s.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }
  private splitFlight(): { airline: string; no: string } {
    const m = (this.flightNo || '').match(/^([A-Za-z]+)(\d+)$/);
    return m
      ? { airline: m[1].toUpperCase(), no: m[2] }
      : { airline: '', no: '' };
  }
  /** 星期 Set → API day_of_week(沿用既有寫法:週日輸出 0,排在最後) */
  private toApiDayOfWeek(): string {
    const order = [1, 2, 3, 4, 5, 6, 7];
    return order
      .filter((v) => this.weekdays.has(v))
      .map((v) => (v === 7 ? 0 : v))
      .join(',');
  }

  // ---- 動作 ----
  submit(): void {
    this.submitted = true;
    if (this.invalid) return;

    const { airline, no } = this.splitFlight();
    const dayOfWeek = this.toApiDayOfWeek();
    const startTime = this.toTime(this.openHH, this.openMM);
    const endTime = this.toTime(this.closeHH, this.closeMM);

    if (this.mode === 'new') {
      const payload: CounterApplicationManualRequest = {
        agent: this.agent || '',
        airline_iata: airline,
        flight_no: no,
        season: this.dateType === 'season' ? this.season : this.season || '',
        day_of_week: dayOfWeek,
        apply_for_period: '',
        startDate: this.dateType === 'range' ? this.fmtYmd(this.rangeStart) : '',
        endDate: this.dateType === 'range' ? this.fmtYmd(this.rangeEnd) : '',
        start_time: startTime,
        end_time: endTime,
        departureIata: this.departureIata,
        departure_time: this.toTime(this.depHH, this.depMM),
      };
      this.result$.next({ mode: 'new', payload });
    } else {
      // 後端 ApplyEdit 三個日期欄位都會轉日期,不可為空。
      // 指定期間 → 起/迄;整季 → 生效起始日 ~ 當前季度結束日。
      const startDate =
        this.dateType === 'range' ? this.fmtYmd(this.rangeStart) : this.fmtYmd(this.effectiveStart);
      const endDate =
        this.dateType === 'range' ? this.fmtYmd(this.rangeEnd) : this.seasonEndYmd();
      const payload: CounterApplyEditRequest = {
        requestId: this.info?.requestId || '',
        airlineIata: airline,
        flightNo: no,
        season: this.season,
        apply_for_period: startDate || endDate,
        startDate,
        endDate,
        dayOfWeek,
        startTime,
        endTime,
      };
      this.result$.next({ mode: 'modify', payload });
    }
    this.result$.complete();
  }

  cancel(): void {
    this.result$.next(null);
    this.result$.complete();
  }
}
