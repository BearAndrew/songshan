import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api-service.service';
import { environment } from '../../../../environments/environment';
import {
  CounterGetAllRequest,
  CounterInfo,
} from '../../../models/counter.model';
import { Option } from '../../../shared/components/dropdown/dropdown.component';
import { OpsSelectComponent } from '../components/ops-select.component';
import { ApplyType, getApplyType, hhmm } from '../reset-shared';

interface Booking {
  flight: string;
  dest: string;
  time: string; // 06:00-07:00
  days: number[]; // 1..7
  type: ApplyType;
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, OpsSelectComponent],
  templateUrl: './admin-reports.component.html',
  styles: [':host{display:flex;flex-direction:column;flex:1;min-height:0;}'],
})
export class AdminReportsComponent implements OnInit {
  view: 'week' | 'day' = 'week';
  dayIdx = 0; // 0=一 .. 6=日

  counters = [1, 2, 3, 4, 5, 6];
  dayLabels = ['一', '二', '三', '四', '五', '六', '日'];
  dayDates: string[] = []; // MM-DD

  weekStart!: Date; // 週一
  /** sched[counterIdx] = bookings */
  sched: Booking[][] = [[], [], [], [], [], []];

  baseUrl = environment.apiBaseUrl + '/CounterExport';

  airlineFilter = '';
  airlineSelectOptions: Option[] = [{ label: '全部', value: '' }];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.weekStart = this.mondayOf(new Date());
    this.load();
  }

  private mondayOf(d: Date): Date {
    const r = new Date(d);
    const day = r.getDay(); // 0=Sun
    const diff = day === 0 ? -6 : 1 - day;
    r.setDate(r.getDate() + diff);
    r.setHours(0, 0, 0, 0);
    return r;
  }
  private fmt(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }
  private mmdd(d: Date): string {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${m}-${dd}`;
  }
  private addDays(d: Date, n: number): Date {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  }

  get weekEnd(): Date {
    return this.addDays(this.weekStart, 6);
  }
  get weekRangeLabel(): string {
    return `${this.fmt(this.weekStart)} (一) – ${this.fmt(this.weekEnd)} (日)`;
  }
  get selectedDate(): Date {
    return this.addDays(this.weekStart, this.dayIdx);
  }
  get selectedDateLabel(): string {
    return this.fmt(this.selectedDate);
  }

  load(): void {
    this.dayDates = this.dayLabels.map((_, i) => this.mmdd(this.addDays(this.weekStart, i)));

    const payload: CounterGetAllRequest = {
      dateFrom: this.fmt(this.weekStart),
      dateTo: this.fmt(this.weekEnd),
      status: 'ALL',
      agent: 'ALL',
    };
    this.apiService.getAllCounter(payload).subscribe((res) => {
      this.sched = this.build(res || []);
    });
  }

  private build(data: CounterInfo[]): Booking[][] {
    const out: Booking[][] = [[], [], [], [], [], []];
    for (const info of data) {
      if (info.status !== 'APPROVE') continue;
      const counter = Number(info.assignedCounterArea);
      if (!counter || counter < 1 || counter > 6) continue;
      const s = hhmm(info.startTime);
      const e = hhmm(info.endTime);
      if (!s || !e) continue;

      const days = (info.dayOfWeek || '')
        .split(',')
        .map((d) => Number(d.trim()))
        .map((n) => (n === 0 ? 7 : n)) // 後端週日可能為 0,統一成 7
        .filter((n) => n >= 1 && n <= 7);

      out[counter - 1].push({
        flight: `${info.airlineIata}${info.flightNo}`,
        dest: info.departureIata,
        time: `${s}-${e}`,
        days,
        type: getApplyType(info),
      });
    }
    return out;
  }

  /** 某櫃某日(di:0..6 → 星期 di+1)的排程,依時間排序 */
  bookingsFor(ci: number, di: number): Booking[] {
    return this.sched[ci]
      .filter((b) => b.days.includes(di + 1))
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  countFor(ci: number, di: number): number {
    return this.bookingsFor(ci, di).length;
  }

  setView(v: 'week' | 'day'): void {
    this.view = v;
  }

  openDay(di: number): void {
    this.dayIdx = di;
    this.view = 'day';
  }

  prevDay(): void {
    this.dayIdx = Math.max(0, this.dayIdx - 1);
  }
  nextDay(): void {
    this.dayIdx = Math.min(6, this.dayIdx + 1);
  }

  prevWeek(): void {
    this.weekStart = this.addDays(this.weekStart, -7);
    this.load();
  }
  nextWeek(): void {
    this.weekStart = this.addDays(this.weekStart, 7);
    this.load();
  }

  exportPeriod(): string {
    if (this.view === 'day') {
      const d = this.selectedDateLabel;
      return `${this.baseUrl}/CUSTOM/${d}/${d}`;
    }
    return `${this.baseUrl}/CUSTOM/${this.fmt(this.weekStart)}/${this.fmt(this.weekEnd)}`;
  }
  exportSeason(): string {
    return `${this.baseUrl}/SEASON`;
  }

  print(): void {
    window.print();
  }
}
