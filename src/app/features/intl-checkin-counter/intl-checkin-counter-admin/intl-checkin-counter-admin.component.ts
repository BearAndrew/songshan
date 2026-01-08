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
} from '@angular/forms';

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
  ganttDays: GanttDay[] = [
    {
      date: '2025/01/01',
      items: [
        { row: 1, data: { flightNo: 'BR722', time: '14:00-17:00' } },
        { row: 3, data: { flightNo: 'CI101', time: '09:00-11:30' } },
      ],
    },
    {
      date: '2025/01/02',
      items: [
        { row: 2, data: { flightNo: 'BR801', time: '08:00-10:00' } },
        { row: 4, data: { flightNo: 'CI234', time: '15:00-18:00' } },
      ],
    },
    {
      date: '2025/01/03',
      items: [{ row: 1, data: { flightNo: 'BR722', time: '14:00-17:00' } }],
    },
    {
      date: '2025/01/04',
      items: [
        { row: 5, data: { flightNo: 'JL812', time: '07:30-11:00' } },
        { row: 6, data: { flightNo: 'BR655', time: '18:00-20:30' } },
      ],
    },
    {
      date: '2025/01/05',
      items: [{ row: 2, data: { flightNo: 'CI789', time: '10:00-13:00' } }],
    },
    {
      date: '2025/01/06',
      items: [
        { row: 1, data: { flightNo: 'BR722', time: '14:00-17:00' } },
        { row: 4, data: { flightNo: 'KE691', time: '06:00-08:40' } },
      ],
    },
    {
      date: '2025/01/07',
      items: [{ row: 3, data: { flightNo: 'CI101', time: '09:00-11:30' } }],
    },
    {
      date: '2025/01/08',
      items: [
        { row: 2, data: { flightNo: 'BR801', time: '08:00-10:00' } },
        { row: 6, data: { flightNo: 'JL812', time: '16:00-19:30' } },
      ],
    },
    {
      date: '2025/01/09',
      items: [{ row: 4, data: { flightNo: 'CI234', time: '15:00-18:00' } }],
    },
    {
      date: '2025/01/10',
      items: [
        { row: 1, data: { flightNo: 'BR722', time: '14:00-17:00' } },
        { row: 5, data: { flightNo: 'KE691', time: '06:00-08:40' } },
      ],
    },
  ];

  infoCardList = [
    {
      flightNo: 'BR192',
      time: '14:00-17:00',
      date: '整季(2025/01/01 - 2025/02/03)',
      status: '申請中',
    },
    {
      flightNo: 'BR192',
      time: '14:00-17:00',
      date: '整季(2025/01/01 - 2025/02/03)',
      status: '申請中',
    },
    {
      flightNo: 'BR192',
      time: '14:00-17:00',
      date: '整季(2025/01/01 - 2025/02/03)',
      status: '申請中',
    },
        {
      flightNo: 'BR192',
      time: '14:00-17:00',
      date: '整季(2025/01/01 - 2025/02/03)',
      status: '申請中',
    },
    {
      flightNo: 'BR192',
      time: '14:00-17:00',
      date: '整季(2025/01/01 - 2025/02/03)',
      status: '申請中',
    },
    {
      flightNo: 'BR192',
      time: '14:00-17:00',
      date: '整季(2025/01/01 - 2025/02/03)',
      status: '申請中',
    },
  ];

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

  get seasonCountersFA(): FormArray {
    return this.form.get('seasonCounters') as FormArray;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    /** 申請內容 */
    this.form = this.fb.group({
      flightInfo: [''],
      departureTime: [''],
      islands: this.fb.array([]),
      seasonType: [''],
      applyTimeInterval: [''],
      applyDateInterval: [''],
      rejectReason: [''],
      seasonCounters: this.fb.array([]),
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

    // 至少加入一筆
    for (let i = 0; i < 1; i++) {
      this.seasonCountersFA.push(
        this.fb.group({
          checked: [false],
          islandNo: [''],
          counterFrom: [''],
          counterTo: [''],
        })
      );
    }
  }

  /** ===== 申請內容 ===== */
  setSeasonType(type: 'all' | 'other') {
    this.form.get('seasonType')?.setValue(type);
  }

  getItemsByRow(day: GanttDay, row: number): GanttItem[] {
    return day.items.filter((item) => item.row === row);
  }
}
