import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DailyFlightAnalysisChildComponent } from '../daily-flight-analysis.child-component';

@Component({
  selector: 'app-daily-flight-analysis-delay-card',
  imports: [CommonModule],
  templateUrl: './daily-flight-analysis-delay-card.component.html',
  styleUrl: './daily-flight-analysis-delay-card.component.scss',
})
export class DailyFlightAnalysisDelayCardComponent extends DailyFlightAnalysisChildComponent {
  toggleIndex: number = 0;
}
