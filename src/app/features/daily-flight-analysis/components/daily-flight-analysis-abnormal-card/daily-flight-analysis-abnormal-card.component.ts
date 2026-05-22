import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DailyFlightAnalysisChildComponent } from '../daily-flight-analysis.child-component';
import { DailyFlightAnalysisAbnormalData } from '../../../../core/interface/daily-flight-analysis.interface';

@Component({
  selector: 'app-daily-flight-analysis-abnormal-card',
  imports: [CommonModule],
  templateUrl: './daily-flight-analysis-abnormal-card.component.html',
  styleUrl: './daily-flight-analysis-abnormal-card.component.scss',
})
export class DailyFlightAnalysisAbnormalCardComponent extends DailyFlightAnalysisChildComponent {
  toggleIndex: number = 0;
  @Input() inData!: DailyFlightAnalysisAbnormalData;
  @Input() outData!: DailyFlightAnalysisAbnormalData;
  @Input() allData!: DailyFlightAnalysisAbnormalData;

  get displayData(): DailyFlightAnalysisAbnormalData {
    switch (this.toggleIndex) {
      case 1:
        return this.inData;
      case 2:
        return this.allData;
      case 0:
      default:
        return this.outData;
    }
  }

  onIndexChange(index: number): void {
    this.toggleIndex = index;
  }
}
