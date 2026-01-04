import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface ScheduleItem {
  date: string; // YYYY-MM-DD
  flightNo: string;
  time: string;
  status: string;
}

@Component({
  selector: 'app-intl-checkin-counter-user',
  imports: [CommonModule],
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
  rawData: ScheduleItem[] = [
    { date: '2026-01-05', flightNo: 'BR192', time: '05:00', status: '申請中' }, // Mon
    { date: '2026-01-06', flightNo: 'CI103', time: '08:30', status: '已核准' },
    { date: '2026-01-09', flightNo: 'NH886', time: '11:00', status: '取消' },

    { date: '2026-01-12', flightNo: 'BR808', time: '07:45', status: '已核准' }, // next Mon
    { date: '2026-01-13', flightNo: 'CI202', time: '09:10', status: '申請中' },
    { date: '2026-01-16', flightNo: 'BR999', time: '13:00', status: '申請中' },
  ];

  /** 申請內容 */
  seasonType: 'all' | 'other' | null = null;
  islandList: string[] = [];

  ngOnInit() {
    this.weeks = this.buildWeeks(this.rawData);
    this.setCurrentWeek(0);
  }

  private buildWeeks(data: ScheduleItem[]): ScheduleItem[][][] {
    const weekMap = new Map<string, ScheduleItem[][]>();

    for (const item of data) {
      const date = new Date(item.date);
      const monday = this.getMonday(date).toISOString().slice(0, 10);

      if (!weekMap.has(monday)) {
        weekMap.set(
          monday,
          Array.from({ length: 7 }, () => [])
        );
      }

      const dayIndex = (date.getDay() + 6) % 7; // Mon=0
      weekMap.get(monday)![dayIndex].push(item);
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

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
  }


  /** 申請內容 */
  setSeasonType(type: 'all' | 'other') {
    this.seasonType = type;
  }
  addIsland() {
    this.islandList.push(`島櫃資料 ${this.islandList.length + 1}`);
  }
}
