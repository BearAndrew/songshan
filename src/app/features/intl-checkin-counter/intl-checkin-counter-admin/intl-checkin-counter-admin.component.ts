import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DropdownSecondaryComponent } from '../../../shared/components/dropdown-secondary/dropdown-secondary.component';
import { Option } from '../../../shared/components/dropdown/dropdown.component';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../../core/services/api-service.service';
import {
  CounterAdminApprovalRequest,
  CounterApplyEditRequest,
  CounterGetAllRequest,
  CounterInfo,
  statusMap,
} from '../../../models/counter.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CalendarTriggerComponent } from '../../../shared/components/calendar-trigger/calendar-trigger.component';
import { MOCK_COUNTER_INFO } from './fake-data';
import { take } from 'rxjs';
import { CommonService } from '../../../core/services/common.service';
import { environment } from '../../../../environments/environment';
import { STATUS_COLOR_MAP } from '../checkin-color-mapping';

export interface GanttItem {
  row: number; // 1~6
  data: {
    flightNo: string;
    time: string;
  };
}

export interface GanttDay {
  date: string;
  items: GanttItem[];
}

export interface InfoCard {
  flightNo: string;
  time: string;
  date: string;
  status: string;
  item: CounterInfo;
}

@Component({
  selector: 'app-intl-checkin-counter-admin',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownSecondaryComponent,
    CalendarTriggerComponent,
    RouterLink,
  ],
  templateUrl: './intl-checkin-counter-admin.component.html',
  styleUrl: './intl-checkin-counter-admin.component.scss',
})
export class IntlCheckinCounterAdminComponent {
  ganttRows = [1, 2, 3, 4, 5, 6];
  ganttDays: GanttDay[] = [];
  infoCardList: InfoCard[] = [];

  /** 申請內容 */
  form!: FormGroup;
  formData = {
    flightInfo: '',
    departureTimeHour: '',
    departureTimeMin: '',
    departureTime: '',
    startTimeHour: '',
    startTimeMin: '',
    endTimeHour: '',
    endTimeMin: '',
    seasonType: '' as 'all' | 'other' | '',
    applyTimeInterval: '',
    applyDateInterval: '',
    rejectReason: '',
  };

  requestId: string = '';

