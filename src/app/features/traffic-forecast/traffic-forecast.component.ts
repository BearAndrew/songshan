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
import { TabType } from '../../core/enums/tab-type.enum';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { Option } from '../../shared/components/dropdown/dropdown.component';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  interval,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-traffic-forecast',
  imports: [
    CommonModule,
    TrafficForecastTableComponent,
    BarLineChartComponent,
    DropdownComponent,
  ],
  templateUrl: './traffic-forecast.component.html',
  styleUrl: './traffic-forecast.component.scss',
})
export class TrafficForecastComponent {
  activeIndex: number = 0;
  data = [
    {
      label: '國際兩岸線',
      value: TabType.NONDOMESTIC,
    },
    {
      label: '國際線',
      value: TabType.INTL,
    },
    {
      label: '兩岸線',
      value: TabType.CROSSSTRAIT,
    },
    {
      label: '國內線',
      value: TabType.DOMESTIC,
    },
    {
      label: '總數',
      value: TabType.ALL,
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

  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
  ) {}

  ngOnInit() {
    // 監聽選擇的機場
    this.commonService
      .getSelectedAirport()
      .pipe(takeUntil(this.destroy$))
      .subscribe((airportId) => {
        if (airportId === '') return;
        this.airportId = airportId;
        this.refreshTrigger$.next(); // 立即觸發
      });

    // 30 秒輪詢 + refreshTrigger$ 觸發
    this.refreshTrigger$
      .pipe(
        startWith(0), // 預設立即執行一次
        switchMap(() =>
          interval(30000).pipe(
            startWith(0),
            switchMap(() => this.getData()),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getData(): Observable<FlightTrafficPredictResponse> {
    if (!this.airportId) return EMPTY;

    return this.apiService
      .getFlightTrafficPredict(
        this.airportId,
        this.dayData[this.dayActiveIndex].value,
        this.data[this.activeIndex].value,
      )
      .pipe(
        tap((res) => {
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
              data: (res.tomorrowStatByHour ?? []).map(
                (s: PredictStatByHour) => ({
                  key: s.hour,
                  value: s.numOfPax,
                }),
              ),
              colors: ['#00d6c8'],
            },
            {
              label: '後日預報人數',
              data: (res.twoDayStatByHour ?? []).map(
                (s: PredictStatByHour) => ({
                  key: s.hour,
                  value: s.numOfPax,
                }),
              ),
              colors: ['#fbb441'],
            },
          ];

          // --- Mapping lineData ---
          this.lineData = [
            {
              label: '明日預報架次',
              data: (res.tomorrowStatByHour ?? []).map(
                (s: PredictStatByHour) => ({
                  key: s.hour,
                  value: s.numOfFlight,
                }),
              ),
              colors: ['#00d6c8'],
            },
            {
              label: '後日預報架次',
              data: (res.twoDayStatByHour ?? []).map(
                (s: PredictStatByHour) => ({
                  key: s.hour,
                  value: s.numOfFlight,
                }),
              ),
              colors: ['#fbb441'],
            },
          ];

          this.tomorrowFlight = res.tomorrowFlight;
          this.twoDayFlight = res.twoDayFlight;
          this.tomorrowPax = res.tomorrowPax;
          this.twoDayPax = res.twoDayPax;
        }),
        catchError((err) => {
          console.error('[FlightTrafficPredict] error', err);
          return EMPTY;
        }),
      );
  }

  onTabClick(newIndex: number): void {
    this.activeIndex = newIndex;
    this.refreshTrigger$.next();
  }

  onDayTabClick(newIndex: number): void {
    this.dayActiveIndex = newIndex;
    this.refreshTrigger$.next();
  }
}
