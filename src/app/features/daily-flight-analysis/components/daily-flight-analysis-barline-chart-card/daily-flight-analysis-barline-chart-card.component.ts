import { Component, Input } from '@angular/core';
import { DailyFlightAnalysisChildComponent } from '../daily-flight-analysis.child-component';

@Component({
  selector: 'app-daily-flight-analysis-barline-chart-card',
  imports: [],
  templateUrl: './daily-flight-analysis-barline-chart-card.component.html',
  styleUrl: './daily-flight-analysis-barline-chart-card.component.scss'
})
export class DailyFlightAnalysisBarlineChartCardComponent extends DailyFlightAnalysisChildComponent {
  @Input() title: string = '';
}
