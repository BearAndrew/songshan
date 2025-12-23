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
  @Input() barData: DataSetWithDataArray[] = [
    {
      label: '出境預報人數',
      data: [
        { key: '0600', value: 120 },
        { key: '0700', value: 340 },
        { key: '0800', value: 220 },
        { key: '0900', value: 480 },
        { key: '1000', value: 150 },
        { key: '1100', value: 390 },
        { key: '1200', value: 560 },
        { key: '1300', value: 310 },
        { key: '1400', value: 420 },
        { key: '1500', value: 260 },
        { key: '1600', value: 500 },
        { key: '1700', value: 180 },
        { key: '1800', value: 600 },
        { key: '1900', value: 270 },
        { key: '2000', value: 430 },
        { key: '2100', value: 350 },
        { key: '2200', value: 290 },
      ],
      colors: ['#00d6c8'],
    },
    {
      label: '入境預報人數',
      data: [
        { key: '0600', value: 80 },
        { key: '0700', value: 260 },
        { key: '0800', value: 310 },
        { key: '0900', value: 450 },
        { key: '1000', value: 190 },
        { key: '1100', value: 420 },
        { key: '1200', value: 530 },
        { key: '1300', value: 280 },
        { key: '1400', value: 390 },
        { key: '1500', value: 240 },
        { key: '1600', value: 470 },
        { key: '1700', value: 210 },
        { key: '1800', value: 580 },
        { key: '1900', value: 300 },
        { key: '2000', value: 410 },
        { key: '2100', value: 360 },
        { key: '2200', value: 250 },
      ],
      colors: ['#0279ce'],
    },
  ];
  @Input() lineData: DataSetWithDataArray[] = [
    {
      label: '出境實際人數',
      data: [
        { key: '0600', value: 140 },
        { key: '0700', value: 320 },
        { key: '0800', value: 200 },
        { key: '0900', value: 510 },
        { key: '1000', value: 170 },
        { key: '1100', value: 360 },
        { key: '1200', value: 600 },
        { key: '1300', value: 330 },
        { key: '1400', value: 450 },
        { key: '1500', value: 290 },
        { key: '1600', value: 520 },
        { key: '1700', value: 160 },
        { key: '1800', value: 590 },
        { key: '1900', value: 260 },
        { key: '2000', value: 440 },
        { key: '2100', value: 380 },
        { key: '2200', value: 310 },
      ],
      colors: ['#00d6c8'],
    },
    {
      label: '入境實際人數',
      data: [
        { key: '0600', value: 60 },
        { key: '0700', value: 300 },
        { key: '0800', value: 250 },
        { key: '0900', value: 470 },
        { key: '1000', value: 130 },
        { key: '1100', value: 410 },
        { key: '1200', value: 540 },
        { key: '1300', value: 290 },
        { key: '1400', value: 400 },
        { key: '1500', value: 230 },
        { key: '1600', value: 490 },
        { key: '1700', value: 200 },
        { key: '1800', value: 570 },
        { key: '1900', value: 280 },
        { key: '2000', value: 420 },
        { key: '2100', value: 340 },
        { key: '2200', value: 270 },
      ],
      colors: ['#0279ce'],
    },
  ];
}
