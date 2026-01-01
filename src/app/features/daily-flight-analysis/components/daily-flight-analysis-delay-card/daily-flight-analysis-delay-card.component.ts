import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DailyFlightAnalysisChildComponent } from '../daily-flight-analysis.child-component';
import { DailyFlightAnalysisDelayData } from '../../../../core/interface/daily-flight-analysis.interface';

@Component({
  selector: 'app-daily-flight-analysis-delay-card',
  imports: [CommonModule],
  templateUrl: './daily-flight-analysis-delay-card.component.html',
  styleUrl: './daily-flight-analysis-delay-card.component.scss',
})
export class DailyFlightAnalysisDelayCardComponent extends DailyFlightAnalysisChildComponent {
  toggleIndex: number = 0;
  displayData!: DailyFlightAnalysisDelayData;

  ngOnInit(): void {
    this.displayData = this.data[this.activeIndex].delayData.airline;
  }

  onTabChange(index: number) {
    this.toggleIndex = index;
    if (this.toggleIndex == 0) {
      this.displayData = this.data[this.activeIndex].delayData.airline;
    } else {
      this.displayData = this.data[this.activeIndex].delayData.airport;
    }

    console.log(this.displayData)
  }
}
