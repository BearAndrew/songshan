import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DailyFlightAnalysisChildComponent } from '../daily-flight-analysis.child-component';

@Component({
  selector: 'app-daily-flight-analysis-abnormal-card',
  imports: [CommonModule],
  templateUrl: './daily-flight-analysis-abnormal-card.component.html',
  styleUrl: './daily-flight-analysis-abnormal-card.component.scss',
})
export class DailyFlightAnalysisAbnormalCardComponent extends DailyFlightAnalysisChildComponent {
  toggleIndex: number = 0;
}
