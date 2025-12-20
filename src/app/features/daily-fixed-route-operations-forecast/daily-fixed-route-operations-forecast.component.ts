import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { CssBarChartComponent } from '../../shared/chart/css-bar-chart/css-bar-chart.component';
import { ForecastCardComponent } from "./components/forecast-card/forecast-card.component";
import { ApiService } from '../../core/services/api-service.service';
import { CommonService } from '../../core/services/common.service';
import { TodayPredict } from '../../models/today-predict.model';
import { ForecastInput } from '../../models/forcast-input.model';

@Component({
  selector: 'app-daily-fixed-route-operations-forecast',
  imports: [CommonModule, CssBarChartComponent, ForecastCardComponent, NgIf],
  templateUrl: './daily-fixed-route-operations-forecast.component.html',
  styleUrl: './daily-fixed-route-operations-forecast.component.scss',
})
export class DailyFixedRouteOperationsForecastComponent {
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
      ],
      flightData: [
        { label: '到站', value: 30, total: 30 },
        { label: '離站', value: 10, total: 20 },
      ],
    },
    {
      label: '國內線',
      passengerData: [
        { label: '出境', value: 4000, total: 4500 },
        { label: '入境', value: 100, total: 120 },
      ],
      flightData: [
        { label: '到站', value: 70, total: 80 },
        { label: '離站', value: 50, total: 60 },
      ],
    },
    {
      label: '總數',
      passengerData: [
        { label: '出境', value: 10000, total: 20000 },
        { label: '入境', value: 240, total: 320 },
      ],
      flightData: [
        { label: '到站', value: 250, total: 270 },
        { label: '離站', value: 130, total: 160 },
      ],
    },
  ];

  realFlight: number = 0;
  predictFlight: number = 0;
  realPassenger: number = 0;
  predictPassenger: number = 0;
  forecastInput!: ForecastInput;

    constructor(private apiService: ApiService, private commonService: CommonService) {
      //預設取得不分機場總數
      this.getTodayPredict();
      this.commonService.getSelectedAirport().subscribe(airportId => {
        // 根據選擇的機場ID執行相應的操作，例如重新載入資料
        if (airportId === -1) {
          this.getTodayPredict();
          return;
        }
        this.getTodayPredictByCode(airportId);
      }); 
    }  

     getTodayPredict() {
      this.apiService.getTodayPredict().subscribe(res => {
        this.setPredictData(res);
      });
    }

    getTodayPredictByCode(value:number) {
      const code = this.commonService.getAirportCodeById(value);
      this.apiService.getTodayPredictByAirport(code).subscribe(res => {
        this.setPredictData(res);
      });
    }

    setPredictData(res: TodayPredict) {
        // 在這裡處理 API 回傳的資料
        //0, 國際兩岸線
     
        this.chartData[0].passengerData[0].value = res.crossStrait_Arrived.noOfPax_Outbound + res.intl_Arrived.noOfPax_Outbound;
        this.chartData[0].passengerData[0].total = res.crossStrait_Predict.noOfPax_Outbound + res.intl_Predict.noOfPax_Outbound;
        this.chartData[0].passengerData[1].value = res.crossStrait_Arrived.noOfPax_Inbound + res.intl_Arrived.noOfPax_Inbound;
        this.chartData[0].passengerData[1].total = res.crossStrait_Predict.noOfPax_Inbound + res.intl_Predict.noOfPax_Inbound;

        this.chartData[0].flightData[0].value = res.crossStrait_Arrived.noOfFlight_Inbound + res.intl_Arrived.noOfFlight_Inbound;
        this.chartData[0].flightData[0].total = res.crossStrait_Predict.noOfFlight_Inbound + res.intl_Predict.noOfFlight_Inbound;
        this.chartData[0].flightData[1].value = res.crossStrait_Arrived.noOfFlight_Outbound + res.intl_Arrived.noOfFlight_Outbound;
        this.chartData[0].flightData[1].total = res.crossStrait_Predict.noOfFlight_Outbound + res.intl_Predict.noOfFlight_Outbound;

        //依此類推，設定其他類別的資料
        // 1, 國際線
        this.chartData[1].passengerData[0].value = res.intl_Arrived.noOfPax_Outbound;
        this.chartData[1].passengerData[0].total = res.intl_Predict.noOfPax_Outbound;
        this.chartData[1].passengerData[1].value = res.intl_Arrived.noOfPax_Inbound;
        this.chartData[1].passengerData[1].total = res.intl_Predict.noOfPax_Inbound;

        this.chartData[1].flightData[0].value = res.intl_Arrived.noOfFlight_Inbound;
        this.chartData[1].flightData[0].total = res.intl_Predict.noOfFlight_Inbound;
        this.chartData[1].flightData[1].value = res.intl_Arrived.noOfFlight_Outbound;
        this.chartData[1].flightData[1].total = res.intl_Predict.noOfFlight_Outbound;

        // 2, 兩岸線
        this.chartData[2].passengerData[0].value = res.crossStrait_Arrived.noOfPax_Outbound;
        this.chartData[2].passengerData[0].total = res.crossStrait_Predict.noOfPax_Outbound;
        this.chartData[2].passengerData[1].value = res.crossStrait_Arrived.noOfPax_Inbound;
        this.chartData[2].passengerData[1].total = res.crossStrait_Predict.noOfPax_Inbound;

        this.chartData[2].flightData[0].value = res.crossStrait_Arrived.noOfFlight_Inbound;
        this.chartData[2].flightData[0].total = res.crossStrait_Predict.noOfFlight_Inbound;
        this.chartData[2].flightData[1].value = res.crossStrait_Arrived.noOfFlight_Outbound;
        this.chartData[2].flightData[1].total = res.crossStrait_Predict.noOfFlight_Outbound;

        // 3, 國內線
        this.chartData[3].passengerData[0].value = res.domestic_Arrived.noOfPax_Outbound;
        this.chartData[3].passengerData[0].total = res.domestic_Predict.noOfPax_Outbound;
        this.chartData[3].passengerData[1].value = res.domestic_Arrived.noOfPax_Inbound;
        this.chartData[3].passengerData[1].total = res.domestic_Predict.noOfPax_Inbound;

        this.chartData[3].flightData[0].value = res.domestic_Arrived.noOfFlight_Inbound;
        this.chartData[3].flightData[0].total = res.domestic_Predict.noOfFlight_Inbound;
        this.chartData[3].flightData[1].value = res.domestic_Arrived.noOfFlight_Outbound;
        this.chartData[3].flightData[1].total = res.domestic_Predict.noOfFlight_Outbound;

        // 4, 總數
        this.chartData[4].passengerData[0].value = res.crossStrait_Arrived.noOfPax_Outbound + res.intl_Arrived.noOfPax_Outbound + res.domestic_Arrived.noOfPax_Outbound;
        this.chartData[4].passengerData[0].total = res.crossStrait_Predict.noOfPax_Outbound + res.intl_Predict.noOfPax_Outbound + res.domestic_Predict.noOfPax_Outbound;
        this.chartData[4].passengerData[1].value = res.crossStrait_Arrived.noOfPax_Inbound + res.intl_Arrived.noOfPax_Inbound + res.domestic_Arrived.noOfPax_Inbound;
        this.chartData[4].passengerData[1].total = res.crossStrait_Predict.noOfPax_Inbound + res.intl_Predict.noOfPax_Inbound + res.domestic_Predict.noOfPax_Inbound;

        this.chartData[4].flightData[0].value = res.crossStrait_Arrived.noOfFlight_Inbound + res.intl_Arrived.noOfFlight_Inbound + res.domestic_Arrived.noOfFlight_Inbound;
        this.chartData[4].flightData[0].total = res.crossStrait_Predict.noOfFlight_Inbound + res.intl_Predict.noOfFlight_Inbound + res.domestic_Predict.noOfFlight_Inbound;
        this.chartData[4].flightData[1].value = res.crossStrait_Arrived.noOfFlight_Outbound + res.intl_Arrived.noOfFlight_Outbound + res.domestic_Arrived.noOfFlight_Outbound;
        this.chartData[4].flightData[1].total = res.crossStrait_Predict.noOfFlight_Outbound + res.intl_Predict.noOfFlight_Outbound + res.domestic_Predict.noOfFlight_Outbound;

        //設定總數顯示
        this.realFlight = res.totalFlight_Arrived;
        this.predictFlight = res.totalFlight_Predict;
        this.realPassenger = res.totalPax_Arrived;
        this.predictPassenger = res.totalPax_Predict;

        //設定60分鐘預測資料
        this.forecastInput = {
          intl_Predict60_noOfFlight_InBound: res.intl_Predict60.noOfFlight_Inbound,
          intl_Predict60_noOfFlight_OutBound: res.intl_Predict60.noOfFlight_Outbound,
          intl_Predict120_noOfFlight_InBound: res.intl_Predict120.noOfFlight_Inbound,
          intl_Predict120_noOfFlight_OutBound: res.intl_Predict120.noOfFlight_Outbound,
          intl_Predict60_noOfPax_InBound: res.intl_Predict60.noOfPax_Inbound,
          intl_Predict60_noOfPax_OutBound: res.intl_Predict60.noOfPax_Outbound,
          intl_Predict120_noOfPax_InBound: res.intl_Predict120.noOfPax_Inbound,
          intl_Predict120_noOfPax_OutBound: res.intl_Predict120.noOfPax_Outbound,
          crossStrait_Predict60_noOfFlight_InBound: res.crossStrait_Predict60.noOfFlight_Inbound,
          crossStrait_Predict60_noOfFlight_OutBound: res.crossStrait_Predict60.noOfFlight_Outbound,
          crossStrait_Predict120_noOfFlight_InBound: res.crossStrait_Predict120.noOfFlight_Inbound,
          crossStrait_Predict120_noOfFlight_OutBound: res.crossStrait_Predict120.noOfFlight_Outbound,
          crossStrait_Predict60_noOfPax_InBound: res.crossStrait_Predict60.noOfPax_Inbound,
          crossStrait_Predict60_noOfPax_OutBound: res.crossStrait_Predict60.noOfPax_Outbound,
          crossStrait_Predict120_noOfPax_InBound: res.crossStrait_Predict120.noOfPax_Inbound,
          crossStrait_Predict120_noOfPax_OutBound: res.crossStrait_Predict120.noOfPax_Outbound,
          domestic_Predict60_noOfFlight_InBound: res.domestic_Predict60.noOfFlight_Inbound,
          domestic_Predict60_noOfFlight_OutBound: res.domestic_Predict60.noOfFlight_Outbound,
          domestic_Predict30_noOfFlight_InBound: res.domestic_Predict30.noOfFlight_Inbound,
          domestic_Predict30_noOfFlight_OutBound: res.domestic_Predict30.noOfFlight_Outbound,
          domestic_Predict60_noOfPax_InBound: res.domestic_Predict60.noOfPax_Inbound,
          domestic_Predict60_noOfPax_OutBound: res.domestic_Predict60.noOfPax_Outbound,
          domestic_Predict30_noOfPax_InBound: res.domestic_Predict30.noOfPax_Inbound,
          domestic_Predict30_noOfPax_OutBound: res.domestic_Predict30.noOfPax_Outbound,
        };
      }
  
  }
