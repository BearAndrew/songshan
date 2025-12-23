import { Component, Input } from '@angular/core';
import { DailyFlightAnalysisChildComponent } from '../daily-flight-analysis.child-component';
import { BarLineChartComponent } from '../../../../shared/chart/bar-line-chart/bar-line-chart.component';
import { DataSetWithDataArray } from '../../../../core/lib/chart-tool';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daily-flight-analysis-barline-chart-card',
  imports: [CommonModule, BarLineChartComponent],
  templateUrl: './daily-flight-analysis-barline-chart-card.component.html',
  styleUrl: './daily-flight-analysis-barline-chart-card.component.scss',
})
export class DailyFlightAnalysisBarlineChartCardComponent extends DailyFlightAnalysisChildComponent {
  @Input() title: string = '';
  @Input() barData: DataSetWithDataArray[] = [];
  @Input() lineData: DataSetWithDataArray[] = []; 
}
