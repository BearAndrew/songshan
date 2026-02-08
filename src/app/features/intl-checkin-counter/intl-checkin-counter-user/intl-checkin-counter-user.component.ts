import { STATUS_COLOR_MAP } from './../checkin-color-mapping';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DropdownSecondaryComponent } from '../../../shared/components/dropdown-secondary/dropdown-secondary.component';
import { Option } from '../../../shared/components/dropdown/dropdown.component';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CalendarTriggerComponent } from '../../../shared/components/calendar-trigger/calendar-trigger.component';
import { ApiService } from '../../../core/services/api-service.service';
import {
  CounterApplicationManualRequest,
  CounterApplyEditRequest,
  CounterGetAllRequest,
  CounterInfo,
  CounterSeason,
  statusMap,
} from '../../../models/counter.model';
import { ActivatedRoute } from '@angular/router';
import { CounterService } from '../service/counter.service';
import { parseTwDateTime } from '../../../core/utils/parse-tw-datetime';
import { take } from 'rxjs';
import { CommonService } from '../../../core/services/common.service';
import { MOCK_COUNTER_INFO } from './fake-data';

interface ScheduleItem {
  date: string; // YYYY-MM-DD
  flightNo: string;
  time: string;
  status: string;
  counterInfo: CounterInfo;
}

function atLeastOneWeekDay(control: AbstractControl): ValidationErrors | null {
  const week = control.value;
  if (!week) return { required: true };
  const selected = Object.values(week).some((v) => v === true);
  return selected ? null : { required: true };
}

@Component({
  selector: 'app-intl-checkin-counter-user',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarTriggerComponent,
    DropdownSecondaryComponent,
  ],
  templateUrl: './intl-checkin-counter-user.component.html',
  styleUrl: './intl-checkin-counter-user.component.scss',
})
export class IntlCheckinCounterUserComponent {
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  weeks: ScheduleItem[][][] = [];

  currentWeekIndex = 0;
  currentWeek: ScheduleItem[][] = [];

  currentWeekRange = '';
  paginatorPages: (number | '...')[] = [];

  // index 0 = Mon, 6 = Sun
  rawData: CounterInfo[] = [];

  /** 申請內容 */
  form!: FormGroup;
  formData = {
    flightInfo: '',
    departureTimeHour: '',
    departureTimeMin: '',
    departureTime: '',
    applyTimeStartHour: '',
    applyTimeStartMin: '',
    applyTimeStart: '',
    applyTimeEndHour: '',
    applyTimeEndMin: '',
    applyTimeEnd: '',
    applyDateStart: null,
    applyDateEnd: null,
  };

  seasonOptions: Option[] = [];
  hourOptions: Option[] = [
    { label: '00', value: '00' },
    { label: '01', value: '01' },
    { label: '02', value: '02' },
    { label: '03', value: '03' },
    { label: '04', value: '04' },
    { label: '05', value: '05' },
    { label: '06', value: '06' },
    { label: '07', value: '07' },
    { label: '08', value: '08' },
    { label: '09', value: '09' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '17', value: '17' },
    { label: '18', value: '18' },
    { label: '19', value: '19' },
    { label: '20', value: '20' },
    { label: '21', value: '21' },
    { label: '22', value: '22' },
    { label: '23', value: '23' },
  ];
  minOptions: Option[] = [
    { label: '00', value: '00' },
    { label: '01', value: '01' },
    { label: '02', value: '02' },
    { label: '03', value: '03' },
    { label: '04', value: '04' },
    { label: '05', value: '05' },
    { label: '06', value: '06' },
    { label: '07', value: '07' },
    { label: '08', value: '08' },
    { label: '09', value: '09' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '17', value: '17' },
    { label: '18', value: '18' },
    { label: '19', value: '19' },
    { label: '20', value: '20' },
    { label: '21', value: '21' },
    { label: '22', value: '22' },
    { label: '23', value: '23' },
    { label: '24', value: '24' },
    { label: '25', value: '25' },
    { label: '26', value: '26' },
    { label: '27', value: '27' },
    { label: '28', value: '28' },
    { label: '29', value: '29' },
    { label: '30', value: '30' },
    { label: '31', value: '31' },
    { label: '32', value: '32' },
    { label: '33', value: '33' },
    { label: '34', value: '34' },
    { label: '35', value: '35' },
    { label: '36', value: '36' },
    { label: '37', value: '37' },
    { label: '38', value: '38' },
    { label: '39', value: '39' },
    { label: '40', value: '40' },
    { label: '41', value: '41' },
    { label: '42', value: '42' },
    { label: '43', value: '43' },
    { label: '44', value: '44' },
    { label: '45', value: '45' },
    { label: '46', value: '46' },
    { label: '47', value: '47' },
    { label: '48', value: '48' },
    { label: '49', value: '49' },
    { label: '50', value: '50' },
    { label: '51', value: '51' },
    { label: '52', value: '52' },
    { label: '53', value: '53' },
    { label: '54', value: '54' },
    { label: '55', value: '55' },
    { label: '56', value: '56' },
    { label: '57', value: '57' },
    { label: '58', value: '58' },
    { label: '59', value: '59' },
  ];
  isEdit: boolean = false;
  isSubmitted: boolean = false;

