import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CssBarChartComponent } from '../../../../shared/chart/css-bar-chart/css-bar-chart.component';
import { DailyFlightAnalysisChildComponent } from '../daily-flight-analysis.child-component';

@Component({
  selector: 'app-daily-flight-analysis-flight-card',
  imports: [CommonModule, CssBarChartComponent],
  templateUrl: './daily-flight-analysis-flight-card.component.html',
  styleUrl: './daily-flight-analysis-flight-card.component.scss'
})
export class DailyFlightAnalysisFlightCardComponent extends DailyFlightAnalysisChildComponent {
}
