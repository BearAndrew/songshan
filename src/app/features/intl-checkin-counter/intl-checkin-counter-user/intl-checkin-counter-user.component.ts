import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
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

interface ScheduleItem {
  date: string; // YYYY-MM-DD
  flightNo: string;
  time: string;
  status: string;
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
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
    departureTime: '',
    applyTimeStart: '',
    applyTimeEnd: '',
    applyDateStart: null,
    applyDateEnd: null,
  };

  seasonOptions: Option[] = [];

  isEdit: boolean = false;

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

  dateFrom: string = '';
  dateTo: string = '';
  season: string = '';
  requestId: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private counterService: CounterService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    /** 申請內容 */
    this.form = this.fb.group({
      flightInfo: ['123'],
      departureTime: [''],
      applyTimeStart: [''],
      applyTimeEnd: [''],
      seasonType: ['all'],
      applyDateStart: [''],
      applyDateEnd: [''],
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

    // 取得 isEdit
    this.route.queryParamMap.subscribe((params) => {
      const isEditParam = params.get('isEdit');
      this.isEdit = isEditParam === 'Y';
      // 取得其他參數
      const applyRequest: CounterApplyEditRequest = {
        requestId: params.get('requestId') || '',
        airlineIata: params.get('airlineIata') || '',
        flightNo: params.get('flightNo') || '',
        season: params.get('season') || '',
        apply_for_period: params.get('apply_for_period') || '',
        startDate: params.get('startDate') || '',
        endDate: params.get('endDate') || '',
        dayOfWeek: params.get('dayOfWeek') || '',
        startTime: params.get('startTime') || '',
        endTime: params.get('endTime') || '',
      };

      this.requestId = applyRequest.requestId;
      this.season = applyRequest.season;

      // 轉換成表單需要的格式
      const flightInfo = applyRequest.airlineIata + applyRequest.flightNo;
      const departureTime = '';
      const applyTimeStart = applyRequest.startTime.slice(0, -3) || '';
      const applyTimeEnd = applyRequest.endTime.slice(0, -3) || '';
      const applyDateStart = applyRequest.apply_for_period
        ? applyRequest.apply_for_period.split('~')[0]
        : '';
      const applyDateEnd = applyRequest.apply_for_period
        ? applyRequest.apply_for_period.split('~')[1]
        : '';

      // weekDays
      const weekDaysMap = {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
      };
      if (applyRequest.dayOfWeek) {
        applyRequest.dayOfWeek.split(',').forEach((d) => {
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

      // patch 表單
      this.form.patchValue({
        flightInfo,
        departureTime,
        applyTimeStart,
        applyTimeEnd,
        applyDateStart,
        applyDateEnd,
        weekDays: weekDaysMap,
      });
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
  getAllCounter() {
    const today = new Date();

    // 起始：今天
    const yyyy1 = today.getFullYear();
    const mm1 = String(today.getMonth() + 1).padStart(2, '0');
    const dd1 = String(today.getDate()).padStart(2, '0');
    const dateFrom = `${yyyy1}-${mm1}-${dd1}`;

    // 結束：今天 + 7 天
    const end = new Date(today);
    end.setDate(end.getDate() + 7);

    const yyyy2 = end.getFullYear();
    const mm2 = String(end.getMonth() + 1).padStart(2, '0');
    const dd2 = String(end.getDate()).padStart(2, '0');
    const dateTo = `${yyyy2}-${mm2}-${dd2}`;

    const payload: CounterGetAllRequest = {
      dateFrom,
      dateTo,
      status: 'ALL',
      agent: 'ALL',
    };

    this.apiService.getAllCounter(payload).subscribe((res) => {
      this.rawData = res;
      this.weeks = this.buildWeeks(this.rawData);
      this.setCurrentWeek(0);
    });
  }

  private buildWeeks(data: CounterInfo[]): ScheduleItem[][][] {
    const weekMap = new Map<number, ScheduleItem[][]>();
    const weekIndex = 0;

    if (!weekMap.has(weekIndex)) {
      // 建立 7 天空陣列，Mon=0 ... Sun=6
      weekMap.set(
        weekIndex,
        Array.from({ length: 7 }, () => [])
      );
    }

    const weekArray = weekMap.get(weekIndex)!;

    // 計算本週 Monday 日期
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun ... 6=Sat
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // 回到週一

    for (const item of data) {
      // dayOfWeek 字串拆成數字
      const days = item.dayOfWeek.split(',').map((n) => parseInt(n, 10));

      for (let day of days) {
        // 將 dayOfWeek 轉成 index：Mon=0, Sun=6
        const index = day === 0 || day === 7 ? 6 : day - 1;

        // 對應日期 = Monday + index 天
        const itemDate = new Date(monday);
        itemDate.setDate(monday.getDate() + index);
        const yyyy = itemDate.getFullYear();
        const mm = String(itemDate.getMonth() + 1).padStart(2, '0');
        const dd = String(itemDate.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        weekArray[index].push({
          date: dateStr,
          flightNo: item.airlineIata + item.flightNo,
          time: `${item.startTime.slice(0, -3)}-${item.endTime.slice(0, -3)}`,
          status: statusMap[item.status],
        });
      }
    }

    return Array.from(weekMap.values());
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
    this.currentWeekRange = this.getWeekRangeText(this.currentWeek);
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
    const yyyy = event.getFullYear();
    const mm = String(event.getMonth() + 1).padStart(2, '0'); // 月份要 +1
    const dd = String(event.getDate()).padStart(2, '0');

    const formatted = `${yyyy}-${mm}-${dd}`;
    if (type === 'start') {
      this.dateFrom = formatted || '';
    } else {
      this.dateTo = formatted || '';
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

  onCreate() {
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

    // 組 payload
    const payload: CounterApplicationManualRequest = {
      agent: '',
      airline_iata: airline_iata || '', // 對應 flightInfo
      flight_no: flight_no || '', // 也可以拆成航班號和航空公司
      season: this.season,
      day_of_week: day_of_week,
      apply_for_period: '',
      startDate: this.dateFrom || '',
      endDate: this.dateTo || '',
      start_time: this.formatTime(this.form.value.applyTimeStart),
      end_time: this.formatTime(this.form.value.applyTimeEnd),
    };
    console.log(payload);
    this.apiService.addCounterApplication(payload).subscribe((res) => {
      console.log(res);
    });
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
      startDate: this.dateFrom || '',
      endDate: this.dateTo || '',
      startTime: this.formatTime(this.form.value.applyTimeStart),
      endTime: this.formatTime(this.form.value.applyTimeEnd),
    };

    this.apiService.applyEdit(payload).subscribe({
      next: () => console.log('修改成功'),
      error: (err) => console.error('修改失敗', err),
    });
  }
}
