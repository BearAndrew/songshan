import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { ApiService } from '../../../core/services/api-service.service';
import { CommonService } from '../../../core/services/common.service';
import { parseTwDateTime } from '../../../core/utils/parse-tw-datetime';
import { environment } from '../../../../environments/environment';
import {
  CounterApplicationManualRequest,
  CounterApplyEditRequest,
  CounterGetAllRequest,
  CounterInfo,
  CounterSeason,
} from '../../../models/counter.model';
import {
  ApplyType,
  StatusKind,
  dayOfWeekLabel,
  flightCode,
  getApplyType,
  getStatusKind,
  hhmm,
  timeRange,
} from '../reset-shared';
import {
  ApplicationFormData,
  ApplicationFormModalComponent,
  ApplicationFormResult,
} from '../components/application-form-modal.component';
import { OpsSelectComponent } from '../components/ops-select.component';
import { Option } from '../../../shared/components/dropdown/dropdown.component';

interface AirlineRow {
  info: CounterInfo;
  code: string;
  dest: string;
  week: string;
  dep: string;
  counter: string;
  applyTime: string;
  type: ApplyType;
  status: StatusKind;
  extra: boolean;
}

type AirlineTab = '當季' | '下季' | '本週' | '下週' | '今日';

@Component({
  selector: 'app-intl-checkin-counter-reset-airline',
  standalone: true,
  imports: [CommonModule, FormsModule, OpsSelectComponent],
  templateUrl: './intl-checkin-counter-reset-airline.component.html',
  styleUrl: './intl-checkin-counter-reset-airline.component.scss',
})
export class IntlCheckinCounterResetAirlineComponent implements OnInit {
  tabs: AirlineTab[] = ['當季', '下季', '本週', '下週', '今日'];
  activeTab: AirlineTab = '當季';

  typeFilter: 'all' | ApplyType = 'all';
  statusFilter: 'all' | StatusKind = 'all';

  typeOptions: Option[] = [
    { label: '全部', value: 'all' },
    { label: '整季', value: 'season' },
    { label: '指定期間', value: 'range' },
  ];
  statusOptions: Option[] = [
    { label: '全部', value: 'all' },
    { label: '待審核', value: 'pending' },
    { label: '已核准', value: 'approved' },
    { label: '已駁回', value: 'rejected' },
  ];

  rows: AirlineRow[] = [];
  /** 目前開啟的編輯選單列 index(同時間只允許一個) */
  openMenuIndex: number | null = null;

  agent = 'ALL';
  airportNameMap: Record<string, string> = {};
  seasonList: CounterSeason[] = [];

  rangeLabel = '';
  csvUrl = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((p) => {
      this.agent = p.get('user') || 'ALL';
    });

    this.apiService
      .getAirportListByTypeAirline('nondomestic', '')
      .subscribe((res) => {
        res.forEach((a) => (this.airportNameMap[a.iata] = a.name_zhTW));
      });

