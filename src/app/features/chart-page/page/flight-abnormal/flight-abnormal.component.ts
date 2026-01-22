import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BarLineChartComponent } from '../../../../shared/chart/bar-line-chart/bar-line-chart.component';
import { TabType } from '../../../../core/enums/tab-type.enum';
import {
  DataSetWithData,
  DataSetWithDataArray,
} from '../../../../core/lib/chart-tool';
import { PieChartComponent } from '../../../../shared/chart/pie-chart/pie-chart.component';
import {
  IrregularAnalysisRequest,
  IrregularAnalysisResponse,
} from '../../../../models/irregular-analysis.model';
import { ChartSearchBarComponent } from "../../components/chart-search-bar/chart-search-bar.component";
import { ChartSearchBarForm } from '../../components/chart-search-bar/chart-search-bar.interface';
import { ChartPageRootComponent } from '../../chart-page-root';

@Component({
  selector: 'app-flight-abnormal',
  imports: [
    CommonModule,
    BarLineChartComponent,
    PieChartComponent,
    ChartSearchBarComponent
],
  templateUrl: './flight-abnormal.component.html',
  styleUrl: './flight-abnormal.component.scss',
})
export class FlightAbnormalComponent extends ChartPageRootComponent {

  barData1: DataSetWithDataArray[] = [];
  lineData1: DataSetWithDataArray[] = [];
  barData2: DataSetWithDataArray[] = [];
  lineData2: DataSetWithDataArray[] = [];
  pieData1: DataSetWithData[] = [];
  pieData2: DataSetWithData[] = [];

  // 確認按鈕
  onSubmit(form: ChartSearchBarForm) {
    this.formData = form;

    // 組裝 API payload
    const payload: IrregularAnalysisRequest = {
      dateFrom:
        this.formatDate(
          this.formData.startYear,
          this.formData.startMonth,
          this.formData.startDay,
        ) || '',
      dateTo:
        this.formatDate(
          this.formData.endYear,
          this.formData.endMonth,
          this.formData.endDay,
        ) || '',
      type: this.formData.flightClass || '',
      airline: this.formData.airline! || '',
      peer: this.formData.route! || '',
      flightType: (this.formData.flightType as TabType) || '',
    };
    // 呼叫 API
    this.apiService.postIrregularAnalysis(payload).subscribe({
      next: (res: IrregularAnalysisResponse) => {
        this.handleIrregularAnalysis(res);
      },
    });
  }

  private handleIrregularAnalysis(res: IrregularAnalysisResponse) {
    console.log('處理資料', res);

    const query = res?.queryData;

    const queryStat = Array.isArray(query?.stat) ? query.stat : [];

    const hasAnyData = queryStat.length > 0;

    this.isNoData = false;
    this.dateRangeLabel = this.buildDateRangeLabel();
    this.compareTotalFlight = query.totalFlight;
    this.compareTotalPax = query.OnTimeRate;

    // 左下總架次跟準點率
    this.totalFlight = query?.totalFlight ?? 0;
    this.totalPax = query?.IrregularPaxRate ?? 0;

    //右下圓餅圖
    this.pieData1 = [
      {
        label: '0~30min',
        data: { value: query.IrregularFlightRate0 },
        colors: ['#03c5ce'],
        unitText: '%',
      },
      {
        label: '30~60min',
        data: { value: query.IrregularFlightRate30 },
        colors: ['#e7376a'],
        unitText: '%',
      },
      {
        label: '60~',
        data: { value: query.IrregularFlightRate60 },
        colors: ['#a4dd46'],
        unitText: '%',
      },
    ];

    this.pieData2 = [
      {
        label: '0~30min',
        data: { value: query.IrregularPaxRate0 },
        colors: ['#03c5ce'],
        unitText: '%',
      },
      {
        label: '30~60min',
        data: { value: query.IrregularPaxRate30 },
        colors: ['#e7376a'],
        unitText: '%',
      },
      {
        label: '60~',
        data: { value: query.IrregularPaxRate60 },
        colors: ['#a4dd46'],
        unitText: '%',
      },
    ];


    // === 兩邊都沒資料 ===
    if (!hasAnyData) {
      this.barData1 = [];
      this.lineData2 = [];
      this.barData2 = [];
      this.lineData2 = [];
      this.totalFlight = 0;
      this.totalPax = 0;
      this.isNoData = true;
      return;
    }

    //左上圖表
    // ================= Bar：架次比例 =================
    const barSeries: any[] = [];

    if (queryStat.length > 0) {
      barSeries.push({
        label: `${this.dateRangeLabel}異常比例(%)`,
        data: queryStat.map((item) => ({
          key: item.label,
          value: item.IrregularRate,
        })),
        colors: ['#f08622'],
        unitText: '%',
      });
    }

    this.barData1 = barSeries;

    // ================= Line：架次 =================
    const lineSeries: any[] = [];

    if (queryStat.length > 0) {
      lineSeries.push({
        label: `${this.dateRangeLabel}異常架次`,
        data: queryStat.map((item) => ({
          key: item.label,
          value: item.IrregularFlight,
        })),
        colors: ['#0279ce'],
      });
    }

    this.lineData1 = lineSeries;

    //右上圖表
    // ================= Bar：人數比例 =================
    const barSeries2: any[] = [];

    if (queryStat.length > 0) {
      barSeries2.push({
        label: `${this.dateRangeLabel}異常比例(%)`,
        data: queryStat.map((item) => ({
          key: item.label,
          value: item.IrregularPaxRate,
        })),
        colors: ['#61ABF3'],
        unitText: '%',
      });
    }

    this.barData2 = barSeries2;

    // ================= Line：人數 =================
    const lineSeries2: any[] = [];

    if (queryStat.length > 0) {
      lineSeries2.push({
        label: `${this.dateRangeLabel}異常人數`,
        data: queryStat.map((item) => ({
          key: item.label,
          value: item.IrregularPax,
        })),
        colors: ['#B1DC60'],
      });
    }

    this.lineData2 = lineSeries2;
  }
}
