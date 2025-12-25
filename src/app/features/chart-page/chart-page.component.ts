import { CommonService } from './../../core/services/common.service';
import { ApiService } from './../../core/services/api-service.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { DataSetWithDataArray } from '../../core/lib/chart-tool';
import { BarLineChartComponent } from '../../shared/chart/bar-line-chart/bar-line-chart.component';
import { Option } from '../../shared/components/dropdown/dropdown.component';
import {
  FlightDirection,
  FlightTrafficAnalysisRequest,
  FlightTrafficAnalysisResponse,
  FlightTrafficType,
  FlightType,
} from '../../models/flight-traffic-analysis.model';
import { Airport } from '../../models/airport.model';
import { Airline } from '../../models/airline.model';

@Component({
  selector: 'app-chart-page',
  imports: [CommonModule, DropdownComponent, BarLineChartComponent],
  templateUrl: './chart-page.component.html',
  styleUrl: './chart-page.component.scss',
})
export class ChartPageComponent {
  activeIndex: number = 0;
  data = [
    {
      label: '國際兩岸線',
      value: 'nondomestic',
    },
    {
      label: '國際線',
      value: 'intl',
    },
    {
      label: '兩岸線',
      value: 'crossstrait',
    },
    {
      label: '國內線',
      value: 'domestic',
    },
    {
      label: '總數',
      value: 'all',
    },
  ];

  barData: DataSetWithDataArray[] = [
    {
      label: '出境預報人數',
      data: [
        { key: '0600', value: 120 },
        { key: '0700', value: 340 },
        { key: '0800', value: 220 },
        { key: '0900', value: 480 },
        { key: '1000', value: 150 },
        { key: '1100', value: 390 },
        { key: '1200', value: 560 },
        { key: '1300', value: 310 },
        { key: '1400', value: 420 },
        { key: '1500', value: 260 },
        { key: '1600', value: 500 },
        { key: '1700', value: 180 },
        { key: '1800', value: 600 },
        { key: '1900', value: 270 },
        { key: '2000', value: 430 },
        { key: '2100', value: 350 },
        { key: '2200', value: 290 },
      ],
      colors: ['#00d6c8'],
    },
    {
      label: '入境預報人數',
      data: [
        { key: '0600', value: 80 },
        { key: '0700', value: 260 },
        { key: '0800', value: 310 },
        { key: '0900', value: 450 },
        { key: '1000', value: 190 },
        { key: '1100', value: 420 },
        { key: '1200', value: 530 },
        { key: '1300', value: 280 },
        { key: '1400', value: 390 },
        { key: '1500', value: 240 },
        { key: '1600', value: 470 },
        { key: '1700', value: 210 },
        { key: '1800', value: 580 },
        { key: '1900', value: 300 },
        { key: '2000', value: 410 },
        { key: '2100', value: 360 },
        { key: '2200', value: 250 },
      ],
      colors: ['#0279ce'],
    },
  ];
  lineData: DataSetWithDataArray[] = [
    {
      label: '出境實際人數',
      data: [
        { key: '0600', value: 140 },
        { key: '0700', value: 320 },
        { key: '0800', value: 200 },
        { key: '0900', value: 510 },
        { key: '1000', value: 170 },
        { key: '1100', value: 360 },
        { key: '1200', value: 600 },
        { key: '1300', value: 330 },
        { key: '1400', value: 450 },
        { key: '1500', value: 290 },
        { key: '1600', value: 520 },
        { key: '1700', value: 160 },
        { key: '1800', value: 590 },
        { key: '1900', value: 260 },
        { key: '2000', value: 440 },
        { key: '2100', value: 380 },
        { key: '2200', value: 310 },
      ],
      colors: ['#00d6c8'],
    },
    {
      label: '入境實際人數',
      data: [
        { key: '0600', value: 60 },
        { key: '0700', value: 300 },
        { key: '0800', value: 250 },
        { key: '0900', value: 470 },
        { key: '1000', value: 130 },
        { key: '1100', value: 410 },
        { key: '1200', value: 540 },
        { key: '1300', value: 290 },
        { key: '1400', value: 400 },
        { key: '1500', value: 230 },
        { key: '1600', value: 490 },
        { key: '1700', value: 200 },
        { key: '1800', value: 570 },
        { key: '1900', value: 280 },
        { key: '2000', value: 420 },
        { key: '2100', value: 340 },
        { key: '2200', value: 270 },
      ],
      colors: ['#0279ce'],
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
    { label: '商務艙', value: 'business' },
    { label: '經濟艙', value: 'economy' },
  ];

  flightTypeOptions: Option[] = [
    { label: '出境', value: 'OUTBOUND' },
    { label: '入境', value: 'INBOUND' },
  ];

  type: string = '';

  // 目前表單值
  formData: {
    startYear: number | null;
    startMonth: number | null;
    startDay: number | null;
    endYear: number | null;
    endMonth: number | null;
    endDay: number | null;
    route: string | null;
    flightClass: string | null;
    airline: string | null;
    flightType: string | null;
    flightScope: string | null;
  } = {
    startYear: null,
    startMonth: null,
    startDay: null,
    endYear: null,
    endMonth: null,
    endDay: null,
    route: null,
    flightClass: null,
    airline: null,
    flightType: null,
    flightScope: 'nondomestic',
  };

  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    this.commonService.getSelectedFlightType().subscribe((res) => {
      this.type = res;
    });
  }

