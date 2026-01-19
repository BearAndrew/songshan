import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CssBarChartComponent } from '../../shared/chart/css-bar-chart/css-bar-chart.component';
import { ForecastCardComponent } from './components/forecast-card/forecast-card.component';
import { ApiService } from '../../core/services/api-service.service';
import { CommonService } from '../../core/services/common.service';
import { TodayPredict } from '../../models/today-predict.model';
import { ForecastInput } from '../../models/forcast-input.model';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { Option } from '../../shared/components/dropdown/dropdown.component';
import { interval, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-daily-fixed-route-operations-forecast',
  imports: [
    CommonModule,
    CssBarChartComponent,
    ForecastCardComponent,
    DropdownComponent,
  ],
  templateUrl: './daily-fixed-route-operations-forecast.component.html',
  styleUrl: './daily-fixed-route-operations-forecast.component.scss',
})
export class DailyFixedRouteOperationsForecastComponent {
  activeIndex: number = 0;
  chartData = [
    {
      label: '國際兩岸線',
      passengerData: [
        { label: '出境', value: 0, total: 0 },
        { label: '入境', value: 0, total: 0 },
      ],
      flightData: [
        { label: '離站', value: 0, total: 0 },
        { label: '到站', value: 0, total: 0 },
      ],
    },
    {
      label: '國際線',
      passengerData: [
        { label: '出境', value: 0, total: 0 },
        { label: '入境', value: 0, total: 0 },
      ],
      flightData: [
        { label: '離站', value: 0, total: 0 },
        { label: '到站', value: 0, total: 0 },
      ],
    },
    {
      label: '兩岸線',
      passengerData: [
        { label: '出境', value: 0, total: 0 },
        { label: '入境', value: 0, total: 0 },
      ],
      flightData: [
        { label: '離站', value: 0, total: 0 },
        { label: '到站', value: 0, total: 0 },
      ],
    },
    {
      label: '國內線',
      passengerData: [
        { label: '出境', value: 0, total: 0 },
        { label: '入境', value: 0, total: 0 },
      ],
      flightData: [
        { label: '離站', value: 0, total: 0 },
        { label: '到站', value: 0, total: 0 },
      ],
    },
    {
      label: '總數',
      passengerData: [
        { label: '出境', value: 0, total: 0 },
        { label: '入境', value: 0, total: 0 },
      ],
      flightData: [
        { label: '離站', value: 0, total: 0 },
        { label: '到站', value: 0, total: 0 },
      ],
    },
  ];

  mobileOptions: Option[] = [
    {
      label: '國際兩岸線',
      value: 0,
    },
    {
      label: '國際線',
      value: 1,
    },
    {
      label: '兩岸線',
      value: 2,
    },
    {
      label: '國內線',
      value: 3,
    },
    {
      label: '總數',
      value: 4,
    },
  ];

  realFlight: number = 0;
  predictFlight: number = 0;
  realPassenger: number = 0;
  predictPassenger: number = 0;
  forecastInput!: ForecastInput;

