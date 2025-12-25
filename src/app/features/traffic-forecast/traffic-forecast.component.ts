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

  barData: DataSetWithDataArray[] = [];
  lineData: DataSetWithDataArray[] = [];

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
            label: '明日預報人數',
            data: (res.tomorrowStatByHour ?? []).map((s: PredictStatByHour) => ({
              key: s.hour,
              value: s.numOfPax,
            })),
            colors: ['#00d6c8'],
          },
          {
            label: '後日預報人數',
            data: (res.twoDayStatByHour ?? []).map(
              (s: PredictStatByHour) => ({
                key: s.hour,
                value: s.numOfPax,
              })
            ),
            colors: ['#fbb441'],
          },
        ];

        // --- Mapping lineData (實際人數) ---
        this.lineData = [
          {
            label: '明日預報架次',
            data: (res.tomorrowStatByHour ?? []).map((s: PredictStatByHour) => ({
              key: s.hour,
              value: s.numOfFlight, // 如果有實際人數欄位，可改成實際
            })),
            colors: ['#00d6c8'],
          },
          {
            label: '後日預報架次',
            data: (res.twoDayStatByHour ?? []).map(
              (s: PredictStatByHour) => ({
                key: s.hour,
                value: s.numOfFlight,
              })
            ),
            colors: ['#fbb441'],
          },
        ];

        console.log(this.barData)

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
