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
} from '@angular/forms';
import { ApiService } from '../../../core/services/api-service.service';
import {
  CounterAdminApprovalRequest,
  CounterApplyEditRequest,
  CounterGetAllRequest,
  CounterInfo,
  statusMap,
} from '../../../models/counter.model';
import { ActivatedRoute } from '@angular/router';

interface SeasonCounterItem {
  checked: boolean; // 是否被選取
  type: string; // 顯示文字（島櫃）
  islandNo: string; // 第一個 input
  counterFrom: string; // 櫃檯起
  counterTo: string; // 櫃檯迄
}

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
}

@Component({
  selector: 'app-intl-checkin-counter-admin',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownSecondaryComponent,
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
    departureTime: '',
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
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
  ];

  season: string = '';

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

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute
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

    this.form.valueChanges.subscribe((value) => {
      this.formData = {
        flightInfo: value.flightInfo,
        departureTime: value.departureTime,
        seasonType: value.seasonType,
        applyTimeInterval: value.applyTimeInterval,
        applyDateInterval: value.applyDateInterval,
        rejectReason: value.rejectReason,
      };
    });

    this.route.queryParamMap.subscribe((params) => {
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

      // 轉換成表單需要的格式
      const flightInfo = applyRequest.airlineIata + applyRequest.flightNo;
      const departureTime = '';
      const startTime = applyRequest.startTime.slice(0, -3) || '';
      const endTime = applyRequest.endTime.slice(0, -3) || '';
      this.season = applyRequest.season;

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
        startTime,
        endTime,
        applyTimeInterval: applyRequest.apply_for_period,
        weekDays: weekDaysMap,
      });
    });

    this.getAllCounter();
  }

  /** 取得全部櫃檯資料（當周） */
  private getAllCounter() {
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
      console.log(res);
      this.ganttDays = this.mapCounterToGantt(res, dateFrom, dateTo);
      this.infoCardList = this.mapCounterToInfoCards(res, dateFrom, dateTo);
      console.log(this.ganttDays)
    });
  }

  private mapCounterToInfoCards(
    data: CounterInfo[],
    dateFrom: string,
    dateTo: string
  ): InfoCard[] {
    return data.map((item) => {
      // 航班
      const flightNo = `${item.airlineIata}${item.flightNo}`;

      // 時間
      const time =
        item.startTime && item.endTime
          ? `${item.startTime.slice(0, 5)}-${item.endTime.slice(0, 5)}`
          : '';

      // 日期顯示
      const date = item.applyForPeriod;

      return {
        flightNo,
        time,
        date,
        status: statusMap[item.status] || item.status,
      };
    });
  }

  private mapCounterToGantt(
    data: CounterInfo[],
    dateFrom: string,
    dateTo: string
  ): GanttDay[] {
    const ganttMap = new Map<string, GanttDay>();

    const start = new Date(dateFrom);
    const end = new Date(dateTo);

    data.forEach((item) => {
      /** row 來源：assignedCounterArea */
      const row = Number(item.assignedCounterArea);

      // 條件：必須是 1~6 的數字
      if (!row || isNaN(row) || row < 1 || row > 6) {
        return; // 直接忽略這筆
      }

      /** dayOfWeek → Set<number> */
      const weekSet = new Set(
        (item.dayOfWeek || '').split(',').map((d) => Number(d))
      );

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        // JS: Sun=0 → API: Sun=7
        const apiDay = d.getDay() === 0 ? 7 : d.getDay();
        if (!weekSet.has(apiDay)) continue;

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const dateKey = `${yyyy}/${mm}/${dd}`;

        if (!ganttMap.has(dateKey)) {
          ganttMap.set(dateKey, {
            date: dateKey,
            items: [],
          });
        }

        ganttMap.get(dateKey)!.items.push({
          row, //  對應 assignedCounterArea
          data: {
            flightNo: `${item.airlineIata}${item.flightNo}`,
            time: `${item.startTime?.slice(0, 5)}-${item.endTime?.slice(0, 5)}`,
          },
        });
      }
    });

    /** 轉陣列 + 日期排序 */
    return Array.from(ganttMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }

  /** 核准或駁回 */
  onApproval(isApprove: boolean) {
    const payload: CounterAdminApprovalRequest = {
      requestId: this.requestId,
      reason: this.form.value.reason,
      assignedCounterArea: this.form.value.assignedCounterArea,
      assignedCounterBooth: this.form.value.assignedCounterBooth,
      assignedBy: '',
      status: isApprove ? 'APPROVE' : 'REJECT',
    };

    this.apiService.adminApproval(payload).subscribe({
      next: () => console.log('核准成功'),
      error: (err) => console.error('核准失敗', err),
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

  /** ===== 申請內容 ===== */
  setSeasonType(type: 'all' | 'other') {
    this.form.get('seasonType')?.setValue(type);
  }

  getItemsByRow(day: GanttDay, row: number): GanttItem[] {
    return day.items.filter((item) => item.row === row);
  }
}
