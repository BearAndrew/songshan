import { Component, Input, input } from '@angular/core';
import { DailyFlightAnalysisChildComponent } from '../daily-flight-analysis.child-component';
import { DataSetWithData } from '../../../../core/lib/chart-tool';
import { PieChartComponent } from '../../../../shared/chart/pie-chart/pie-chart.component';
import { CommonModule } from '@angular/common';

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

  // flightData: DataSetWithData[] = [
  //   {
  //     label: '0~30m',
  //     data: { value: 45 },
  //     colors: ['#00c4ce'],
  //     unitText: '%',
  //   },
  //   {
  //     label: '30~60m',
  //     data: { value: 20 },
  //     colors: ['#a4dd46'],
  //     unitText: '%',
  //   },
  //   {
  //     label: '60m',
  //     data: { value: 35 },
  //     colors: ['#ceedfe'],
  //     unitText: '%',
  //   },
  // ];

  // /** 圓餅圖 */
  // passengerData: DataSetWithData[] = [
  //  {
  //     label: '0~30m',
  //     data: { value: 45 },
  //     colors: ['#00c4ce'],
  //     unitText: '%',
  //   },
  //   {
  //     label: '30~60m',
  //     data: { value: 20 },
  //     colors: ['#a4dd46'],
  //     unitText: '%',
  //   },
  //   {
  //     label: '60m',
  //     data: { value: 35 },
  //     colors: ['#ceedfe'],
  //     unitText: '%',
  //   },
  // ];
}