  getWeekControl(key: string): FormControl {
    return this.form.get('weekDays.' + key) as FormControl;
  }
  weekList = [
    { key: 'mon', label: '一' },
    { key: 'tue', label: '二' },
    { key: 'wed', label: '三' },
    { key: 'thu', label: '四' },
    { key: 'fri', label: '五' },
    { key: 'sat', label: '六' },
    { key: 'sun', label: '日' },
  ];
  seasonList: CounterSeason[] = [];

  searchDateFrom: string = '';
  searchDateTo: string = '';

  // 申請內容
  season: string = '';
  requestId: string = '';
  searchDate: Date = new Date();

  /** 權限管控 */
  agent: string = 'ALL';
  STATUS_COLOR_MAP = STATUS_COLOR_MAP;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private commonService: CommonService,
  ) {}

  ngOnInit() {
    /** 申請內容 */
    this.form = this.fb.group({
      flightInfo: ['', Validators.required],
      departureTimeHour: [''],
      departureTimeMin: [''],
      applyTimeStartHour: ['', Validators.required],
      applyTimeStartMin: ['', Validators.required],
      applyTimeEndHour: ['', Validators.required],
      applyTimeEndMin: ['', Validators.required],
      applyDateStart: [''],
      applyDateEnd: [''],
      seasonType: ['all', Validators.required],
      weekDays: this.fb.group({
        mon: [false],
        tue: [false],
        wed: [false],
        thu: [false],
        fri: [false],
        sat: [false],
        sun: [false],
      }),
    });
    (this.form.get('weekDays') as FormGroup).setValidators(atLeastOneWeekDay);

    /** 監聽 seasonType 變化 */
    this.form.get('seasonType')?.valueChanges.subscribe((value) => {
      const startCtrl = this.form.get('applyDateStart');
      const endCtrl = this.form.get('applyDateEnd');

      if (!startCtrl || !endCtrl) return;

      if (value === 'all') {
        // 取消必填
        startCtrl.clearValidators();
        endCtrl.clearValidators();
      } else {
        // 設為必填
        startCtrl.setValidators([Validators.required]);
        endCtrl.setValidators([Validators.required]);
      }

      // ⭐ 一定要呼叫，不然 validator 不會重算
      startCtrl.updateValueAndValidity();
      endCtrl.updateValueAndValidity();
    });

    // 取得 isEdit
    this.route.queryParamMap.subscribe((params) => {
      this.isEdit = params.get('isEdit') === 'Y';

      this.agent = params.get('user') || 'ALL';

      const counterInfo: CounterInfo = {
        requestId: params.get('requestId') || '',
        agent: this.agent,
        airlineIata: params.get('airlineIata') || '',
        flightNo: params.get('flightNo') || '',
        season: params.get('season') || '',
        applyForPeriod: params.get('apply_for_period') || '',
        applicationDate: params.get('applicationDate') || '',
        dayOfWeek: params.get('dayOfWeek') || '',
        startTime: params.get('startTime') || '',
        endTime: params.get('endTime') || '',
        status: params.get('status') || '',
        assignedBy: params.get('assignedBy') || '',
        appliedBy: params.get('appliedBy'),
        assignedCounterArea: params.get('assignedCounterArea') || '',
      };

      const item: ScheduleItem = {
        date: params.get('date') || '',
        flightNo: counterInfo.flightNo,
        time: `${counterInfo.startTime}-${counterInfo.endTime}`,
        status: counterInfo.status,
        counterInfo,
      };

      this.selectItem(item);
    });

    this.getAllCounter();
    this.getSeasons();
  }

  getSeasons() {
    this.apiService.getSeasons().subscribe((res) => {
      console.log(res);
      this.seasonList = res;
      this.seasonOptions = res.map((item) => {
        return { label: item.season, value: item.season };
      });
      this.season = res[0].season;
    });
  }

  /** 取得全部櫃檯資料（當周） */
  getAllCounter(date?: Date) {
    const targetDate = date || new Date();

    // 計算週日（作為 start）
    const dayOfWeek = targetDate.getDay(); // 0(日) ~ 6(六)
    const sunday = new Date(targetDate);
    sunday.setDate(targetDate.getDate() - dayOfWeek); // 回到週日

    // 計算週六（作為 end）
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6); // 週日 + 6 天 = 週六

    // 格式化成 yyyy-mm-dd
    const formatDate = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate(),
      ).padStart(2, '0')}`;

    this.searchDateFrom = formatDate(sunday);
    this.searchDateTo = formatDate(saturday);

    this.currentWeekRange = this.searchDateFrom + '~' + this.searchDateTo;

    const payload: CounterGetAllRequest = {
      dateFrom: this.searchDateFrom,
      dateTo: this.searchDateTo,
      status: 'ALL',
      agent: this.agent,
    };

    this.apiService.getAllCounter(payload).subscribe((res) => {
      // res = MOCK_COUNTER_INFO;
      this.rawData = res;
      this.weeks = this.buildWeeks(this.rawData);
      this.setCurrentWeek(0);
    });
  }

  private buildWeeks(data: CounterInfo[]): ScheduleItem[][][] {
    const weekMap = new Map<number, ScheduleItem[][]>();
    const weekIndex = 0;

    // 建立 7 天空陣列（Sun=0 ... Sat=6）
    weekMap.set(
      weekIndex,
      Array.from({ length: 7 }, () => []),
    );

    const weekArray = weekMap.get(weekIndex)!;

    for (const item of data) {
      if (item.status == 'WITHDRAW') continue;
      if (!item.applicationDate) continue;

      // applicationDate → Date
      const appDate = this.parseApplicationDate(item.applicationDate);

      // JS: Sun=0 ... Sat=6
      const dayIndex = appDate.getDay();

      const yyyy = appDate.getFullYear();
      const mm = String(appDate.getMonth() + 1).padStart(2, '0');
      const dd = String(appDate.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      weekArray[dayIndex].push({
        date: dateStr,
        flightNo: item.airlineIata + item.flightNo,
        time: `${item.startTime.slice(0, 5)}-${item.endTime.slice(0, 5)}`,
        status: statusMap[item.status],
        counterInfo: item,
      });
    }

    return Array.from(weekMap.values());
  }

  private parseApplicationDate(appDate: string): Date {
    // 保險做法：只取日期部分
    const datePart = appDate.split(' ')[0]; // 2026/1/19
    const [y, m, d] = datePart.split('/').map(Number);
    return new Date(y, m - 1, d);
  }

  private getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  goToWeek(index: number) {
    if (index < 0 || index >= this.weeks.length) return;
    this.setCurrentWeek(index);
  }

  prevWeek() {
    this.goToWeek(this.currentWeekIndex - 1);
  }

  nextWeek() {
    this.goToWeek(this.currentWeekIndex + 1);
  }

  private setCurrentWeek(index: number) {
    this.currentWeekIndex = index;
    this.currentWeek = this.weeks[index];
    this.paginatorPages = this.buildPaginatorPages();
  }

  private buildPaginatorPages(): (number | '...')[] {
    const total = this.weeks.length;
    const current = this.currentWeekIndex + 1;

    if (total <= 3) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // 開頭
    if (current <= 2) {
      return [1, 2, 3, '...'];
    }

    // 結尾
    if (current >= total - 1) {
      return ['...', total - 2, total - 1, total];
    }

    // 中間
    return ['...', current - 1, current, current + 1, '...'];
  }

  private getWeekRangeText(week: ScheduleItem[][]): string {
    const allDates = week.flat().map((item) => new Date(item.date));

    if (!allDates.length) return '';

    const min = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const max = new Date(Math.max(...allDates.map((d) => d.getTime())));

    return `${this.formatDate(min)} ~ ${this.formatDate(max)}`;
  }

  private formatDate(date: Date, spliter: string = '/'): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}${spliter}${m}${spliter}${d}`;
  }

  /** season下拉選單 */
  onSeasonChange(event: Option) {
    const item = this.seasonList.find((item) => item.season == event.value);
    const start = parseTwDateTime(item?.startDate);
    const end = parseTwDateTime(item?.endDate);
    this.onDateChange('start', start);
    this.onDateChange('end', end);
    this.season = event.value;
  }

  /** 日期更改 */
  onDateChange(type: 'start' | 'end', event: Date) {
    if (!event) return;

    const yyyy = event.getFullYear();
    const mm = String(event.getMonth() + 1).padStart(2, '0');
    const dd = String(event.getDate()).padStart(2, '0');

    const formatted = `${yyyy}-${mm}-${dd}`;

    if (type === 'start') {
      this.form.get('applyDateStart')?.patchValue(formatted);
      this.form.get('applyDateStart')?.markAsTouched();
    } else {
      this.form.get('applyDateEnd')?.patchValue(formatted);
      this.form.get('applyDateEnd')?.markAsTouched();
    }
  }

  formatTime(input: string | null | undefined): string {
    if (!input) return ''; // 沒輸入
    // 檢查格式是否為 HH:mm 或 H:mm
    const match = input.match(/^([0-1]?\d|2[0-3]):([0-5]\d)$/);
    if (match) {
      return input + ':00'; // 正確格式，加秒
    }
    // 格式不正確就回原值
    return input;
  }

  selectItem(item: ScheduleItem): void {
    const info: CounterInfo = item.counterInfo;
    if (!info) return;

    // flightInfo
    const flightInfo = info.airlineIata + info.flightNo;

    // ===== 時間拆分工具（區域用） =====
    const splitTime = (time?: string): { hour: string; min: string } => {
      if (!time || !time.includes(':')) {
        return { hour: '', min: '' };
      }
      const [hour, min] = time.slice(0, 5).split(':');
      return { hour, min };
    };

    // ===== 拆時間 =====
    const departure = splitTime(''); // 目前沒有來源
    const applyStart = splitTime(info.startTime);
    const applyEnd = splitTime(info.endTime);

    // ===== 分配給 formData（不是 form） =====
    this.formData.departureTimeHour = departure.hour;
    this.formData.departureTimeMin = departure.min;

    this.formData.applyTimeStartHour = applyStart.hour;
    this.formData.applyTimeStartMin = applyStart.min;

    this.formData.applyTimeEndHour = applyEnd.hour;
    this.formData.applyTimeEndMin = applyEnd.min;

    // ===== 期間 =====
    const applyDateStart = info.applyForPeriod
      ? info.applyForPeriod.split('~')[0]
      : '';
    const applyDateEnd = info.applyForPeriod
      ? info.applyForPeriod.split('~')[1]
      : '';

    // ===== weekDays =====
    const weekDaysMap = {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    };

    if (info.dayOfWeek) {
      info.dayOfWeek.split(',').forEach((d) => {
        switch (d) {
          case '1':
            weekDaysMap.mon = true;
            break;
          case '2':
            weekDaysMap.tue = true;
            break;
          case '3':
            weekDaysMap.wed = true;
            break;
          case '4':
            weekDaysMap.thu = true;
            break;
          case '5':
            weekDaysMap.fri = true;
            break;
          case '6':
            weekDaysMap.sat = true;
            break;
          case '7':
            weekDaysMap.sun = true;
            break;
        }
      });
    }

    // ===== patch 給 form（先不放日期）=====
    const patchData: any = {
      flightInfo,
      weekDays: weekDaysMap,

      departureTimeHour: departure.hour,
      departureTimeMin: departure.min,

      applyTimeStartHour: applyStart.hour,
      applyTimeStartMin: applyStart.min,

      applyTimeEndHour: applyEnd.hour,
      applyTimeEndMin: applyEnd.min,
    };

    // ===== 期間（有值才加）=====
    if (info.applyForPeriod) {
      const [applyDateStart, applyDateEnd] = info.applyForPeriod.split('~');

      patchData.applyDateStart = applyDateStart;
      patchData.applyDateEnd = applyDateEnd;
    }

    this.form.patchValue(patchData);

    // ===== 其他狀態 =====
    this.requestId = info.requestId;
    this.season = info.season ? info.season : this.seasonOptions[0].value;
  }

  onCreate() {
    this.isSubmitted = true;
    this.form.markAllAsTouched(); // 標記所有欄位為 touched，顯示錯誤訊息
    if (this.form.invalid) {
      const invalidControls = Object.entries(this.form.controls)
        .filter(([_, control]) => control.invalid)
        .map(([name, control]) => ({
          name,
          value: control.value,
          errors: control.errors,
        }));

      console.log('Invalid fields:', invalidControls);
      return; // 停止送 API
    }

    const formValue = this.form.value;
    // 生成 day_of_week
    const dayMap: Record<string, number> = {
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
      sun: 0,
    };
    const selectedDays = Object.entries(formValue.weekDays)
      .filter(([_, v]) => v)
      .map(([k]) => dayMap[k]);
    const day_of_week = selectedDays.join(',');

    // flightInfo 拆 airline / number
    let airline_iata = '';
    let flight_no = '';
    const match = (formValue.flightInfo || '').match(/^([A-Z]+)(\d+)$/i);
    if (match) {
      airline_iata = match[1].toUpperCase();
      flight_no = match[2];
    }

    const payload: CounterApplicationManualRequest = {
      agent: '',
      airline_iata,
      flight_no,
      season: formValue.seasonType,
      day_of_week,
      apply_for_period: '',
      startDate: formValue.applyDateStart,
      endDate: formValue.applyDateEnd,
      start_time: this.formatTime(
        formValue.applyTimeStartHour + ':' + formValue.applyTimeStartMin,
      ),
      end_time: this.formatTime(
        formValue.applyTimeEndHour + ':' + formValue.applyTimeEndMin,
      ),
    };

    this.apiService.addCounterApplication(payload).subscribe(
      (res) => {
        this.commonService
          .openDialog({
            title: '申請成功',
            message: '已申請內容，請等待審核',
            confirmText: '確定',
            cancelText: '',
          })
          .pipe(take(1))
          .subscribe();
      },
      (err) => {
        this.commonService
          .openDialog({
            title: '申請失敗',
            message: err.error,
            confirmText: '確定',
            cancelText: '',
          })
          .pipe(take(1))
          .subscribe();
      },
    );
  }

  onModify() {
    const week = this.form.value.weekDays; // { mon: true, tue: false ... }
    const dayMap: Record<string, number> = {
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
      sun: 0, // Sunday = 0
    };

    const selectedDays = Object.entries(week)
      .filter(([key, value]) => value)
      .map(([key]) => dayMap[key]);

    const day_of_week = selectedDays.join(',');

    let airline_iata = '';
    let flight_no = '';
    const flightInfo = this.form.value.flightInfo || '';
    const match = flightInfo.match(/^([A-Z]+)(\d+)$/i);
    if (match) {
      airline_iata = match[1].toUpperCase(); // 前面字母
      flight_no = match[2]; // 後面數字
    }

    const payload: CounterApplyEditRequest = {
      requestId: this.requestId,
      airlineIata: airline_iata || '', // 對應 flightInfo
      flightNo: flight_no || '', // 也可以拆成航班號和航空公司
      season: this.season,
      dayOfWeek: day_of_week,
      apply_for_period: '',
      startDate: this.form.value.applyDateStart || '',
      endDate: this.form.value.applyDateEnd || '',
      startTime: this.formatTime(this.form.value.applyTimeStart),
      endTime: this.formatTime(this.form.value.applyTimeEnd),
    };

    this.apiService.applyEdit(payload).subscribe({
      next: () => console.log('修改成功'),
      error: (err) => console.error('修改失敗', err),
    });
  }

  onWithdraw() {
    if (this.requestId == '') return;
    this.apiService.userWithdraw(this.requestId).subscribe(() => {
      this.getAllCounter();
    });
  }

  onSearchDateChange(date: Date) {
    this.getAllCounter(date);
  }

  /** 時間改變，只更新對應 FormControl 與 formData */
  onTimeChange(controlName: string, option: Option): void {
    const v = option?.value ? String(option.value) : '';

    // 更新 formData
    (this.formData as any)[controlName] = v;

    // 更新對應 FormControl
    if (this.form?.get(controlName)) {
      this.form.get(controlName)!.setValue(v);
    }
  }

  get isWeekDaysInvalid(): boolean {
    const weekDays = this.form.get('weekDays')?.value || {};
    // 至少要有一天選中
    return !Object.values(weekDays).some((v) => v) && this.form.touched;
  }
}
