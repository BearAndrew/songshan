import {
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  Injector,
  Input,
  Output,
  EventEmitter,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  Overlay,
  OverlayRef,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CalendarComponent } from '../calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { CALENDAR_OVERLAY_REF } from '../calendar/calendar.inject-token';
import { CalendarDateType, Shift, SHIFT_TIME_OPTIONS, ShiftTime } from '../calendar/calendar.date-type';

@Component({
  selector: 'app-calendar-trigger',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-trigger.component.html',
  styleUrl: './calendar-trigger.component.scss',
})
export class CalendarTriggerComponent implements OnChanges {
  @Input() selectedDate: Date | null = null;
  @Input() selectedTime: 'morning' | 'afternoon' | null = null;
  @Input() disabled: boolean = false;
  @Input() enabledDateTypes: CalendarDateType[] = [];
  @Input() enabledTimeSelect: boolean = false; // 是否啟用時間選擇功能
  @Input() isAllDay: boolean = false; // 是否為全天候選擇
  @Input() title: string = '選擇日期';
  @Input() startDate: Date | null = null; // 用於年份選擇
  @Input() endDate: Date | null = null; // 用於年份選擇
  @Output() dateChange = new EventEmitter<Date>();
  @Output() timeChange = new EventEmitter<Shift>();

  @ViewChild('triggerBtn', { static: true }) triggerBtn!: ElementRef;

  selectedTimeLabel: string = '';

  private overlayRef: OverlayRef | null = null;
  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);
  private injector = inject(Injector);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate'] && changes['selectedDate'].currentValue !== changes['selectedDate'].previousValue) {
      this.selectedDate = changes['selectedDate'].currentValue;
    }
    if (changes['selectedTime'] && changes['selectedTime'].currentValue !== changes['selectedTime'].previousValue) {
      this.selectedTime = changes['selectedTime'].currentValue;
      this.selectedTimeLabel = this.selectedTime ? (this.selectedTime === 'morning' ? SHIFT_TIME_OPTIONS[0].label : SHIFT_TIME_OPTIONS[1].label ) : '';
    }
    if (changes['enabledDateTypes'] && changes['enabledDateTypes'].currentValue !== changes['enabledDateTypes'].previousValue) {
      this.enabledDateTypes = changes['enabledDateTypes'].currentValue;
    }
    if (changes['disabled'] && changes['disabled'].currentValue !== changes['disabled'].previousValue) {
      this.disabled = changes['disabled'].currentValue;
    }
  }

  openCalendar() {
    this.close();

    const triggerElement = this.triggerBtn.nativeElement as HTMLElement;
    const rect = triggerElement.getBoundingClientRect();
    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      // 手機：直接 fixed 於螢幕底部，並鎖定滾動
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'cdk-custom-backdrop',
        panelClass: 'calendar-mobile-bottom',
        scrollStrategy: this.overlay.scrollStrategies.block(),
        positionStrategy: this.overlay.position().global().left('0').right('0').bottom('0'),
        width: '100vw',
      });
    } else {
      const positions: ConnectedPosition[] = [
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 8,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -8,
        },
      ];
      const strategy = this.overlay
        .position()
        .flexibleConnectedTo(triggerElement)
        .withPositions(positions)
        .withFlexibleDimensions(false)
        .withPush(true);
      this.overlayRef = this.overlay.create({
        positionStrategy: strategy,
        hasBackdrop: true,
        backdropClass: 'cdk-custom-backdrop',
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        width: rect.width,
      });
    }

    this.overlayRef.backdropClick().subscribe(() => this.close());

    const injector = Injector.create({
      providers: [
        { provide: CALENDAR_OVERLAY_REF, useValue: this.overlayRef }
      ],
      parent: this.injector
    });

    const calendarPortal = new ComponentPortal(CalendarComponent, this.vcr, injector);
    const calendarRef = this.overlayRef.attach(calendarPortal);
    calendarRef.instance.activeDate = this.selectedDate ? new Date(this.selectedDate) : null;
    calendarRef.instance.activeTime = this.selectedTime || null;
    calendarRef.instance.enabledDateTypes = this.enabledDateTypes;
    calendarRef.instance.enabledTimeSelect = this.enabledTimeSelect;
    calendarRef.instance.title = this.title;
    calendarRef.instance.startDate = this.startDate;
    calendarRef.instance.endDate = this.endDate;

    calendarRef.instance.dateSelected.subscribe((date: Date) => {
      this.selectedDate = date;
      this.dateChange.emit(date);
    });

    calendarRef.instance.timeSelected.subscribe((time: ShiftTime) => {
      this.selectedTimeLabel = time.label;
      this.selectedTime = time.value;
      this.timeChange.emit(time.value);
    });
  }

  close() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

}
