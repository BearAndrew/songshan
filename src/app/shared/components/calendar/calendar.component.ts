import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, Inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CALENDAR_OVERLAY_REF } from './calendar.inject-token';
import { CalendarDateType, SHIFT_TIME_OPTIONS, ShiftTime } from './calendar.date-type';
import { CommonService } from '../../../core/services/common.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() activeDate: Date | null = null;
  @Input() startDate: Date | null = null;
  @Input() endDate: Date | null = null;
  @Input() enabledDateTypes: CalendarDateType[] = [];
  @Input() enabledTimeSelect: boolean = false; // 是否啟用時間選擇功能
  @Input() isAllDay: boolean = false; // 是否為全天候選擇
  @Input() activeTime: 'morning' | 'afternoon' | null = null;
  @Input() title: string = '選擇日期';

  @Input() anchorDay: Date = new Date();
  @Input() disableBeforeAnchor: boolean = false;

  @Output() dateSelected = new EventEmitter<Date | null>();
  @Output() timeSelected = new EventEmitter<ShiftTime>();

  currentDate: Date = new Date();
  today: Date = new Date();
  weeks: any[] = [];
  years: number[] = [];
  weekdays: string[] = ['日', '一', '二', '三', '四', '五', '六'];
  SHIFT_TIME_OPTIONS = SHIFT_TIME_OPTIONS;

  zoom: number = 1; // 用於縮放比例

  private destroy$ = new Subject<void>();

  constructor(
    private commonService: CommonService,
    @Inject(CALENDAR_OVERLAY_REF) private overlayRef: OverlayRef
  ) {}

  ngOnInit(): void {
    this.currentDate = new Date(this.activeDate || new Date());
    this.generateCalendar();
    if (this.startDate && this.endDate) {
      // 將 this.years 設置為從 startDate 到 endDate 的年份
      const startYear = this.startDate.getFullYear();
      const endYear = this.endDate.getFullYear();
      this.years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
    } else {
      this.generateYears();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enabledDateTypes']) {
      this.generateCalendar();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generateYears() {
    const startYear = 1900;
    const currentYear = new Date().getFullYear();
    const endYear = currentYear;
    this.years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }

  isSameDate(d1: Date | null, d2: Date | null): boolean {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  isStartMonth(): boolean {
    if (!this.startDate) return false;
    return (
      this.currentDate.getFullYear() === this.startDate.getFullYear() &&
      this.currentDate.getMonth() === this.startDate.getMonth()
    );
  }

  isEndMonth(): boolean {
    if (!this.endDate) return false;
    return (
      this.currentDate.getFullYear() === this.endDate.getFullYear() &&
      this.currentDate.getMonth() === this.endDate.getMonth()
    );
  }

  isBefore(date1: Date, date2: Date): boolean {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return d1.getTime() < d2.getTime();
  }

  isDisabled(date: Date): boolean {
    // 如果是全天候模式，則所有日期都可選
    if (this.isAllDay) return false;

    // 若 enabledDateTypes 為空，則全部日期都不能選
    // 若非空，則只有 enabledDateTypes 內的日期可選
    const isEnabled = this.enabledDateTypes.some(d => this.isSameDate(d.date, date));
    return !isEnabled;
  }

  isActive(date: Date): boolean {
    return this.isSameDate(this.activeDate, date);
  }

  generateCalendar() {
    const start = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const end = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

    const startDay = start.getDay();
    const daysInMonth = end.getDate();

    const calendar: Date[] = [];

    // 前一個月尾部
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(start);
      d.setDate(d.getDate() - i - 1);
      calendar.push(d);
    }

    // 本月日期
    for (let i = 1; i <= daysInMonth; i++) {
      calendar.push(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i));
    }

    // 下一個月補滿 6 週（42 格）
    // while (calendar.length < 42) {
    //   const last = new Date(calendar[calendar.length - 1]);
    //   last.setDate(last.getDate() + 1);
    //   calendar.push(last);
    // }

    this.weeks = [];
    for (let i = 0; i < calendar.length; i += 7) {
      this.weeks.push(calendar.slice(i, i + 7));
    }
  }

  prevMonth(event: Event) {
    event.stopPropagation();
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(event: Event) {
    event.stopPropagation();
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  onYearChange(newYear: number) {
    // 檢查年份範圍
    if (this.startDate && this.endDate) {
      const newDate = new Date(this.currentDate);
      newDate.setFullYear(newYear);

      // 如果新的年月低於 startDate
      if (
        newDate.getFullYear() < this.startDate.getFullYear() ||
        (newDate.getFullYear() === this.startDate.getFullYear() &&
         newDate.getMonth() < this.startDate.getMonth())
      ) {
        // 設定為 startDate 的年月
        this.currentDate = new Date(
          this.startDate.getFullYear(),
          this.startDate.getMonth(),
          1
        );
      }
      // 如果新的年月高於 endDate
      else if (
        newDate.getFullYear() > this.endDate.getFullYear() ||
        (newDate.getFullYear() === this.endDate.getFullYear() &&
         newDate.getMonth() > this.endDate.getMonth())
      ) {
        // 設定為 endDate 的年月
        this.currentDate = new Date(
          this.endDate.getFullYear(),
          this.endDate.getMonth(),
          1
        );
      }
      // 在範圍內，正常設定年份
      else {
        this.currentDate.setFullYear(newYear);
      }
    } else {
      this.currentDate.setFullYear(newYear);
    }
    this.generateCalendar();
  }

  selectDate(date: Date) {
    if (this.isDisabled(date)) return;
    this.activeDate = new Date(date);
    this.activeTime = null; // 清除時間選擇
    // if (!this.enabledTimeSelect) {
    //   this.dateSelected.emit(this.activeDate);
    //   setTimeout(() => {
    //     this.overlayRef.dispose();
    //   }, 100);
    // }
  }

  selectTime(time: ShiftTime) {
    this.activeTime = time.value;
    // this.dateSelected.emit(this.activeDate);
    // this.timeSelected.emit(time);
    // this.overlayRef.dispose();
  }

  isShiftEnabled(shift: 'morning' | 'afternoon'): boolean {
    if (!this.activeDate) return false;
    return this.enabledDateTypes.some(
      d => this.isSameDate(d.date, this.activeDate) && d.shift === shift
    );
  }

  checkDisabled() {
    if (this.enabledTimeSelect) {
      return this.activeTime === null || this.activeDate === null;
    } else {
      return this.activeDate === null;
    }
  }

  submit() {
    this.dateSelected.emit(this.activeDate);
    if (this.activeTime) {
      this.timeSelected.emit(SHIFT_TIME_OPTIONS.find(t => t.value === this.activeTime));
    }
    this.close();
  }

  close() {
    this.overlayRef.dispose();
  }

}
