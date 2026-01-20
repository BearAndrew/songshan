import { ApiService } from './../../../../core/services/api-service.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { TabType } from '../../../../core/enums/tab-type.enum';
import { Option } from '../../../../shared/components/dropdown/dropdown.component';
import { Airport } from '../../../../models/airport.model';
import { Airline } from '../../../../models/airline.model';
import { ChartSearchBarForm } from './chart-search-bar.interface';

interface Tab {
  label: string;
  value: TabType;
}

@Component({
  selector: 'app-chart-search-bar',
  imports: [CommonModule, DropdownComponent],
  templateUrl: './chart-search-bar.component.html',
  styleUrl: './chart-search-bar.component.scss',
})
export class ChartSearchBarComponent {
  /** 是否為定航，預設為false */
  @Input() isSchedule = false;
  /** 是否顯示選擇日期，反之顯示年份，預設為true  */
  @Input() isDate = true;
  @Output() formChange = new EventEmitter<ChartSearchBarForm>();
  @Output() submit = new EventEmitter<ChartSearchBarForm>();

  tabList: Tab[] = [
    {
      label: '國際兩岸線',
      value: TabType.NONDOMESTIC,
    },
    {
      label: '國際線',
      value: TabType.INTL,
    },
    {
      label: '兩岸線',
      value: TabType.CROSSSTRAIT,
    },
    {
      label: '國內線',
      value: TabType.DOMESTIC,
    },
    {
      label: '總數',
      value: TabType.ALL,
    },
  ];

  // 年、月、日 options
  yearOptions: Option[] = [];
  monthOptions: Option[] = [];
  startDayOptions: Option[] = [];
  endDayOptions: Option[] = [];

  // 航點、航班類別、航空公司、飛航類型 options
  routeOptions: Option[] = [];
  airlineOptions: Option[] = [];
  flightClassOptions: Option[] = [
    { label: '全部', value: '' },
    { label: '定航', value: 'SCHEDULE' },
    { label: '商務機', value: 'BJ' },
    { label: '軍機', value: 'MILITARY' },
    { label: '其他', value: 'OTHER' },
  ];
  directionOptions: Option[] = [
    { label: '全部', value: '' },
    { label: '出境', value: 'OUTBOUND' },
    { label: '入境', value: 'INBOUND' },
  ];

  // 目前表單值
  formData: ChartSearchBarForm = {
    startYear: null,
    startMonth: null,
    startDay: null,
    endYear: null,
    endMonth: null,
    endDay: null,
    firstYear: null,
    secondYear: null,
    thirdYear: null,
    route: '',
    flightClass: null,
    airline: null,
    direction: '',
    flightType: TabType.NONDOMESTIC,
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.formData.flightClass = this.isSchedule ? 'SCHEDULE' : '';

    const currentYear = new Date().getFullYear();

    // 今年 ~ 往回 10 年（共 11 年）
    this.yearOptions = Array.from({ length: 11 }, (_, i) => {
      const year = currentYear - i;
      return { label: year.toString(), value: year };
    });

    // 月份 1~12
    this.monthOptions = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return { label: month.toString().padStart(2, '0'), value: month };
    });

    // 取得機場清單
    this.apiService.getAirportList().subscribe((res: Airport[]) => {
      this.routeOptions = res.map((airport) => ({
        label: airport.name_zhTW,
        value: airport.iata,
      }));
      this.routeOptions.unshift({ label: '全部', value: '' });
    });

    this.getAirlineList();
  }

  /** 取得航空公司清單，更新航空公司選單資料，並回傳變更事件 */
  getAirlineList() {
    this.apiService
      .getAirlineList(this.formData.flightType || '')
      .subscribe((res: Airline[]) => {
        this.airlineOptions = res.map((airline) => ({
          label: airline.name_zhTW,
          value: airline.iata,
        }));
        this.airlineOptions.unshift({ label: '全部', value: '' });
        this.formData.airline = '';
        this.formChange.emit(this.formData);
      });
  }

  // 生成日選單
  generateDayOptions(year: number, month: number): Option[] {
    if (!year || !month) return [];
    const days = new Date(year, month, 0).getDate();
    return Array.from({ length: days }, (_, i) => {
      const day = i + 1;
      return { label: day.toString().padStart(2, '0'), value: day };
    });
  }

  // 當年份或月份改變時更新日選單
  onMonthOrYearChange(
    type: 'start' | 'end',
    year: number | null,
    month: number | null,
  ) {
    if (!year || !month) return;

    // 生成當月日選項
    const options = this.generateDayOptions(year, month);

    if (type === 'start') {
      this.startDayOptions = options;

      // 如果原本的日期超過當月最大天數，清空
      if (
        typeof this.formData.startDay === 'number' &&
        this.formData.startDay > options.length
      ) {
        this.formData.startDay = null;
      }
    } else {
      this.endDayOptions = options;

      if (
        typeof this.formData.endDay === 'number' &&
        this.formData.endDay > options.length
      ) {
        this.formData.endDay = null;
      }
    }
  }

  // 選擇事件
  onSelectionChange(field: keyof typeof this.formData, option: Option) {
    (this.formData as any)[field] = option.value;
    this.formChange.emit(this.formData);
  }

  // 當切換按鈕時更新 formData
  onScopeChange(tab: TabType) {
    this.formData.flightType = tab;
    this.getAirlineList();
  }

  // 確認按鈕
  onConfirm() {
    this.submit.emit(this.formData);
  }
}
