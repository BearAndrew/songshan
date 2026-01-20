import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BarLineChartComponent } from '../../../../shared/chart/bar-line-chart/bar-line-chart.component';
import { DataSetWithDataArray } from '../../../../core/lib/chart-tool';

@Component({
  selector: 'app-bar-line-page',
  imports: [CommonModule, BarLineChartComponent],
  templateUrl: './bar-line-page.component.html',
  styleUrl: './bar-line-page.component.scss',
})
export class BarLinePageComponent {
  @Input() barData: DataSetWithDataArray[] = [];
  @Input() lineData: DataSetWithDataArray[] = [];
  @Input() isNoData: boolean = false;
  /** 是否為顯示日期，反之顯示年份，預設為false */
  @Input() isDate = false;
  @Input() dateRangeLabel = '';
  @Input() firstDateRangeLabel = '';
  @Input() secondDateRangeLabel = '';
  @Input() thirdDateRangeLabel = '';

  totalFlight: number = 0;
  totalPax: number = 0;
  compareTotalFlight: number = 0;
  compareTotalPax: number = 0;

}