  islandOptions: Option[] = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
  ];
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
  exportOptions: Option[] = [
    { label: '指定', value: 'CUSTOM' },
    { label: '當周', value: 'WEEK' },
    { label: '雙周', value: 'BIWEEK' },
    { label: '當月', value: 'MONTH' },
    { label: '當季', value: 'SEASON' },
  ];

  season: string = '';
  currentWeekRange: string = '';
  searchDate: Date = new Date();
  searchDateFrom: string = '';
  searchDateTo: string = '';
  today: Date = new Date();

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
  /** 是否送出核准或駁回 */
  isSubmitted = false;
  /** 是否有選擇資料 */
  hasData = false;

  /** 下載 CSV */
  csvParam = 'WEEK';
  baseUrl = environment.apiBaseUrl + '/CounterExport';
  csvUrl = '';
  exportStart: string = '';
  exportEnd: string = '';

  /** 權限管控 */
  agent: string = '';
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
      flightInfo: [''],
      departureTime: [''],
      assignedCounterArea: [''],
      assignedCounterBooth: [''],
      seasonType: [''],
      startTime: [''],
      endTime: [''],
      applyDateInterval: [''],
      reason: [''],
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
    this.form.disable();
    this.form.get('reason')?.enable();
    this.onExportIntervalChange({ label: '當周', value: 'WEEK' }); // 主動觸發一次

    this.route.queryParamMap.subscribe((params) => {
      if (!params || !params.keys.length) {
        return; // 沒有路由參數就直接返回
      }

      this.agent = params.get('user') || 'ALL';

      const item: CounterInfo = {
        requestId: params.get('requestId') || '',
        agent: this.agent,
        airlineIata: params.get('airlineIata') || '',
        flightNo: params.get('flightNo') || '',
        season: params.get('season') || '',
        applyForPeriod: params.get('apply_for_period') || '',
        applicationDate: '',
        dayOfWeek: params.get('dayOfWeek') || '',
        startTime: params.get('startTime') || '',
        endTime: params.get('endTime') || '',
        status: '',
        assignedBy: '',
        appliedBy: null,
        assignedCounterArea: '',
      };

      this.selectItem(item);
    });

    this.getAllCounter();
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

    const dateFrom = this.searchDateFrom;
    const dateTo = this.searchDateTo;

    const payload: CounterGetAllRequest = {
      dateFrom,
      dateTo,
      status: 'ALL',
      agent: this.agent,
    };

    this.apiService.getAllCounter(payload).subscribe((res) => {
      // res = MOCK_COUNTER_INFO
      this.ganttDays = this.mapCounterToGantt(res);
      this.infoCardList = this.mapCounterToInfoCards(res, dateFrom, dateTo);
    });
  }

  private mapCounterToInfoCards(
    data: CounterInfo[],
    dateFrom: string,
    dateTo: string,
  ): InfoCard[] {
    return data.map((item) => {
      // 航班
      const flightNo = `${item.airlineIata}${item.flightNo}` || `\u00A0`;

      // 時間
      const time =
        item.startTime && item.endTime
          ? `${item.startTime.slice(0, 5)}-${item.endTime.slice(0, 5)}`
          : `\u00A0`;

      // 日期顯示
      const date = item.applyForPeriod || `\u00A0`;

      return {
        flightNo,
        time,
        date,
        status: statusMap[item.status],
        item,
      };
    });
  }

  /** 將「2026/1/27 上午 12:00:00」轉成 yyyy-MM-dd */
  private parseChineseDateToYMD(input?: string): string {
    if (!input) return '';

    // 只取日期：2026/1/27
    const datePart = input.split(' ')[0];
    const [y, m, d] = datePart.split('/').map(Number);

    if (!y || !m || !d) return '';

    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  // 舊版
  // private mapCounterToGantt(
  //   data: CounterInfo[],
  //   dateFrom: string,
  //   dateTo: string,
  // ): GanttDay[] {
  //   const ganttMap = new Map<string, GanttDay>();

  //   const start = new Date(dateFrom);
  //   const end = new Date(dateTo);

  //   data.forEach((item) => {
  //     /** row 來源：assignedCounterArea */
  //     const row = Number(item.assignedCounterArea);

  //     // 條件：必須是 1~6 的數字
  //     if (!row || isNaN(row) || row < 1 || row > 6) {
  //       return; // 直接忽略這筆
  //     }

  //     /** dayOfWeek → Set<number> */
  //     const weekSet = new Set(
  //       (item.dayOfWeek || '').split(',').map((d) => Number(d)),
  //     );

  //     for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
  //       // JS: Sun=0 → API: Sun=7
  //       const apiDay = d.getDay() === 0 ? 7 : d.getDay();
  //       if (!weekSet.has(apiDay)) continue;

  //       const yyyy = d.getFullYear();
  //       const mm = String(d.getMonth() + 1).padStart(2, '0');
  //       const dd = String(d.getDate()).padStart(2, '0');
  //       const dateKey = `${yyyy}/${mm}/${dd}`;

  //       if (!ganttMap.has(dateKey)) {
  //         ganttMap.set(dateKey, {
  //           date: dateKey,
  //           items: [],
  //         });
  //       }

  //       ganttMap.get(dateKey)!.items.push({
  //         row, //  對應 assignedCounterArea
  //         data: {
  //           flightNo: `${item.airlineIata}${item.flightNo}`,
  //           time: `${item.startTime?.slice(0, 5)}-${item.endTime?.slice(0, 5)}`,
  //         },
  //       });
  //     }
  //   });

  //   /** 轉陣列 + 日期排序 */
  //   return Array.from(ganttMap.values()).sort((a, b) =>
  //     a.date.localeCompare(b.date),
  //   );
  // }

  private mapCounterToGantt(data: CounterInfo[]): GanttDay[] {
    const ganttMap = new Map<string, GanttDay>();

    data.forEach((item) => {
      if (item.status !== 'APPROVE') return;

      const row = Number(item.assignedCounterArea);
      if (!row || isNaN(row) || row < 1 || row > 6) return;

      if (!item.applicationDate) return;

      const dateKey = this.formatApplicationDate(item.applicationDate);

      if (!ganttMap.has(dateKey)) {
        ganttMap.set(dateKey, {
          date: dateKey,
          items: [],
        });
      }

      ganttMap.get(dateKey)!.items.push({
        row,
        data: {
          flightNo: `${item.airlineIata}${item.flightNo}`,
          time: `${item.startTime?.slice(0, 5)}-${item.endTime?.slice(0, 5)}`,
        },
      });
    });

    return Array.from(ganttMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }

  private formatApplicationDate(appDate: string): string {
    // "2026/1/19 上午 12:00:00"
    const datePart = appDate.split(' ')[0]; // 2026/1/19
    const [y, m, d] = datePart.split('/');

    return `${y}/${m.padStart(2, '0')}/${d.padStart(2, '0')}`;
  }

  selectItem(item: CounterInfo): void {
    if (!item) return;
    this.hasData = true;

    // ===== flightInfo =====
    const flightInfo = item.airlineIata + item.flightNo;

    // ===== 時間拆分工具 =====
    const splitTime = (time?: string): { hour: string; min: string } => {
      if (!time || !time.includes(':')) {
        return { hour: '', min: '' };
      }
      const [hour, min] = time.slice(0, 5).split(':');
      return { hour, min };
    };

    // ===== 拆時間 =====
    const departure = splitTime(''); // 目前無來源
    const start = splitTime(item.startTime);
    const end = splitTime(item.endTime);

    // ===== 指派給 formData =====
    this.formData.departureTimeHour = departure.hour;
    this.formData.departureTimeMin = departure.min;

    this.formData.startTimeHour = start.hour;
    this.formData.startTimeMin = start.min;

    this.formData.endTimeHour = end.hour;
    this.formData.endTimeMin = end.min;

    // ===== 期間 =====
    console.log(item.applicationDate);
    console.log(this.parseChineseDateToYMD(item.applicationDate));
    const applyDateInterval =
      this.parseChineseDateToYMD(item.applicationDate) || '';

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

    if (item.dayOfWeek) {
      item.dayOfWeek.split(',').forEach((d) => {
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

    // ===== patch 非時間欄位 =====
    this.form.patchValue({
      flightInfo,
      applyDateInterval,
      weekDays: weekDaysMap,
    });

    // ===== 狀態 =====
    this.requestId = item.requestId;
    this.season = item.season;
  }

  /** 核准或駁回 */
  onApproval(isApprove: boolean) {
    const areaCtrl = this.form.get('assignedCounterArea');
    if (isApprove && areaCtrl?.value == '') {
      this.isSubmitted = true;
      return;
    }

    const payload: CounterAdminApprovalRequest = {
      requestId: this.requestId,
      reason: this.form.value.reason,
      assignedCounterArea: areaCtrl?.value,
      assignedCounterBooth: '',
      assignedBy: '',
      status: isApprove ? 'APPROVE' : 'REJECT',
    };
    console.log(payload);

    this.apiService.adminApproval(payload).subscribe({
      next: () => {
        this.getAllCounter();
        if (isApprove) {
          this.commonService
            .openDialog({
              title: '核准成功',
              message: '已核准申請內容',
              confirmText: '確定',
              cancelText: '',
            })
            .pipe(take(1))
            .subscribe();
        } else {
          this.commonService
            .openDialog({
              title: '駁回成功',
              message: '已駁回申請內容',
              confirmText: '確定',
              cancelText: '',
            })
            .pipe(take(1))
            .subscribe();
        }
      },
      error: (err) => {
        if (isApprove) {
          this.commonService
            .openDialog({
              title: '核准失敗',
              message: err.error,
              confirmText: '確定',
              cancelText: '',
            })
            .pipe(take(1))
            .subscribe();
        } else {
          this.commonService
            .openDialog({
              title: '駁回失敗',
              message: err.error,
              confirmText: '確定',
              cancelText: '',
            })
            .pipe(take(1))
            .subscribe();
        }
      },
    });
  }

  /** 修改 */
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
      airlineIata: airline_iata || '',
      flightNo: flight_no || '',
      season: this.season,
      dayOfWeek: day_of_week,
      apply_for_period: this.form.value.applyDateInterval,
      startDate: '',
      endDate: '',
      startTime: this.formatTime(this.form.value.startTime),
      endTime: this.formatTime(this.form.value.endTime),
    };

    this.apiService.applyEdit(payload).subscribe({
      next: () => console.log('修改成功'),
      error: (err) => console.error('修改失敗', err),
    });
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

  onSearchDateChange(date: Date) {
    this.getAllCounter(date);
  }

  /** ===== 申請內容 ===== */
  setSeasonType(type: 'all' | 'other') {
    this.form.get('seasonType')?.setValue(type);
  }

  getItemsByRow(day: GanttDay, row: number): GanttItem[] {
    return day.items.filter((item) => item.row === row);
  }

  /** 時間改變更改 form */
  onTimeChange(controlName: string, type: 'HH' | 'mm', option: Option): void {
    // option.value 預期為字串，例如 '08' 或 '30'
    const v = option && option.value ? String(option.value) : '';

    // 儲存 hour/min 到 this.formData 中對應的欄位（例如 departureTimeHour / departureTimeMin）
    const hourKey = `${controlName}Hour`;
    const minKey = `${controlName}Min`;
    (this.formData as any)[type === 'HH' ? hourKey : minKey] = v;

    // 由目前存的 hour/min 組成時間字串，若兩者皆為空則設定為空字串
    const hh = ((this.formData as any)[hourKey] || '').toString();
    const mm = ((this.formData as any)[minKey] || '').toString();

    let combined = '';
    if (hh !== '' || mm !== '') {
      const paddedH = (hh === '' ? '00' : hh).padStart(2, '0');
      const paddedM = (mm === '' ? '00' : mm).padStart(2, '0');
      combined = `${paddedH}:${paddedM}`;
    }

    // 更新表單與 formData 的對應欄位
    if (this.form && this.form.get(controlName)) {
      this.form.get(controlName)!.setValue(combined);
    }
    (this.formData as any)[controlName] = combined;
  }

  /** 島櫃下拉選單變更 */
  onSeasonChange(option: Option): void {
    const ctrl = this.form.get('assignedCounterArea');
    ctrl?.setValue(option?.value ?? '');
    console.log(ctrl?.value);
  }

  /** 匯入 */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // ✔ 檢查是否為 Excel
    const isExcel =
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';

    if (!isExcel) {
      this.commonService
        .openDialog({
          message: '請上傳 Excel 檔案 (.xls, .xlsx)',
          confirmText: '確定',
          cancelText: '',
        })
        .pipe(take(1))
        .subscribe();
      input.value = '';
      return;
    }

    // ✔ 建立 FormData
    const formData = new FormData();
    formData.append('file', file);

    // ✔ 呼叫 API
    this.apiService.importCounter(formData).subscribe({
      next: (res) => {
        this.commonService
          .openDialog({
            message: 'Excel 匯入成功',
            confirmText: '確定',
            cancelText: '',
          })
          .pipe(take(1))
          .subscribe();

        input.value = ''; // 清空 input，避免同檔案無法再選
      },
      error: (err) => {
        this.commonService
          .openDialog({
            title: 'Excel 匯入失敗',
            message: err.error,
            confirmText: '確定',
            cancelText: '',
          })
          .pipe(take(1))
          .subscribe();
      },
    });
  }

  /** 匯出區間選擇 */
  onExportIntervalChange(option: Option) {
    this.csvParam = option.value;
    this.csvUrl = `${this.baseUrl}/${option.value}`;

    if (option.value === 'CUSTOM') {
      const today = new Date();

      // JS：0=週日, 1=週一, ..., 6=週六
      const day = today.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;

      // 計算週一
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);

      // 計算週日
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      // 日期格式化 yyyy-MM-dd
      const formatYMD = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      this.exportStart = formatYMD(monday);
      this.exportEnd = formatYMD(sunday);

      console.log('Start:', this.exportStart, 'End:', this.exportEnd);

      // 同步更新 csvUrl
      this.csvUrl = `${this.baseUrl}/${option.value}/${this.exportStart}/${this.exportEnd}`;
    }

    console.log('CSV URL:', this.csvUrl);
  }

  /** 匯出指定週 */
  onExportDateChange(type: 'start' | 'end', date: Date) {
    if (!date) return;

    const target = new Date(date);

    // JS：0=週日, 1=週一, ..., 6=週六
    const day = target.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    // 週一
    const monday = new Date(target);
    monday.setDate(target.getDate() + diffToMonday);

    // 週日
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // 日期格式化 yyyy-MM-dd
    const formatYMD = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    if (type === 'start') {
      this.exportStart = formatYMD(monday);
    } else if (type === 'end') {
      this.exportEnd = formatYMD(sunday);
    }

    // 如果你想即時組 URL（可選）
    this.csvUrl = `${this.baseUrl}/CUSTOM/${this.exportStart || ''}/${this.exportEnd || ''}`;

    console.log('Start:', this.exportStart, 'End:', this.exportEnd);
    console.log('CSV URL:', this.csvUrl);
  }

  print() {
    console.log(this.csvUrl);
  }
}
