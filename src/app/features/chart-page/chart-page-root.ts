import { ApiService } from './../../core/services/api-service.service';
import { DataSetWithDataArray } from '../../core/lib/chart-tool';
import { extractAfterSlash } from '../../core/utils/extract-slash';
import { FlightTrafficAnalysisResponse } from '../../models/flight-traffic-analysis.model';
import { YearlyTrafficAnalysisResponse } from '../../models/yearly-traffic-analysis.model';
import { ChartSearchBarForm } from './components/chart-search-bar/chart-search-bar.interface';
import { Directive } from '@angular/core';
import { OtpAnalysisResponse } from '../../models/otp-analysis.model';

@Directive()
export class ChartPageRootComponent {
  barData: DataSetWithDataArray[] = [];
  lineData: DataSetWithDataArray[] = [];
  dateRangeLabel = '';
  firstDateRangeLabel = '';
  secondDateRangeLabel = '';
  thirdDateRangeLabel = '';
  totalFlight: number = 0;
  totalPax: number = 0;
  secondYearTotalFlight: number = 0;
  secondYearTotalPax: number = 0;
  thirdYearTotalFlight: number = 0;
  thirdYearTotalPax: number = 0;

  compareTotalFlight: number = 0;
  compareTotalPax: number = 0;

  onTimeRate: number = 0;
  isNoData: boolean = false;
  formData!: ChartSearchBarForm;

  constructor(protected apiService: ApiService) {}

  protected formatDate(
    year?: number | null,
    month?: number | null,
    day?: number | null,
  ): string {
    const y = year ?? 0;
    const m = month ? String(month).padStart(2, '0') : '0';
    const d = day ? String(day).padStart(2, '0') : '0';

    return `${y}-${m}-${d}`;
  }

  /** 日期比較使用 */
  protected handleFlightTrafficAnalysis(
    res: FlightTrafficAnalysisResponse,
    isShowCompare = true,
  ) {
    const query = res?.queryData;
    const compare = res?.compareData;
    const queryStat = Array.isArray(query?.stat) ? query.stat : [];
    const compareStat = Array.isArray(compare?.stat) ? compare.stat : [];
    const hasAnyData = queryStat.length > 0 || compareStat.length > 0;

    this.totalFlight = query?.totalFlight ?? 0;
    this.totalPax = query?.totalPax ?? 0;
    this.compareTotalFlight = compare?.totalFlight ?? 0;
    this.compareTotalPax = compare?.totalPax ?? 0;

    // === 兩邊都沒資料 ===
    if (!hasAnyData) {
      this.barData = [];
      this.lineData = [];
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

    if (compareStat.length > 0 && isShowCompare) {
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

    if (compareStat.length > 0 && isShowCompare) {
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
  }

  /** 年份比較使用 */
  protected handleYearFlightTrafficAnalysis(
    res: YearlyTrafficAnalysisResponse[],
  ) {
    console.log(this.firstDateRangeLabel);
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

  /** 準點率 */
  protected handleOntimePerformance(res: OtpAnalysisResponse) {
    const query = res?.queryData;
    const queryStat = Array.isArray(query?.stat) ? query.stat : [];
    const hasAnyData = queryStat.length > 0;

    this.onTimeRate = query?.OnTimeRate ?? 0;
    this.totalFlight = query?.totalFlight ?? 0;

    // === 兩邊都沒資料 ===
    if (!hasAnyData) {
      this.barData = [];
      this.lineData = [];
      this.isNoData = true;
      return;
    }

    this.isNoData = false;
    this.dateRangeLabel = this.buildDateRangeLabel();

    // ================= Bar：架次 =================
    const barSeries: any[] = [];

    if (queryStat.length > 0) {
      barSeries.push({
        label: `${this.dateRangeLabel}準點率`,
        data: queryStat.map((item) => ({
          key: item.label,
          value: item.OnTimeRate,
        })),
        colors: ['#f08622'],
        unitText: '%',
      });
    }

    this.barData = barSeries;

    // ================= Line：準點率 =================
    const lineSeries: any[] = [];

    if (queryStat.length > 0) {
      lineSeries.push({
        label: `${this.dateRangeLabel}總架次`,
        data: queryStat.map((item) => ({
          key: item.label,
          value: item.numOfFlight,
        })),
        colors: ['#a4dd46'],
      });

      lineSeries.push({
        label: `${this.dateRangeLabel}準點架次`,
        data: queryStat.map((item) => ({
          key: item.label,
          value: item.OnTimeFlight,
        })),
        colors: ['#0279ce'],
      });
    }

    this.lineData = lineSeries;
  }

  protected buildDateRangeLabel(): string {
    const start = this.formatDisplayDate(
      this.formData.startYear,
      this.formData.startMonth,
      this.formData.startDay,
    );

    const end = this.formatDisplayDate(
      this.formData.endYear,
      this.formData.endMonth,
      this.formData.endDay,
    );

    if (start && end) {
      return `${start}～${end}`;
    }

    return start || end || '';
  }

  protected formatDisplayDate(
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
    console.log(result);
    return result;
  }
}
