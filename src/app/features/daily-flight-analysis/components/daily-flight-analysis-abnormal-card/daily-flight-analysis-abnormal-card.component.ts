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
  // @Input() allData!: DailyFlightAnalysisAbnormalData;
  allData!: DailyFlightAnalysisAbnormalData;

  displayData!: DailyFlightAnalysisAbnormalData;

  ngOnInit(): void {
    this.mergeAllData();
    this.displayData = this.outData;
  }

  ngOnChanges(): void {
    this.mergeAllData();
    this.onIndexChange(this.toggleIndex);
  }

  onIndexChange(index: number): void {
    this.toggleIndex = index;
    this.mergeAllData();
    switch (index) {
      case 0:
        this.displayData = this.outData;
        break;
      case 1:
        this.displayData = this.inData;
        break;
      case 2:
        this.displayData = this.allData;
        break;
    }
  }

  private mergeAllData(): void {
  this.allData = {
    info: [
      ...(this.inData.info ?? []),
      ...(this.outData.info ?? []),
    ],
    top3: [
      ...(this.inData.top3 ?? []),
      ...(this.outData.top3 ?? []),
    ],
  };
}

}
