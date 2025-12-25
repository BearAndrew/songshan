import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DailyFixedRouteOperationsTableComponent } from './components/daily-fixed-route-operations-table/daily-fixed-route-operations-table.component';
import { PieChartComponent } from '../../shared/chart/pie-chart/pie-chart.component';
import { DataSetWithData } from '../../core/lib/chart-tool';
import { ApiService } from '../../core/services/api-service.service';
import { CommonService } from '../../core/services/common.service';
import { TodayStatus } from '../../models/today-status.model';

interface DailyFixedRouteOperationData {
  type: string;
  out: number;
  in: number;
}

@Component({
  selector: 'app-daily-fixed-route-operations',
  imports: [
    CommonModule,
    DailyFixedRouteOperationsTableComponent,
    PieChartComponent,
  ],
  templateUrl: './daily-fixed-route-operations.component.html',
  styleUrl: './daily-fixed-route-operations.component.scss',
})
export class DailyFixedRouteOperationsComponent {
  /** 國際線 */
  foreignLineData: DailyFixedRouteOperationData[] = [];

  /** 兩岸航線 */
  crossStraitLineData: DailyFixedRouteOperationData[] = [];

  /** 國內線 */
  domesticLineData: DailyFixedRouteOperationData[] = [];

  /** 圓餅圖 */
  flightData: DataSetWithData[] = [
    {
      label: '國內線',
      data: { value: 17 },
      colors: ['#fdde8d'],
    },
    {
      label: '國際兩岸線',
      data: { value: 23 },
      colors: ['#989898'],
    },
  ];

  /** 圓餅圖 */
  passengerData: DataSetWithData[] = [
    {
      label: '國內線',
      data: { value: 21 },
      colors: ['#aa7946'],
    },
    {
      label: '國際兩岸線',
      data: { value: 39 },
      colors: ['#989898'],
    },
  ];

  flightTotal: number = 0;
  passengerTotal: number = 0;

  constructor(private apiService: ApiService, private commonService: CommonService) {
    //預設取得不分機場總數
    this.getTodayStatus();

    this.commonService.getSelectedAirport().subscribe(airportId => {
      // 根據選擇的機場ID執行相應的操作，例如重新載入資料
      if (airportId === -1) {
        this.getTodayStatus();
        return;
      }
      this.getTodayStatusByCode(airportId);
    });
  }

   getTodayStatus() {
    this.apiService.getTodayStatus().subscribe(res => {
      this.setData(res);
    });
  }

  getTodayStatusByCode(value:number) {
    const code = this.commonService.getAirportCodeById(value);
    this.apiService.getTodayStatusByAirport(code).subscribe(res => {
      this.setData(res);
    });
  }

  setData(res: TodayStatus) {
    // 在這裡處理 API 回傳的資料
    // 圓餅圖資料設定
    this.flightData[0].data.value = res.domestic.noOfFlight_Total;
    this.flightData[1].data.value = res.crossStrait.noOfFlight_Total;

    this.flightTotal = res.totalFlight_Total;
    this.passengerTotal = res.totalPax_Total;

    this.passengerData[0].data.value = res.domestic.noOfPax_Total;
    this.passengerData[1].data.value = res.crossStrait.noOfPax_Total;

    //foreignLineData
    this.foreignLineData = [
      { type: '航班數', out: res.intl.noOfFlight_Outbound, in: res.intl.noOfFlight_Inbound },
      { type: '遊客數', out: res.intl.noOfPax_Outbound, in: res.intl.noOfPax_Inbound },
    ];

    //crossStraitLineData
    this.crossStraitLineData = [
      { type: '航班數', out: res.crossStrait.noOfFlight_Outbound, in: res.crossStrait.noOfFlight_Inbound },
      { type: '遊客數', out: res.crossStrait.noOfPax_Outbound, in: res.crossStrait.noOfPax_Inbound },
    ];

    //domesticLineData
    this.domesticLineData = [
      { type: '航班數', out: res.domestic.noOfFlight_Outbound, in: res.domestic.noOfFlight_Inbound },
      { type: '遊客數', out: res.domestic.noOfPax_Outbound, in: res.domestic.noOfPax_Inbound },
    ];
  }
}