    this.apiService.getSeasons().subscribe((res) => {
      this.seasonList = res || [];
      this.load(); // 季別載入後再依當季 tab 載資料
    });
  }

  // ---- tab → 日期區間 ----
  setTab(tab: AirlineTab): void {
    this.activeTab = tab;
    this.load();
  }

  private fmt(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  private weekRange(base: Date): { from: string; to: string } {
    const day = base.getDay(); // 0=Sun
    const sun = new Date(base);
    sun.setDate(base.getDate() - day);
    const sat = new Date(sun);
    sat.setDate(sun.getDate() + 6);
    return { from: this.fmt(sun), to: this.fmt(sat) };
  }

  /** 找出包含今天的季別 index;找不到回 0 */
  private currentSeasonIndex(): number {
    const today = new Date();
    const idx = this.seasonList.findIndex((s) => {
      const start = parseTwDateTime(s.startDate);
      const end = parseTwDateTime(s.endDate);
      return start && end && today >= start && today <= end;
    });
    return idx >= 0 ? idx : 0;
  }

  private resolveRange(): { from: string; to: string } {
    const today = new Date();
    switch (this.activeTab) {
      case '今日':
        return { from: this.fmt(today), to: this.fmt(today) };
      case '本週':
        return this.weekRange(today);
      case '下週': {
        const next = new Date(today);
        next.setDate(today.getDate() + 7);
        return this.weekRange(next);
      }
      case '下季': {
        const s = this.seasonList[this.currentSeasonIndex() + 1];
        if (s) {
          const start = parseTwDateTime(s.startDate);
          const end = parseTwDateTime(s.endDate);
          if (start && end) return { from: this.fmt(start), to: this.fmt(end) };
        }
        return this.weekRange(today);
      }
      case '當季':
      default: {
        const s = this.seasonList[this.currentSeasonIndex()];
        if (s) {
          const start = parseTwDateTime(s.startDate);
          const end = parseTwDateTime(s.endDate);
          if (start && end) return { from: this.fmt(start), to: this.fmt(end) };
        }
        return this.weekRange(today);
      }
    }
  }

  load(): void {
    const { from, to } = this.resolveRange();
    this.rangeLabel = `${from} ~ ${to}`;
    this.csvUrl = `${environment.apiBaseUrl}/CounterExport/CUSTOM/${from}/${to}`;

    const payload: CounterGetAllRequest = {
      dateFrom: from,
      dateTo: to,
      status: 'ALL',
      agent: this.agent,
    };
    this.apiService.getAllCounter(payload).subscribe((res) => {
      this.rows = this.mapRows(res || []);
    });
  }

  private mapRows(data: CounterInfo[]): AirlineRow[] {
    const seen = new Set<string>();
    const out: AirlineRow[] = [];
    for (const info of data) {
      const status = getStatusKind(info.status);
      if (!status) continue; // 撤回/空狀態不顯示

      const code = flightCode(info);
      const destName = this.airportNameMap[info.departureIata] || '';
      const key = `${code}-${info.departureIata}`;
      const extra = seen.has(key);
      seen.add(key);

      out.push({
        info,
        code,
        dest: destName ? `${info.departureIata} ${destName}` : info.departureIata,
        week: dayOfWeekLabel(info.dayOfWeek),
        dep: hhmm(info.departure_time),
        counter: info.assignedCounterArea || '—',
        applyTime: timeRange(info),
        type: getApplyType(info),
        status,
        extra,
      });
    }
    return out;
  }

  get filteredRows(): AirlineRow[] {
    return this.rows.filter(
      (r) =>
        (this.typeFilter === 'all' || r.type === this.typeFilter) &&
        (this.statusFilter === 'all' || r.status === this.statusFilter),
    );
  }

  rowKey(r: AirlineRow, i: number): string {
    return `${r.info.requestId || r.code}-${r.counter}-${i}`;
  }

  toggleMenu(i: number, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuIndex = this.openMenuIndex === i ? null : i;
  }

  closeMenu(): void {
    this.openMenuIndex = null;
  }

  /** 點擊頁面其他地方關閉編輯選單(確保畫面同時只有一個) */
  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeMenu();
  }

  // ---- 新增 ----
  openCreate(): void {
    const data: ApplicationFormData = { mode: 'new', agent: this.agent };
    this.commonService
      .openCustomDialog<ApplicationFormModalComponent, ApplicationFormResult>(
        ApplicationFormModalComponent,
        data,
      )
      .pipe(take(1))
      .subscribe((res) => {
        if (res && res.mode === 'new') this.submitNew(res.payload);
      });
  }

  // ---- 異動 ----
  openModify(r: AirlineRow): void {
    this.closeMenu();
    const data: ApplicationFormData = {
      mode: 'modify',
      info: r.info,
      agent: this.agent,
    };
    this.commonService
      .openCustomDialog<ApplicationFormModalComponent, ApplicationFormResult>(
        ApplicationFormModalComponent,
        data,
      )
      .pipe(take(1))
      .subscribe((res) => {
        if (res && res.mode === 'modify') this.submitModify(res.payload);
      });
  }

  // ---- 撤回(二次確認) ----
  openWithdraw(r: AirlineRow): void {
    this.closeMenu();
    this.commonService
      .openDialog({
        title: '撤回申請',
        message:
          '確定要撤回這筆櫃檯申請嗎?撤回後此筆申請將自清單移除,已分配之櫃檯時段同步釋出。如需重新申請,請另行新增。',
        confirmText: '確認撤回',
        cancelText: '取消',
      })
      .pipe(take(1))
      .subscribe((ok) => {
        if (ok && r.info.requestId) {
          this.apiService.userWithdraw(r.info.requestId).subscribe({
            next: () => this.load(),
            error: (err) => this.alert('撤回失敗', err?.error),
          });
        }
      });
  }

  private submitNew(payload: CounterApplicationManualRequest): void {
    this.apiService.addCounterApplication(payload).subscribe({
      next: () => {
        this.alert('申請成功', '已送出申請,請等待審核');
        this.load();
      },
      error: (err) => this.alert('申請失敗', err?.error),
    });
  }

  private submitModify(payload: CounterApplyEditRequest): void {
    this.apiService.applyEdit(payload).subscribe({
      next: () => {
        this.alert('異動已送出', '已送出異動申請,請等待審核');
        this.load();
      },
      error: (err) => this.alert('異動失敗', err?.error),
    });
  }

  private alert(title: string, message?: string): void {
    this.commonService
      .openDialog({ title, message: message || '', confirmText: '確定', cancelText: '' })
      .pipe(take(1))
      .subscribe();
  }

  print(): void {
    window.print();
  }
}