  ngOnInit(): void {
    // 年份 2015 ~ 2025 倒序
    this.yearOptions = Array.from({ length: 2025 - 2015 + 1 }, (_, i) => {
      const year = 2025 - i;
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
    });

    // 取得航空公司清單
    this.apiService.getAirlineList().subscribe((res: Airline[]) => {
      this.airlineOptions = res.map((airline) => ({
        label: airline.name_zhTW,
        value: airline.iata,
      }));
    });
  }

  // 選擇事件
  onSelectionChange(field: keyof typeof this.formData, value: any) {
    this.formData[field] = value;
  }

  // 計算某年某月的天數
  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  // 生成日選單
  generateDayOptions(year: number, month: number): Option[] {
    if (!year || !month) return [];
    const days = this.getDaysInMonth(year, month);
    return Array.from({ length: days }, (_, i) => {
      const day = i + 1;
      return { label: day.toString().padStart(2, '0'), value: day };
    });
  }

  // 當年份或月份改變時更新日選單
  onMonthOrYearChange(
    type: 'start' | 'end',
    year: number | null,
    month: number | null
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

  // 當切換按鈕時更新 formData
  onScopeChange(index: number) {
    this.activeIndex = index;
    this.formData.flightScope = this.data[index].value;
  }

  // 確認按鈕
  onConfirm() {
    // 檢核是否有欄位為 null
    const emptyFields = Object.entries(this.formData)
      .filter(([_, val]) => val === null)
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      console.warn('請填寫完整資料', emptyFields);
      return;
    }

    // 組裝 API payload
    const payload: FlightTrafficAnalysisRequest = {
      dateFrom: `${this.formData.startYear}-${String(
        this.formData.startMonth
      ).padStart(2, '0')}-${String(this.formData.startDay).padStart(
        2,
        '0'
      )} 00:00:00`,
      dateTo: `${this.formData.endYear}-${String(
        this.formData.endMonth
      ).padStart(2, '0')}-${String(this.formData.endDay).padStart(
        2,
        '0'
      )} 23:59:59`,
      type: this.type as FlightTrafficType,
      airline: this.formData.airline!,
      direction: this.formData.flightType as FlightDirection,
      peer: this.formData.route!,
      flightType: this.formData.flightType as FlightType,
    };

    // 呼叫 API
    this.apiService.postFlightTrafficAnalysis(payload).subscribe({
      next: (res: FlightTrafficAnalysisResponse) => {
        console.log('取得資料成功', res);

        // -------- 對應 barData --------
        this.barData = [
          {
            label: '出境預報人數',
            data: res.statByHour.map(item => ({
              key: item.hour.replace(':', ''), // 轉成 '0600' 格式
              value: item.numOfPax, // 假設預報人數用 numOfPax
            })),
            colors: ['#00d6c8'],
          },
          {
            label: '入境預報人數',
            data: res.statByHour.map(item => ({
              key: item.hour.replace(':', ''),
              value: item.numOfPax, // 如果有區分 inbound/outbound，這裡要分
            })),
            colors: ['#0279ce'],
          },
        ];

        // -------- 對應 lineData --------
        this.lineData = [
          {
            label: '出境實際人數',
            data: res.statByHour.map(item => ({
              key: item.hour.replace(':', ''),
              value: item.numOfPax, // 如果有實際人數字段，就用實際人數
            })),
            colors: ['#00d6c8'],
          },
          {
            label: '入境實際人數',
            data: res.statByHour.map(item => ({
              key: item.hour.replace(':', ''),
              value: item.numOfPax, // 同上
            })),
            colors: ['#0279ce'],
          },
        ];
      },
      error: err => {
        console.error('取得資料失敗', err);
      },
    });
  }
}
