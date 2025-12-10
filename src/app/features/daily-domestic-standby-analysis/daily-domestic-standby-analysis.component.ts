import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CssBarChartComponent } from '../../shared/chart/css-bar-chart/css-bar-chart.component';

@Component({
  selector: 'app-daily-domestic-standby-analysis',
  imports: [CommonModule, CssBarChartComponent],
  templateUrl: './daily-domestic-standby-analysis.component.html',
  styleUrl: './daily-domestic-standby-analysis.component.scss'
})
export class DailyDomesticStandbyAnalysisComponent {
  activeIndex: number = 0;
  chartData = [
    {
      label: '國際兩岸線',
      passengerData: [
        { label: '出境', value: 50, total: 10000 },
        { label: '入境', value: 70, total: 100 },
      ],
      flightData: [
        { label: '到站', value: 90, total: 100 },
        { label: '離站', value: 40, total: 100 },
      ],
    },
    {
      label: '國際線',
      passengerData: [
        { label: '出境', value: 3000, total: 5000 },
        { label: '入境', value: 50, total: 80 },
      ],
      flightData: [
        { label: '到站', value: 60, total: 70 },
        { label: '離站', value: 30, total: 40 },
      ],
    },
    {
      label: '兩岸線',
      passengerData: [
        { label: '出境', value: 2000, total: 5000 },
        { label: '入境', value: 20, total: 20 },
        { label: '總數', value: 2020, total: 5020 },
      ],
      flightData: [
        { label: '到站', value: 30, total: 30 },
        { label: '離站', value: 10, total: 20 },
        { label: '總數', value: 40, total: 50 },
      ],
    },
    {
      label: '國內線',
      passengerData: [
        { label: '出境', value: 4000, total: 4500 },
        { label: '入境', value: 100, total: 120 },
        { label: '總數', value: 4100, total: 4620 },
      ],
      flightData: [
        { label: '到站', value: 70, total: 80 },
        { label: '離站', value: 50, total: 60 },
        { label: '總數', value: 120, total: 140 },
      ],
    },
    {
      label: '總數',
      passengerData: [
        { label: '出境', value: 10000, total: 20000 },
        { label: '入境', value: 240, total: 320 },
        { label: '總數', value: 10240, total: 20320 },
      ],
      flightData: [
        { label: '到站', value: 250, total: 270 },
        { label: '離站', value: 130, total: 160 },
        { label: '總數', value: 380, total: 430 },
      ],
    },
  ];
}
