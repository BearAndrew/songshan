import { CommonService } from './../../../../core/services/common.service';
import { ApiService } from './../../../../core/services/api-service.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { BarLineChartComponent } from '../../../../shared/chart/bar-line-chart/bar-line-chart.component';
import { TabType } from '../../../../core/enums/tab-type.enum';
import { DataSetWithDataArray } from '../../../../core/lib/chart-tool';
import { Option } from '../../../../shared/components/dropdown/dropdown.component';
import { Airport } from '../../../../models/airport.model';
import { Airline } from '../../../../models/airline.model';
import { FlightDirection, FlightTrafficAnalysisRequest, FlightTrafficAnalysisResponse } from '../../../../models/flight-traffic-analysis.model';
import { fakeData } from './fake-data';

@Component({
  selector: 'app-traffic-analysis',
  imports: [CommonModule, DropdownComponent, BarLineChartComponent],
  templateUrl: './traffic-analysis.component.html',
  styleUrl: './traffic-analysis.component.scss',
})
export class TrafficAnalysisComponent {
  activeIndex: number = 0;
  data = [
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

  mobileOptions: Option[] = [
    {
      label: '國際兩岸線',
      value: 0,
    },
    {
      label: '國際線',
      value: 1,
    },
    {
      label: '兩岸線',
      value: 2,
    },
    {
      label: '國內線',
      value: 3,
    },
    {
      label: '總數',
      value: 4,
    },
  ];

  barData: DataSetWithDataArray[] = [];

  lineData: DataSetWithDataArray[] = [];

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

  flightTypeOptions: Option[] = [
    { label: '全部', value: '' },
    { label: '出境', value: 'OUTBOUND' },
    { label: '入境', value: 'INBOUND' },
  ];

  optionDefaultValue = '';

  type: string = '';
  dateRangeLabel = '';
  totalFlight: number = 0;
  totalPax: number = 0;
  compareTotalFlight: number = 0;
  compareTotalPax: number = 0;

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
    direction: string | null;
    flightType: string | null;
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
    direction: null,
    flightType: TabType.NONDOMESTIC,
  };

  isNoData: boolean = false;

  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) {
  }

  ngOnInit(): void {
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

    // 取得航空公司清單
    this.apiService.getAirlineList().subscribe((res: Airline[]) => {
      this.airlineOptions = res.map((airline) => ({
        label: airline.name_zhTW,
        value: airline.iata,
      }));
      this.airlineOptions.unshift({ label: '全部', value: '' });
    });
  }

  // 選擇事件
  onSelectionChange(field: keyof typeof this.formData, option: Option) {
    this.formData[field] = option.value;
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
    this.formData.flightType = this.data[index].value;
  }

  // 確認按鈕
  onConfirm() {
    // 檢核是否有欄位為 null
    const emptyFields = Object.entries(this.formData)
      .filter(([_, val]) => val === null)
      .map(([key]) => key);

    // 組裝 API payload
    const payload: FlightTrafficAnalysisRequest = {
      dateFrom:
        this.formatDate(
          this.formData.startYear,
          this.formData.startMonth,
          this.formData.startDay
        ) || '',
      dateTo:
        this.formatDate(
          this.formData.endYear,
          this.formData.endMonth,
          this.formData.endDay
        ) || '',
      type: (this.formData.flightClass) || '',
      airline: this.formData.airline! || '',
      direction: (this.formData.direction as FlightDirection) || '',
      peer: this.formData.route! || '',
      flightType: (this.formData.flightType as TabType) || '',
    };

    // console.log(payload);
    // this.handleFlightTrafficAnalysis(fakeData);
    // return;

    // 呼叫 API
    this.apiService.postFlightTrafficAnalysis(payload).subscribe({
      next: (res: FlightTrafficAnalysisResponse) => {
        console.log('取得資料成功', res);
        this.handleFlightTrafficAnalysis(res);
      },
      error: (err) => {
        // this.handleFlightTrafficAnalysis(fakeData);
      },
    });
  }

  private formatDisplayDate(
    year?: number | null,
    month?: number | null,
    day?: number | null
  ): string {
    if (!year) return '';

    // 年
    let result = `${year}年`;

    // 月
    if (month) {
      result += `${month}月`;
    } else {
      return result;
    }

    // 日
    if (day) {
      result += `${day}日`;
    }
    console.log(result);
    return result;
  }

  private buildDateRangeLabel(): string {
    const start = this.formatDisplayDate(
      this.formData.startYear,
      this.formData.startMonth,
      this.formData.startDay
    );

    const end = this.formatDisplayDate(
      this.formData.endYear,
      this.formData.endMonth,
      this.formData.endDay
    );

    if (start && end) {
      return `${start}～${end}`;
    }

    return start || end || '';
  }

  private formatDate(
    year?: number | null,
    month?: number | null,
    day?: number | null
  ): string {
    const y = year ?? 0;
    const m = month ? String(month).padStart(2, '0') : '0';
    const d = day ? String(day).padStart(2, '0') : '0';

    return `${y}-${m}-${d}`;
  }

  private handleFlightTrafficAnalysis(res: FlightTrafficAnalysisResponse) {
    console.log('處理資料', res);

    const query = res?.queryData;
    const compare = res?.compareData;

    const queryStat = Array.isArray(query?.stat) ? query.stat : [];
    const compareStat = Array.isArray(compare?.stat) ? compare.stat : [];

    const hasAnyData = queryStat.length > 0 || compareStat.length > 0;

    // === 兩邊都沒資料 ===
    if (!hasAnyData) {
      this.barData = [];
      this.lineData = [];
      this.totalFlight = 0;
      this.totalPax = 0;
      this.isNoData = true;
      return;
    }

    this.isNoData = false;
    this.dateRangeLabel = this.buildDateRangeLabel();

    // ================= Bar：人數 =================
    const barSeries: any[] = [];

    if (queryStat.length > 0) {
      barSeries.push({
        label: `${this.dateRangeLabel}人數`,
        data: queryStat.map((item) => ({
          key: item.label,
          value: item.numOfPax,
        })),
        colors: ['#0279ce'],
      });
    }

    if (compareStat.length > 0) {
      barSeries.push({
        label: '2019年人數',
        data: compareStat.map((item) => ({
          key: item.label,
          value: item.numOfPax,
        })),
        colors: ['#f08622'],
      });
    }

    this.barData = barSeries;

    // ================= Line：架次 =================
    const lineSeries: any[] = [];

    if (queryStat.length > 0) {
      lineSeries.push({
        label: `${this.dateRangeLabel}架次`,
        data: queryStat.map((item) => ({
          key: item.label,
          value: item.numOfFlight,
        })),
        colors: ['#0279ce'],
      });
    }

    if (compareStat.length > 0) {
      lineSeries.push({
        label: '2019年架次',
        data: compareStat.map((item) => ({
          key: item.label,
          value: item.numOfFlight,
        })),
        colors: ['#f08622'],
      });
    }

    this.lineData = lineSeries;

    this.totalFlight = query?.totalFlight ?? 0;
    this.totalPax = query?.totalPax ?? 0;
    this.compareTotalFlight = compare?.totalFlight ?? 0;
    this.compareTotalPax = compare?.totalPax ?? 0;

    console.log(JSON.stringify(this.barData));
    console.log(this.lineData);
  }
}
