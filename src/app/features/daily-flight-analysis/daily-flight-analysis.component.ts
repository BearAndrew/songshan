import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyFlightAnalysisFlightCardComponent } from './components/daily-flight-analysis-flight-card/daily-flight-analysis-flight-card.component';
import { DailyFlightAnalysisDelayCardComponent } from './components/daily-flight-analysis-delay-card/daily-flight-analysis-delay-card.component';
import { DailyFlightAnalysisDelayPieChartCardComponent } from './components/daily-flight-analysis-delay-pie-chart-card/daily-flight-analysis-delay-pie-chart-card.component';
import { DailyFlightAnalysisAbnormalCardComponent } from './components/daily-flight-analysis-abnormal-card/daily-flight-analysis-abnormal-card.component';
import { DailyFlightAnalysisData } from '../../core/interface/daily-flight-analysis.interface';
import { DailyFlightAnalysisBarlineChartCardComponent } from "./components/daily-flight-analysis-barline-chart-card/daily-flight-analysis-barline-chart-card.component";

@Component({
  selector: 'app-daily-flight-analysis',
  imports: [
    CommonModule,
    DailyFlightAnalysisFlightCardComponent,
    DailyFlightAnalysisDelayCardComponent,
    DailyFlightAnalysisDelayPieChartCardComponent,
    DailyFlightAnalysisAbnormalCardComponent,
    DailyFlightAnalysisBarlineChartCardComponent
],
  templateUrl: './daily-flight-analysis.component.html',
  styleUrl: './daily-flight-analysis.component.scss',
})
export class DailyFlightAnalysisComponent {
  activeIndex: number = 0;
  data: DailyFlightAnalysisData[] = [
    {
      label: '國際兩岸線',
      passengerData: [
        { label: '出境', value: 50, total: 10000 },
        { label: '入境', value: 70, total: 100 },
        { label: '總數', value: 120, total: 10100 },
      ],
      flightData: [
        { label: '到站', value: 90, total: 100 },
        { label: '離站', value: 40, total: 100 },
        { label: '總數', value: 130, total: 200 },
      ],
      delayData: {
        out: [
          {
            flightCode: 'AE',
            flightCount: 4,
            passengerCount: 12462,
            delayTime: 62,
          },
          {
            flightCode: 'BR',
            flightCount: 20,
            passengerCount: 100,
            delayTime: 30,
          },
        ],
        in: [
          {
            flightCode: 'CI',
            flightCount: 10,
            passengerCount: 5000,
            delayTime: 45,
          },
          {
            flightCode: 'CX',
            flightCount: 5,
            passengerCount: 3000,
            delayTime: 25,
          },
          {
            flightCode: 'JL',
            flightCount: 8,
            passengerCount: 4000,
            delayTime: 15,
          },
        ],
      },

      abnormalData: {
        info: [
          {
            flightNumber: 'BR215',
            destination: '澎湖',
            scheduledTime: '06:45',
            affectedPeople: 1202,
            status: '延誤',
          },
          {
            flightNumber: 'CI921',
            destination: '金門',
            scheduledTime: '07:20',
            affectedPeople: 88,
            status: '轉降',
          },
          {
            flightNumber: 'AE367',
            destination: '澎湖',
            scheduledTime: '08:05',
            affectedPeople: 45,
            status: '取消',
          },
        ],
        top3: [
          {
            city: '東京',
            airport: '羽田',
            forecast: { flightCount: 12, passengerCount: 560 },
            actual: { flightCount: 10, passengerCount: 480 },
          },
          {
            city: '上海',
            airport: '虹橋',
            forecast: { flightCount: 9, passengerCount: 430 },
            actual: { flightCount: 8, passengerCount: 390 },
          },
          {
            city: '首爾',
            airport: '金浦',
            forecast: { flightCount: 7, passengerCount: 310 },
            actual: { flightCount: 6, passengerCount: 280 },
          },
        ],
      },
    },

    {
      label: '國際線',
      passengerData: [
        { label: '出境', value: 3000, total: 5000 },
        { label: '入境', value: 50, total: 80 },
        { label: '總數', value: 3050, total: 5080 },
      ],
      flightData: [
        { label: '到站', value: 60, total: 70 },
        { label: '離站', value: 30, total: 40 },
        { label: '總數', value: 90, total: 110 },
      ],
      delayData: {
        out: [
          {
            flightCode: 'AE',
            flightCount: 4,
            passengerCount: 12462,
            delayTime: 62,
          },
          {
            flightCode: 'BR',
            flightCount: 20,
            passengerCount: 2000,
            delayTime: 30,
          },
        ],
        in: [
          {
            flightCode: 'CI',
            flightCount: 10,
            passengerCount: 5000,
            delayTime: 45,
          },
          {
            flightCode: 'CX',
            flightCount: 5,
            passengerCount: 3000,
            delayTime: 25,
          },
          {
            flightCode: 'JL',
            flightCount: 8,
            passengerCount: 4000,
            delayTime: 15,
          },
        ],
      },

      abnormalData: {
        info: [
          {
            flightNumber: 'JJ803',
            destination: '金門',
            scheduledTime: '09:15',
            affectedPeople: 136,
            status: '延誤',
          },
          {
            flightNumber: 'IT312',
            destination: '金門',
            scheduledTime: '10:40',
            affectedPeople: 154,
            status: '轉降',
          },
          {
            flightNumber: 'BR167',
            destination: '澎湖',
            scheduledTime: '11:30',
            affectedPeople: 102,
            status: '轉降',
          },
        ],
        top3: [
          {
            city: '上海',
            airport: '虹橋',
            forecast: { flightCount: 15, passengerCount: 900 },
            actual: { flightCount: 14, passengerCount: 860 },
          },
          {
            city: '東京',
            airport: '羽田',
            forecast: { flightCount: 12, passengerCount: 750 },
            actual: { flightCount: 11, passengerCount: 700 },
          },
          {
            city: '首爾',
            airport: '金浦',
            forecast: { flightCount: 10, passengerCount: 600 },
            actual: { flightCount: 9, passengerCount: 580 },
          },
        ],
      },
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
      delayData: {
        out: [
          {
            flightCode: 'AE',
            flightCount: 4,
            passengerCount: 12462,
            delayTime: 62,
          },
          {
            flightCode: 'BR',
            flightCount: 20,
            passengerCount: 2000,
            delayTime: 30,
          },
        ],
        in: [
          {
            flightCode: 'CI',
            flightCount: 10,
            passengerCount: 5000,
            delayTime: 45,
          },
          {
            flightCode: 'CX',
            flightCount: 5,
            passengerCount: 3000,
            delayTime: 25,
          },
          {
            flightCode: 'JL',
            flightCount: 8,
            passengerCount: 4000,
            delayTime: 15,
          },
        ],
      },

      abnormalData: {
        info: [
          {
            flightNumber: 'CI602',
            destination: '金門',
            scheduledTime: '12:10',
            affectedPeople: 90,
            status: '延誤',
          },
          {
            flightNumber: 'AE955',
            destination: '澎湖',
            scheduledTime: '13:25',
            affectedPeople: 64,
            status: '取消',
          },
        ],
        top3: [
          {
            city: '首爾',
            airport: '金浦',
            forecast: { flightCount: 8, passengerCount: 460 },
            actual: { flightCount: 7, passengerCount: 420 },
          },
          {
            city: '上海',
            airport: '虹橋',
            forecast: { flightCount: 6, passengerCount: 330 },
            actual: { flightCount: 6, passengerCount: 310 },
          },
          {
            city: '東京',
            airport: '羽田',
            forecast: { flightCount: 5, passengerCount: 290 },
            actual: { flightCount: 5, passengerCount: 270 },
          },
        ],
      },
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
      delayData: {
        out: [
          {
            flightCode: 'AE',
            flightCount: 4,
            passengerCount: 12462,
            delayTime: 62,
          },
          {
            flightCode: 'BR',
            flightCount: 20,
            passengerCount: 2000,
            delayTime: 30,
          },
        ],
        in: [
          {
            flightCode: 'CI',
            flightCount: 10,
            passengerCount: 5000,
            delayTime: 45,
          },
          {
            flightCode: 'CX',
            flightCount: 5,
            passengerCount: 3000,
            delayTime: 25,
          },
          {
            flightCode: 'JL',
            flightCount: 8,
            passengerCount: 4000,
            delayTime: 15,
          },
        ],
      },

      abnormalData: {
        info: [
          {
            flightNumber: 'BR900',
            destination: '金門',
            scheduledTime: '14:50',
            affectedPeople: 210,
            status: '轉降',
          },
          {
            flightNumber: 'CI771',
            destination: '澎湖',
            scheduledTime: '15:30',
            affectedPeople: 72,
            status: '延誤',
          },
          {
            flightNumber: 'JJ803',
            destination: '金門',
            scheduledTime: '16:20',
            affectedPeople: 119,
            status: '取消',
          },
        ],
        top3: [
          {
            city: '上海',
            airport: '虹橋',
            forecast: { flightCount: 20, passengerCount: 1000 },
            actual: { flightCount: 18, passengerCount: 950 },
          },
          {
            city: '東京',
            airport: '羽田',
            forecast: { flightCount: 15, passengerCount: 820 },
            actual: { flightCount: 14, passengerCount: 790 },
          },
          {
            city: '首爾',
            airport: '金浦',
            forecast: { flightCount: 14, passengerCount: 700 },
            actual: { flightCount: 13, passengerCount: 670 },
          },
        ],
      },
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
      delayData: {
        out: [
          {
            flightCode: 'AE',
            flightCount: 4,
            passengerCount: 12462,
            delayTime: 62,
          },
          {
            flightCode: 'BR',
            flightCount: 20,
            passengerCount: 2000,
            delayTime: 30,
          },
        ],
        in: [
          {
            flightCode: 'CI',
            flightCount: 10,
            passengerCount: 5000,
            delayTime: 45,
          },
          {
            flightCode: 'CX',
            flightCount: 5,
            passengerCount: 3000,
            delayTime: 25,
          },
          {
            flightCode: 'JL',
            flightCount: 8,
            passengerCount: 4000,
            delayTime: 15,
          },
        ],
      },

      abnormalData: {
        info: [
          {
            flightNumber: 'AE367',
            destination: '澎湖',
            scheduledTime: '19:20',
            affectedPeople: 88,
            status: '轉降',
          },
          {
            flightNumber: 'CI921',
            destination: '金門',
            scheduledTime: '20:30',
            affectedPeople: 62,
            status: '取消',
          },
        ],
        top3: [
          {
            city: '東京',
            airport: '羽田',
            forecast: { flightCount: 30, passengerCount: 1500 },
            actual: { flightCount: 28, passengerCount: 1450 },
          },
          {
            city: '上海',
            airport: '虹橋',
            forecast: { flightCount: 25, passengerCount: 1200 },
            actual: { flightCount: 24, passengerCount: 1180 },
          },
          {
            city: '首爾',
            airport: '金浦',
            forecast: { flightCount: 20, passengerCount: 1000 },
            actual: { flightCount: 19, passengerCount: 980 },
          },
        ],
      },
    },
  ];
}
