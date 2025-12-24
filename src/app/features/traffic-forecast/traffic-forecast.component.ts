import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TrafficForecastTableComponent } from './components/traffic-forecast-table/traffic-forecast-table.component';
import { BarLineChartComponent } from '../../shared/chart/bar-line-chart/bar-line-chart.component';
import { DataSetWithDataArray } from '../../core/lib/chart-tool';
import { TrafficFlightRow } from '../../core/interface/traffic-forecast.interface';
import {
  FlightTrafficPredictResponse,
  PredictFlightItem,
  PredictStatByHour,
} from '../../models/flight-traffic-predict.model';
import { ApiService } from '../../core/services/api-service.service';
import { CommonService } from '../../core/services/common.service';

@Component({
  selector: 'app-traffic-forecast',
  imports: [CommonModule, TrafficForecastTableComponent, BarLineChartComponent],
  templateUrl: './traffic-forecast.component.html',
  styleUrl: './traffic-forecast.component.scss',
})
export class TrafficForecastComponent {
  activeIndex: number = 0;
  data = [
    {
      label: '國際兩岸線',
      value: 'nondomestic',
    },
    {
      label: '國際線',
      value: 'intl',
    },
    {
      label: '兩岸線',
      value: 'crossstrait',
    },
    {
      label: '國內線',
      value: 'domestic',
    },
    {
      label: '總數',
      value: 'all',
    },
  ];

  dayActiveIndex: number = 0;
  dayData = [
    { label: '明日', value: '1DAY' },
    { label: '後日', value: '2DAY' },
  ];

  airportId: string = '';

  barData: DataSetWithDataArray[] = [
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
  lineData: DataSetWithDataArray[] = [
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

  tableOut: TrafficFlightRow[] = [
    {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      destination: '東京',
      passengerCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 2,
    },
    {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      destination: '東京',
      passengerCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 2,
    },
    {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      destination: '東京',
      passengerCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 2,
    },
    {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      destination: '東京',
      passengerCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 2,
    },
    {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      destination: '東京',
      passengerCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 2,
    },
  ];

  tableIn: TrafficFlightRow[] = [
    {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      destination: '東京',
      passengerCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 2,
    },
    {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      destination: '東京',
      passengerCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 2,
    },
    {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      destination: '東京',
      passengerCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 2,
    },
    {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      destination: '東京',
      passengerCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 2,
    },
    {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      destination: '東京',
      passengerCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      destination: '首爾',
      passengerCount: 2,
    },
  ];

  tomorrowFlight = 0;
  twoDayFlight = 0;
  tomorrowPax = 0;
  twoDayPax = 0;

  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    //預設取得不分機場總數
    this.commonService.getSelectedAirport().subscribe((airportId) => {
      // 根據選擇的機場ID執行相應的操作，例如重新載入資料
      if (airportId === -1) {
        return;
      }
      this.airportId = this.commonService.getAirportCodeById(airportId) || '-1';
      this.getData();
    });
  }

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    this.apiService
      .getFlightTrafficPredict(
        this.airportId,
        this.dayData[this.dayActiveIndex].value,
        this.data[this.activeIndex].value
      )
      .subscribe((res: FlightTrafficPredictResponse) => {
        // --- Mapping tableOut & tableIn ---
        this.tableOut = res.outboundFlight.map((f: PredictFlightItem) => ({
          flightNumber: f.flightNo,
          airline: f.airlineName,
          departureTime: f.schTime,
          destination: f.airportName,
          passengerCount: f.noOfPax,
        }));

        this.tableIn = res.inboundFlight.map((f: PredictFlightItem) => ({
          flightNumber: f.flightNo,
          airline: f.airlineName,
          departureTime: f.schTime,
          destination: f.airportName,
          passengerCount: f.noOfPax,
        }));

        // --- Mapping barData ---
        this.barData = [
          {
            label: '出境預報人數',
            data: (res.twoDayStatByHour ?? []).map((s: PredictStatByHour) => ({
              key: s.hour,
              value: s.numOfPax,
            })),
            colors: ['#00d6c8'],
          },
          {
            label: '入境預報人數',
            data: (res.tomorrowStatByHour ?? []).map(
              (s: PredictStatByHour) => ({
                key: s.hour,
                value: s.numOfPax,
              })
            ),
            colors: ['#0279ce'],
          },
        ];

        // --- Mapping lineData (實際人數) ---
        this.lineData = [
          {
            label: '出境實際人數',
            data: (res.twoDayStatByHour ?? []).map((s: PredictStatByHour) => ({
              key: s.hour,
              value: s.numOfPax, // 如果有實際人數欄位，可改成實際
            })),
            colors: ['#00d6c8'],
          },
          {
            label: '入境實際人數',
            data: (res.tomorrowStatByHour ?? []).map(
              (s: PredictStatByHour) => ({
                key: s.hour,
                value: s.numOfPax,
              })
            ),
            colors: ['#0279ce'],
          },
        ];

        this.tomorrowFlight = res.tomorrowFlight;
        this.twoDayFlight = res.twoDayFlight;
        this.tomorrowPax = res.tomorrowPax;
        this.twoDayPax = res.twoDayPax;
      });
  }

  onTabClick(newIndex: number): void {
    this.activeIndex = newIndex;
    this.getData();
  }

  onDayTabClick(newIndex: number): void {
    this.dayActiveIndex = newIndex;
    this.getData();
  }
}
