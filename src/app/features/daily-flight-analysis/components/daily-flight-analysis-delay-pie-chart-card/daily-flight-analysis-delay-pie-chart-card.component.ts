import { Component, Input, input } from '@angular/core';
import { DailyFlightAnalysisChildComponent } from '../daily-flight-analysis.child-component';
import { DataSetWithData } from '../../../../core/lib/chart-tool';
import { PieChartComponent } from '../../../../shared/chart/pie-chart/pie-chart.component';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../../core/services/common.service';

@Component({
  selector: 'app-daily-flight-analysis-delay-pie-chart-card',
  imports: [CommonModule, PieChartComponent],
  standalone: true,
  templateUrl: './daily-flight-analysis-delay-pie-chart-card.component.html',
  styleUrl: './daily-flight-analysis-delay-pie-chart-card.component.scss',
})
export class DailyFlightAnalysisDelayPieChartCardComponent extends DailyFlightAnalysisChildComponent {
  @Input() inboundData: DataSetWithData[] = [];
  @Input() outboundData: DataSetWithData[] = [];
  @Input() pieCharData: {
    inFlight: number;
    inPax: number;
    inTime: number;
    outFlight: number;
    outPax: number;
    outTime: number;
  } = {
    inFlight: 0,
    inPax: 0,
    inTime: 0,
    outFlight: 0,
    outPax: 0,
    outTime: 0,
  };

  isMobile = false;

  constructor(private commonService: CommonService) {
    super();
    this.commonService.observeScreenSize().subscribe((size) => {
      this.isMobile = size == 'sm';
    });
  }
}
