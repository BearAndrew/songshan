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
  /** 是否為準點率，因為準點率後來追加規則，line&bar 資料數量會不同 */
  @Input() isOntime: boolean = false;
  /** 是否為顯示日期，反之顯示年份，預設為true */
  @Input() isDate = true;
  /** 是否顯示比較資料(2019年)，預設為true */
  @Input() isShowCompare = true;
  @Input() dateRangeLabel = '';
  @Input() firstDateRangeLabel = '';
  @Input() secondDateRangeLabel = '';
  @Input() thirdDateRangeLabel = '';

  totalFlight: number = 0;
  totalPax: number = 0;
  compareTotalFlight: number = 0;
  compareTotalPax: number = 0;

}
