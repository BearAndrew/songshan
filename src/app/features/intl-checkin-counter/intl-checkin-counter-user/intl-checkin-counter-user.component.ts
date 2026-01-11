import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DropdownSecondaryComponent } from '../../../shared/components/dropdown-secondary/dropdown-secondary.component';
import { Option } from '../../../shared/components/dropdown/dropdown.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarTriggerComponent } from '../../../shared/components/calendar-trigger/calendar-trigger.component';
import { ApiService } from '../../../core/services/api-service.service';
import {
  CounterGetAllRequest,
  CounterInfo,
  statusMap,
} from '../../../models/counter.model';

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
    DropdownSecondaryComponent,
    CalendarTriggerComponent,
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
    islands: [] as string[],
    seasonType: '' as 'all' | 'other' | '',
    applyDateStart: null,
    applyDateEnd: null,
  };
  get islandList(): FormArray {
    return this.form.get('islands') as FormArray;
  }
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

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  ngOnInit() {
    /** 申請內容 */
    this.form = this.fb.group({
      flightInfo: [''],
      departureTime: [''],
      applyTimeStart: [''],
      applyTimeEnd: [''],
      islands: this.fb.array([]),
      seasonType: [''],
      applyDateStart: [''],
      applyDateEnd: [''],
    });

    // 至少加入一筆
    this.addIsland();

    this.form.valueChanges.subscribe((value) => {
      this.formData = {
        flightInfo: value.flightInfo,
        departureTime: value.departureTime,
        applyTimeStart: value.applyTimeStart,
        applyTimeEnd: value.applyTimeEnd,
        islands: value.islands,
        seasonType: value.seasonType,
        applyDateStart: value.applyDateStart,
        applyDateEnd: value.applyDateEnd,
      };
    });

    this.getAllCounter();
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
      console.log(res);
      this.rawData = res;
      this.weeks = this.buildWeeks(this.rawData);
      this.setCurrentWeek(0);
    });
  }

  // private buildWeeks(data: ScheduleItem[]): ScheduleItem[][][] {
  //   const weekMap = new Map<string, ScheduleItem[][]>();
  //   for (const item of data) {
  //     const date = new Date(item.date);
  //     const monday = this.getMonday(date).toISOString().slice(0, 10);

  //     if (!weekMap.has(monday)) {
  //       weekMap.set(
  //         monday,
  //         Array.from({ length: 7 }, () => [])
  //       );
  //     }

  //     const dayIndex = (date.getDay() + 6) % 7; // Mon=0
  //     weekMap.get(monday)![dayIndex].push(item);
  //   }

  //   return Array.from(weekMap.values());
  // }
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

    console.log(data);
    for (const item of data) {
      // dayOfWeek 字串拆成數字
      const days = item.dayOfWeek.split(',').map((n) => parseInt(n, 10));
      console.log(days);

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

    const a = Array.from(weekMap.values());
    console.log(a);
    return a;
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

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
  }

  /** ===== 申請內容 ===== */
  setSeasonType(type: 'all' | 'other') {
    this.form.get('seasonType')?.setValue(type);
  }

  addIsland() {
    this.islandList.push(this.fb.control(''));
  }

  reomveIsland(index: number) {
    if (this.islandList.length <= 1) return;
    this.islandList.removeAt(index);
  }

  updateIsland(index: number, value: string) {
    this.islandList.at(index).setValue(value);
  }
}
