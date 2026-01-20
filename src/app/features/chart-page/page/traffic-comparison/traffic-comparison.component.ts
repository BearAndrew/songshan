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
import { fakeData } from './fake-data';
import {
  YearlyTrafficAnalysisRequest,
  YearlyTrafficAnalysisResponse,
} from '../../../../models/yearly-traffic-analysis.model';
import { FlightDirection } from '../../../../models/flight-traffic-analysis.model';
import { extractAfterSlash } from '../../../../core/utils/extract-slash';

@Component({
  selector: 'app-traffic-comparison',
  imports: [CommonModule, DropdownComponent, BarLineChartComponent],
  templateUrl: './traffic-comparison.component.html',
  styleUrl: './traffic-comparison.component.scss',
})
export class TrafficComparisonComponent {
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

  optionDefaultValue = '';

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

  defaultOptionValue = '';

  firstDateRangeLabel = '';
  secondDateRangeLabel = '';
  thirdDateRangeLabel = '';
  totalFlight: number = 0;
  totalPax: number = 0;
  secondYearTotalFlight: number = 0;
  secondYearTotalPax: number = 0;
  thirdYearTotalFlight: number = 0;
  thirdYearTotalPax: number = 0;

  // 目前表單值
  formData: {
    firstYear: number | null;
    secondYear: number | null;
    thirdYear: number | null;
    route: string | null;
    flightClass: string | null;
    airline: string | null;
    direction: string | null;
    flightType: string | null;
  } = {
    firstYear: null,
    secondYear: null,
    thirdYear: null,
    route: null,
    flightClass: null,
    airline: null,
    direction: null,
    flightType: TabType.NONDOMESTIC,
  };

  isNoData: boolean = false;

  constructor(private apiService: ApiService) {}

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

    this.getAirlineList();
  }

  // 取得航空公司清單
  getAirlineList() {
    this.apiService
      .getAirlineList(this.data[this.activeIndex].value)
      .subscribe((res: Airline[]) => {
        this.airlineOptions = res.map((airline) => ({
          label: airline.name_zhTW,
          value: airline.iata,
        }));
        this.airlineOptions.unshift({ label: '全部', value: '' });
        this.formData.airline = '';
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

  // 當切換按鈕時更新 formData
  onScopeChange(index: number) {
    this.activeIndex = index;
    this.formData.flightType = this.data[index].value;
    this.getAirlineList();
  }

  // 確認按鈕
  onConfirm() {
    if (this.formData.firstYear === null || this.formData.secondYear === null) {
      return;
    }

    // 檢核是否有欄位為 null
    const emptyFields = Object.entries(this.formData)
      .filter(([_, val]) => val === null)
      .map(([key]) => key);

    // 組裝 API payload
    const payload: YearlyTrafficAnalysisRequest = {
      year1: this.formData.firstYear?.toString() || '',
      year2: this.formData.secondYear?.toString() || '',
      year3: this.formData.thirdYear?.toString() || '',
      type: this.formData.flightClass || '',
      airline: this.formData.airline! || '',
      direction: (this.formData.flightType as FlightDirection) || '',
      peer: this.formData.route! || '',
      flightType: (this.formData.flightType as TabType) || '',
    };

    this.firstDateRangeLabel = this.formData.firstYear?.toString() + '年' || '';
    this.secondDateRangeLabel =
      this.formData.secondYear?.toString() + '年' || '';
    if (this.formData.thirdYear) {
      this.thirdDateRangeLabel =
        this.formData.thirdYear?.toString() + '年' || '';
    }

    // console.log(payload);
    // this.handleFlightTrafficAnalysis(fakeData);
    // return;

    // 呼叫 API
    this.apiService.postYearlyTrafficAnalysisSch(payload).subscribe({
      next: (res: YearlyTrafficAnalysisResponse[]) => {
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
    day?: number | null,
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
    return result;
  }

  private handleFlightTrafficAnalysis(res: YearlyTrafficAnalysisResponse[]) {
    console.log('處理資料', res);

    const firstYear = res.find(
      (item) => item.year === this.formData.firstYear?.toString(),
    )?.data;

    const secondYear = res.find(
      (item) => item.year === this.formData.secondYear?.toString(),
    )?.data;

    const thirdYear = res.find(
      (item) => item.year === this.formData.thirdYear?.toString(),
    )?.data;

    const firstStat = Array.isArray(firstYear?.stat) ? firstYear.stat : [];
    const secondStat = Array.isArray(secondYear?.stat) ? secondYear.stat : [];
    const thirdStat = Array.isArray(thirdYear?.stat) ? thirdYear.stat : [];

    const baseStat =
      firstStat.length > 0
        ? firstStat
        : secondStat.length > 0
          ? secondStat
          : thirdStat;

    const hasAnyData =
      firstStat.length > 0 || secondStat.length > 0 || thirdStat.length > 0;

    this.totalFlight = firstYear?.totalFlight ?? 0;
    this.totalPax = firstYear?.totalPax ?? 0;
    this.secondYearTotalFlight = secondYear?.totalFlight ?? 0;
    this.secondYearTotalPax = secondYear?.totalPax ?? 0;
    this.thirdYearTotalFlight = thirdYear?.totalFlight ?? 0;
    this.thirdYearTotalPax = thirdYear?.totalPax ?? 0;

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
    // this.secondDateRangeLabel = this.buildDateRangeLabel();

    // 先取得所有 base key（例如月份、日期等）
    const baseKeys = baseStat.map((item) => extractAfterSlash(item.label));

    // 共用函式：根據 stat 與數值欄位生成 series data
    const buildSeriesData = <T>(stat: T[], getValue: (item: T) => number) => {
      if (!stat || stat.length === 0) {
        // 若 stat 為空，全部補 0
        return baseKeys.map((key) => ({
          key,
          value: 0,
        }));
      }

      // 建立 key → value 的 Map
      const valueMap = new Map(
        stat.map((item) => [
          extractAfterSlash((item as any).label),
          getValue(item),
        ]),
      );

      // 補齊 baseKeys
      return baseKeys.map((key) => ({
        key,
        value: valueMap.get(key) ?? 0,
      }));
    };

    // ================= Bar：人數 =================
    this.barData = [
      {
        label: `${this.firstDateRangeLabel}人數`,
        data: buildSeriesData(firstStat, (item) => item.numOfPax),
        colors: ['#0279ce'],
      },
      {
        label: `${this.secondDateRangeLabel}人數`,
        data: buildSeriesData(secondStat, (item) => item.numOfPax),
        colors: ['#f08622'],
      },
    ];

    if (this.thirdDateRangeLabel) {
      const item = {
        label: `${this.thirdDateRangeLabel}人數`,
        data: buildSeriesData(thirdStat, (item) => item.numOfPax),
        colors: ['#B084A2'],
      };
      this.barData.push(item);
    }

    // ================= Line：架次 =================
    this.lineData = [
      {
        label: `${this.firstDateRangeLabel}架次`,
        data: buildSeriesData(firstStat, (item) => item.numOfFlight),
        colors: ['#0279ce'],
      },
      {
        label: `${this.secondDateRangeLabel}架次`,
        data: buildSeriesData(secondStat, (item) => item.numOfFlight),
        colors: ['#f08622'],
      },
    ];

    if (this.thirdDateRangeLabel) {
      const item = {
        label: `${this.thirdDateRangeLabel}架次`,
        data: buildSeriesData(thirdStat, (item) => item.numOfFlight),
        colors: ['#B084A2'],
      };
      this.lineData.push(item);
    }
  }
}