  res!: TodayPredict;
  private destroy$ = new Subject<void>();
  isMobile = false;

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
  ) {
    // 依選擇的機場，每 30 秒重新呼叫
    this.commonService
      .getSelectedAirport()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((airportId) => {
          if (airportId === -1) {
            return []; // 不呼叫 API
          }

          return interval(30000).pipe(
            startWith(0), // 立即執行一次
            takeUntil(this.destroy$),
            switchMap(() => this.getTodayPredictByCode(airportId)),
          );
        }),
      )
      .subscribe();

    // 螢幕尺寸
    this.commonService
      .observeScreenSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe((size) => {
        this.isMobile = size === 'sm';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTodayPredict() {
    this.apiService.getTodayPredict().subscribe((res) => {
      this.setPredictData(res);
    });
  }

  getTodayPredictByCode(value: number) {
    const code = this.commonService.getAirportCodeById(value);

    return this.apiService.getTodayPredictByAirport(code).pipe(
      tap((res) => {
        this.setPredictData(res);
      }),
    );
  }

  setPredictData(res: TodayPredict) {
    this.res = res;
    // 在這裡處理 API 回傳的資料
    //0, 國際兩岸線

    this.chartData[0].passengerData[0].value =
      res.crossStrait_Arrived.noOfPax_Outbound +
      res.intl_Arrived.noOfPax_Outbound;
    this.chartData[0].passengerData[0].total =
      res.crossStrait_Predict.noOfPax_Outbound +
      res.intl_Predict.noOfPax_Outbound;
    this.chartData[0].passengerData[1].value =
      res.crossStrait_Arrived.noOfPax_Inbound +
      res.intl_Arrived.noOfPax_Inbound;
    this.chartData[0].passengerData[1].total =
      res.crossStrait_Predict.noOfPax_Inbound +
      res.intl_Predict.noOfPax_Inbound;

    this.chartData[0].flightData[1].value =
      res.crossStrait_Arrived.noOfFlight_Inbound +
      res.intl_Arrived.noOfFlight_Inbound;
    this.chartData[0].flightData[1].total =
      res.crossStrait_Predict.noOfFlight_Inbound +
      res.intl_Predict.noOfFlight_Inbound;
    this.chartData[0].flightData[0].value =
      res.crossStrait_Arrived.noOfFlight_Outbound +
      res.intl_Arrived.noOfFlight_Outbound;
    this.chartData[0].flightData[0].total =
      res.crossStrait_Predict.noOfFlight_Outbound +
      res.intl_Predict.noOfFlight_Outbound;

    //依此類推，設定其他類別的資料
    // 1, 國際線
    this.chartData[1].passengerData[0].value =
      res.intl_Arrived.noOfPax_Outbound;
    this.chartData[1].passengerData[0].total =
      res.intl_Predict.noOfPax_Outbound;
    this.chartData[1].passengerData[1].value = res.intl_Arrived.noOfPax_Inbound;
    this.chartData[1].passengerData[1].total = res.intl_Predict.noOfPax_Inbound;

    this.chartData[1].flightData[1].value = res.intl_Arrived.noOfFlight_Inbound;
    this.chartData[1].flightData[1].total = res.intl_Predict.noOfFlight_Inbound;
    this.chartData[1].flightData[0].value =
      res.intl_Arrived.noOfFlight_Outbound;
    this.chartData[1].flightData[0].total =
      res.intl_Predict.noOfFlight_Outbound;

    // 2, 兩岸線
    this.chartData[2].passengerData[0].value =
      res.crossStrait_Arrived.noOfPax_Outbound;
    this.chartData[2].passengerData[0].total =
      res.crossStrait_Predict.noOfPax_Outbound;
    this.chartData[2].passengerData[1].value =
      res.crossStrait_Arrived.noOfPax_Inbound;
    this.chartData[2].passengerData[1].total =
      res.crossStrait_Predict.noOfPax_Inbound;

    this.chartData[2].flightData[1].value =
      res.crossStrait_Arrived.noOfFlight_Inbound;
    this.chartData[2].flightData[1].total =
      res.crossStrait_Predict.noOfFlight_Inbound;
    this.chartData[2].flightData[0].value =
      res.crossStrait_Arrived.noOfFlight_Outbound;
    this.chartData[2].flightData[0].total =
      res.crossStrait_Predict.noOfFlight_Outbound;

    // 3, 國內線
    this.chartData[3].passengerData[0].value =
      res.domestic_Arrived.noOfPax_Outbound;
    this.chartData[3].passengerData[0].total =
      res.domestic_Predict.noOfPax_Outbound;
    this.chartData[3].passengerData[1].value =
      res.domestic_Arrived.noOfPax_Inbound;
    this.chartData[3].passengerData[1].total =
      res.domestic_Predict.noOfPax_Inbound;

    this.chartData[3].flightData[1].value =
      res.domestic_Arrived.noOfFlight_Inbound;
    this.chartData[3].flightData[1].total =
      res.domestic_Predict.noOfFlight_Inbound;
    this.chartData[3].flightData[0].value =
      res.domestic_Arrived.noOfFlight_Outbound;
    this.chartData[3].flightData[0].total =
      res.domestic_Predict.noOfFlight_Outbound;

    // 4, 總數
    this.chartData[4].passengerData[0].value =
      res.crossStrait_Arrived.noOfPax_Outbound +
      res.intl_Arrived.noOfPax_Outbound +
      res.domestic_Arrived.noOfPax_Outbound;
    this.chartData[4].passengerData[0].total =
      res.crossStrait_Predict.noOfPax_Outbound +
      res.intl_Predict.noOfPax_Outbound +
      res.domestic_Predict.noOfPax_Outbound;
    this.chartData[4].passengerData[1].value =
      res.crossStrait_Arrived.noOfPax_Inbound +
      res.intl_Arrived.noOfPax_Inbound +
      res.domestic_Arrived.noOfPax_Inbound;
    this.chartData[4].passengerData[1].total =
      res.crossStrait_Predict.noOfPax_Inbound +
      res.intl_Predict.noOfPax_Inbound +
      res.domestic_Predict.noOfPax_Inbound;

    this.chartData[4].flightData[1].value =
      res.crossStrait_Arrived.noOfFlight_Inbound +
      res.intl_Arrived.noOfFlight_Inbound +
      res.domestic_Arrived.noOfFlight_Inbound;
    this.chartData[4].flightData[1].total =
      res.crossStrait_Predict.noOfFlight_Inbound +
      res.intl_Predict.noOfFlight_Inbound +
      res.domestic_Predict.noOfFlight_Inbound;
    this.chartData[4].flightData[0].value =
      res.crossStrait_Arrived.noOfFlight_Outbound +
      res.intl_Arrived.noOfFlight_Outbound +
      res.domestic_Arrived.noOfFlight_Outbound;
    this.chartData[4].flightData[0].total =
      res.crossStrait_Predict.noOfFlight_Outbound +
      res.intl_Predict.noOfFlight_Outbound +
      res.domestic_Predict.noOfFlight_Outbound;

    //設定60分鐘預測資料
    this.forecastInput = {
      intl_Predict60_noOfFlight_InBound: res.intl_Predict60.noOfFlight_Inbound,
      intl_Predict60_noOfFlight_OutBound:
        res.intl_Predict60.noOfFlight_Outbound,
      intl_Predict120_noOfFlight_InBound:
        res.intl_Predict120.noOfFlight_Inbound,
      intl_Predict120_noOfFlight_OutBound:
        res.intl_Predict120.noOfFlight_Outbound,
      intl_Predict60_noOfPax_InBound: res.intl_Predict60.noOfPax_Inbound,
      intl_Predict60_noOfPax_OutBound: res.intl_Predict60.noOfPax_Outbound,
      intl_Predict120_noOfPax_InBound: res.intl_Predict120.noOfPax_Inbound,
      intl_Predict120_noOfPax_OutBound: res.intl_Predict120.noOfPax_Outbound,
      crossStrait_Predict60_noOfFlight_InBound:
        res.crossStrait_Predict60.noOfFlight_Inbound,
      crossStrait_Predict60_noOfFlight_OutBound:
        res.crossStrait_Predict60.noOfFlight_Outbound,
      crossStrait_Predict120_noOfFlight_InBound:
        res.crossStrait_Predict120.noOfFlight_Inbound,
      crossStrait_Predict120_noOfFlight_OutBound:
        res.crossStrait_Predict120.noOfFlight_Outbound,
      crossStrait_Predict60_noOfPax_InBound:
        res.crossStrait_Predict60.noOfPax_Inbound,
      crossStrait_Predict60_noOfPax_OutBound:
        res.crossStrait_Predict60.noOfPax_Outbound,
      crossStrait_Predict120_noOfPax_InBound:
        res.crossStrait_Predict120.noOfPax_Inbound,
      crossStrait_Predict120_noOfPax_OutBound:
        res.crossStrait_Predict120.noOfPax_Outbound,
      domestic_Predict60_noOfFlight_InBound:
        res.domestic_Predict60.noOfFlight_Inbound,
      domestic_Predict60_noOfFlight_OutBound:
        res.domestic_Predict60.noOfFlight_Outbound,
      domestic_Predict30_noOfFlight_InBound:
        res.domestic_Predict30.noOfFlight_Inbound,
      domestic_Predict30_noOfFlight_OutBound:
        res.domestic_Predict30.noOfFlight_Outbound,
      domestic_Predict60_noOfPax_InBound:
        res.domestic_Predict60.noOfPax_Inbound,
      domestic_Predict60_noOfPax_OutBound:
        res.domestic_Predict60.noOfPax_Outbound,
      domestic_Predict30_noOfPax_InBound:
        res.domestic_Predict30.noOfPax_Inbound,
      domestic_Predict30_noOfPax_OutBound:
        res.domestic_Predict30.noOfPax_Outbound,
    };

    this.setTotalData();
  }

  setTotalData(): void {
    const res = this.res;
    // 設定總數顯示（依 activeIndex）
    switch (this.activeIndex) {
      case 1:
        // 國際線
        this.realFlight = res.intl_Arrived.noOfFlight_Total;
        this.predictFlight = res.intl_Predict.noOfFlight_Total;
        this.realPassenger = res.intl_Arrived.noOfPax_Total;
        this.predictPassenger = res.intl_Predict.noOfPax_Total;
        break;

      case 2:
        // 兩岸線
        this.realFlight = res.crossStrait_Arrived.noOfFlight_Total;
        this.predictFlight = res.crossStrait_Predict.noOfFlight_Total;
        this.realPassenger = res.crossStrait_Arrived.noOfPax_Total;
        this.predictPassenger = res.crossStrait_Predict.noOfPax_Total;
        break;

      case 3:
        // 國內線
        this.realFlight = res.domestic_Arrived.noOfFlight_Total;
        this.predictFlight = res.domestic_Predict.noOfFlight_Total;
        this.realPassenger = res.domestic_Arrived.noOfPax_Total;
        this.predictPassenger = res.domestic_Predict.noOfPax_Total;
        break;

      case 0:
        // 國際 + 兩岸
        this.realFlight =
          res.intl_Arrived.noOfFlight_Total +
          res.crossStrait_Arrived.noOfFlight_Total;

        this.predictFlight =
          res.intl_Predict.noOfFlight_Total +
          res.crossStrait_Predict.noOfFlight_Total;

        this.realPassenger =
          res.intl_Arrived.noOfPax_Total +
          res.crossStrait_Arrived.noOfPax_Total;

        this.predictPassenger =
          res.intl_Predict.noOfPax_Total +
          res.crossStrait_Predict.noOfPax_Total;
        break;

      case 4:
        // 國際 + 兩岸 + 國內（新規則）
        this.realFlight =
          res.intl_Arrived.noOfFlight_Total +
          res.crossStrait_Arrived.noOfFlight_Total +
          res.domestic_Arrived.noOfFlight_Total;

        this.predictFlight =
          res.intl_Predict.noOfFlight_Total +
          res.crossStrait_Predict.noOfFlight_Total +
          res.domestic_Predict.noOfFlight_Total;

        this.realPassenger =
          res.intl_Arrived.noOfPax_Total +
          res.crossStrait_Arrived.noOfPax_Total +
          res.domestic_Arrived.noOfPax_Total;

        this.predictPassenger =
          res.intl_Predict.noOfPax_Total +
          res.crossStrait_Predict.noOfPax_Total +
          res.domestic_Predict.noOfPax_Total;
        break;
    }
  }

  onTabChange(index: number) {
    this.activeIndex = index;
    this.setTotalData();
  }
}
