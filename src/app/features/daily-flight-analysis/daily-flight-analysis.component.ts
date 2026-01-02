import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyFlightAnalysisFlightCardComponent } from './components/daily-flight-analysis-flight-card/daily-flight-analysis-flight-card.component';
import { DailyFlightAnalysisDelayCardComponent } from './components/daily-flight-analysis-delay-card/daily-flight-analysis-delay-card.component';
import { DailyFlightAnalysisDelayPieChartCardComponent } from './components/daily-flight-analysis-delay-pie-chart-card/daily-flight-analysis-delay-pie-chart-card.component';
import { DailyFlightAnalysisAbnormalCardComponent } from './components/daily-flight-analysis-abnormal-card/daily-flight-analysis-abnormal-card.component';
import {
  DailyFlightAnalysisAbnormalData,
  DailyFlightAnalysisData,
} from '../../core/interface/daily-flight-analysis.interface';
import { DailyFlightAnalysisBarlineChartCardComponent } from './components/daily-flight-analysis-barline-chart-card/daily-flight-analysis-barline-chart-card.component';
import { ApiService } from '../../core/services/api-service.service';
import { CommonService } from '../../core/services/common.service';
import { TodayDelayStat } from '../../models/today-delay-stat.model';
import { TodayPredict } from '../../models/today-predict.model';
import {
  DataSetWithData,
  DataSetWithDataArray,
} from '../../core/lib/chart-tool';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { Option } from '../../shared/components/dropdown/dropdown.component';
import { TabType } from '../../core/enums/tab-type.enum';

@Component({
  selector: 'app-daily-flight-analysis',
  imports: [
    CommonModule,
    DailyFlightAnalysisFlightCardComponent,
    DailyFlightAnalysisDelayCardComponent,
    DailyFlightAnalysisDelayPieChartCardComponent,
    DailyFlightAnalysisAbnormalCardComponent,
    DailyFlightAnalysisBarlineChartCardComponent,
    DropdownComponent,
  ],
  templateUrl: './daily-flight-analysis.component.html',
  styleUrl: './daily-flight-analysis.component.scss',
})
export class DailyFlightAnalysisComponent {
  activeIndex: number = 0;
  data: DailyFlightAnalysisData[] = [
    {
      label: '國際兩岸線',
      value: TabType.NONDOMESTIC,
      passengerData: [],
      flightData: [],
      delayData: {
        airline: {
          out: [],
          in: [],
        },
        airport: {
          out: [],
          in: [],
        },
      },
      abnormalData: {
        info: [],
        top3: [],
      },
    },

    {
      label: '國際線',
      value: TabType.INTL,
      passengerData: [],
      flightData: [],
      delayData: {
        airline: {
          out: [],
          in: [],
        },
        airport: {
          out: [],
          in: [],
        },
      },
      abnormalData: {
        info: [],
        top3: [],
      },
    },

    {
      label: '兩岸線',
      value: TabType.CROSSSTRAIT,
      passengerData: [],
      flightData: [],
      delayData: {
        airline: {
          out: [],
          in: [],
        },
        airport: {
          out: [],
          in: [],
        },
      },
      abnormalData: {
        info: [],
        top3: [],
      },
    },

    {
      label: '國內線',
      value: TabType.DOMESTIC,
      passengerData: [],
      flightData: [],
      delayData: {
        airline: {
          out: [],
          in: [],
        },
        airport: {
          out: [],
          in: [],
        },
      },
      abnormalData: {
        info: [],
        top3: [],
      },
    },

    {
      label: '總數',
      value: TabType.ALL,
      passengerData: [],
      flightData: [],
      delayData: {
        airline: {
          out: [],
          in: [],
        },
        airport: {
          out: [],
          in: [],
        },
      },
      abnormalData: {
        info: [],
        top3: [],
      },
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

  // 圓餅圖下方資訊
  pieCharData: {
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

  inboundData: DataSetWithData[] = [];

  /** 圓餅圖 */
  outboundData: DataSetWithData[] = [];

  // 長條圖
  inboundBarData: DataSetWithDataArray[] = [];
  inboundLineData: DataSetWithDataArray[] = [];

  outboundBarData: DataSetWithDataArray[] = [];
  outboundLineData: DataSetWithDataArray[] = [];

  abnormalInData: DailyFlightAnalysisAbnormalData = { info: [], top3: [] };
  abnormalOutData: DailyFlightAnalysisAbnormalData = { info: [], top3: [] };
  abnormalAllData: DailyFlightAnalysisAbnormalData = { info: [], top3: [] };

  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    //取得機場代碼
    this.commonService.getSelectedAirport().subscribe((airportId) => {
      // 根據選擇的機場ID執行相應的操作，例如重新載入資料
      if (airportId === -1) {
        this.getTodayPredict();
        return;
      }
      this.getTodayPredictByCode(airportId);
    });
    this.getTodayPredict();
    this.getTodayDelayStat();
  }

  /** 切換分頁重新呼叫 api */
  onTabChange(index: number) {
    this.activeIndex = index;
    this.getTodayDelayStat();
  }

  getTodayPredict() {
    this.apiService.getTodayPredict().subscribe((res) => {
      this.setPredictData(res);
    });
  }

  getTodayPredictByCode(value: number) {
    const code = this.commonService.getAirportCodeById(value);
    this.apiService.getTodayPredictByAirport(code).subscribe((res) => {
      this.setPredictData(res);
    });
  }

  getTodayDelayStat() {
    this.apiService
      .getTodayDelayStat(this.data[this.activeIndex].value)
      .subscribe((res) => {
        this.setDelayData(res);
      });
  }

  setPredictData(res: TodayPredict) {
    // 在這裡處理 API 回傳的資料
    //0, 國際兩岸線
    this.data[0].passengerData = [
      {
        label: '出境',
        value:
          res.intl_Arrived.noOfPax_Outbound +
          res.crossStrait_Arrived.noOfPax_Outbound,
        total:
          res.intl_Predict.noOfPax_Outbound +
          res.crossStrait_Predict.noOfPax_Outbound,
      },
      {
        label: '入境',
        value:
          res.intl_Arrived.noOfPax_Inbound +
          res.crossStrait_Arrived.noOfPax_Inbound,
        total:
          res.intl_Predict.noOfPax_Inbound +
          res.crossStrait_Predict.noOfPax_Inbound,
      },
      {
        label: '總數',
        value:
          res.intl_Arrived.noOfPax_Total +
          res.crossStrait_Arrived.noOfPax_Total,
        total:
          res.intl_Predict.noOfPax_Total +
          res.crossStrait_Predict.noOfPax_Total,
      },
    ];
    this.data[0].flightData = [
      {
        label: '到站',
        value:
          res.intl_Arrived.noOfFlight_Inbound +
          res.crossStrait_Arrived.noOfFlight_Inbound,
        total:
          res.intl_Predict.noOfFlight_Inbound +
          res.crossStrait_Predict.noOfFlight_Inbound,
      },
      {
        label: '離站',
        value:
          res.intl_Arrived.noOfFlight_Outbound +
          res.crossStrait_Arrived.noOfFlight_Outbound,
        total:
          res.intl_Predict.noOfFlight_Outbound +
          res.crossStrait_Predict.noOfFlight_Outbound,
      },
      {
        label: '總數',
        value:
          res.intl_Arrived.noOfFlight_Total +
          res.crossStrait_Arrived.noOfFlight_Total,
        total:
          res.intl_Predict.noOfFlight_Total +
          res.crossStrait_Predict.noOfFlight_Total,
      },
    ];

    //1, 國際線
    this.data[1].passengerData = [
      {
        label: '出境',
        value: res.intl_Arrived.noOfPax_Outbound,
        total: res.intl_Predict.noOfPax_Outbound,
      },
      {
        label: '入境',
        value: res.intl_Arrived.noOfPax_Inbound,
        total: res.intl_Predict.noOfPax_Inbound,
      },
      {
        label: '總數',
        value: res.intl_Arrived.noOfPax_Total,
        total: res.intl_Predict.noOfPax_Total,
      },
    ];
    this.data[1].flightData = [
      {
        label: '到站',
        value: res.intl_Arrived.noOfFlight_Inbound,
        total: res.intl_Predict.noOfFlight_Inbound,
      },
      {
        label: '離站',
        value: res.intl_Arrived.noOfFlight_Outbound,
        total: res.intl_Predict.noOfFlight_Outbound,
      },
      {
        label: '總數',
        value: res.intl_Arrived.noOfFlight_Total,
        total: res.intl_Predict.noOfFlight_Total,
      },
    ];

    //2, 兩岸線
    this.data[2].passengerData = [
      {
        label: '出境',
        value: res.crossStrait_Arrived.noOfPax_Outbound,
        total: res.crossStrait_Predict.noOfPax_Outbound,
      },
      {
        label: '入境',
        value: res.crossStrait_Arrived.noOfPax_Inbound,
        total: res.crossStrait_Predict.noOfPax_Inbound,
      },
      {
        label: '總數',
        value: res.crossStrait_Arrived.noOfPax_Total,
        total: res.crossStrait_Predict.noOfPax_Total,
      },
    ];
    this.data[2].flightData = [
      {
        label: '到站',
        value: res.crossStrait_Arrived.noOfFlight_Inbound,
        total: res.crossStrait_Predict.noOfFlight_Inbound,
      },
      {
        label: '離站',
        value: res.crossStrait_Arrived.noOfFlight_Outbound,
        total: res.crossStrait_Predict.noOfFlight_Outbound,
      },
      {
        label: '總數',
        value: res.crossStrait_Arrived.noOfFlight_Total,
        total: res.crossStrait_Predict.noOfFlight_Total,
      },
    ];

    //3, 國內線
    this.data[3].passengerData = [
      {
        label: '出境',
        value: res.domestic_Arrived.noOfPax_Outbound,
        total: res.domestic_Predict.noOfPax_Outbound,
      },
      {
        label: '入境',
        value: res.domestic_Arrived.noOfPax_Inbound,
        total: res.domestic_Predict.noOfPax_Inbound,
      },
      {
        label: '總數',
        value: res.domestic_Arrived.noOfPax_Total,
        total: res.domestic_Predict.noOfPax_Total,
      },
    ];
    this.data[3].flightData = [
      {
        label: '到站',
        value: res.domestic_Arrived.noOfFlight_Inbound,
        total: res.domestic_Predict.noOfFlight_Inbound,
      },
      {
        label: '離站',
        value: res.domestic_Arrived.noOfFlight_Outbound,
        total: res.domestic_Predict.noOfFlight_Outbound,
      },
      {
        label: '總數',
        value: res.domestic_Arrived.noOfFlight_Total,
        total: res.domestic_Predict.noOfFlight_Total,
      },
    ];

    //4, 總數
    this.data[4].passengerData = [
      {
        label: '出境',
        value:
          res.domestic_Arrived.noOfPax_Outbound +
          res.intl_Arrived.noOfPax_Outbound +
          res.crossStrait_Arrived.noOfPax_Outbound,
        total:
          res.domestic_Predict.noOfPax_Outbound +
          res.intl_Predict.noOfPax_Outbound +
          res.crossStrait_Predict.noOfPax_Outbound,
      },
      {
        label: '入境',
        value:
          res.domestic_Arrived.noOfPax_Inbound +
          res.intl_Arrived.noOfPax_Inbound +
          res.crossStrait_Arrived.noOfPax_Inbound,
        total:
          res.domestic_Predict.noOfPax_Inbound +
          res.intl_Predict.noOfPax_Inbound +
          res.crossStrait_Predict.noOfPax_Inbound,
      },
      {
        label: '總數',
        value:
          res.domestic_Arrived.noOfPax_Total +
          res.intl_Arrived.noOfPax_Total +
          res.crossStrait_Arrived.noOfPax_Total,
        total:
          res.domestic_Predict.noOfPax_Total +
          res.intl_Predict.noOfPax_Total +
          res.crossStrait_Predict.noOfPax_Total,
      },
    ];
    this.data[4].flightData = [
      {
        label: '到站',
        value:
          res.domestic_Arrived.noOfFlight_Inbound +
          res.intl_Arrived.noOfFlight_Inbound +
          res.crossStrait_Arrived.noOfFlight_Inbound,
        total:
          res.domestic_Predict.noOfFlight_Inbound +
          res.intl_Predict.noOfFlight_Inbound +
          res.crossStrait_Predict.noOfFlight_Inbound,
      },
      {
        label: '離站',
        value:
          res.domestic_Arrived.noOfFlight_Outbound +
          res.intl_Arrived.noOfFlight_Outbound +
          res.crossStrait_Arrived.noOfFlight_Outbound,
        total:
          res.domestic_Predict.noOfFlight_Outbound +
          res.intl_Predict.noOfFlight_Outbound +
          res.crossStrait_Predict.noOfFlight_Outbound,
      },
      {
        label: '總數',
        value:
          res.domestic_Arrived.noOfFlight_Total +
          res.intl_Arrived.noOfFlight_Total +
          res.crossStrait_Arrived.noOfFlight_Total,
        total:
          res.domestic_Predict.noOfFlight_Total +
          res.intl_Predict.noOfFlight_Total +
          res.crossStrait_Predict.noOfFlight_Total,
      },
    ];
  }

  setDelayData(res: TodayDelayStat) {
    // delayData
    // 不分線，只分出入境,
    this.clearDelayData();
    // ===== Inbound Airline Delay =====
    res.inDelayAirlines.forEach((item) => {
      if (!item) {
        return;
      }

      for (let i = 0; i < 5; i++) {
        this.data[i].delayData.airline.in.push({
          flightCode: item.iata,
          flightCount: item.numOfFlight,
          passengerCount: item.numOfPax,
          delayTime: item.avgDelay,
        });
      }
    });

    // ===== Outbound Airline Delay =====
    res.outDelayAirlines.forEach((item) => {
      if (!item) {
        return;
      }

      for (let i = 0; i < 5; i++) {
        this.data[i].delayData.airline.out.push({
          flightCode: item.iata,
          flightCount: item.numOfFlight,
          passengerCount: item.numOfPax,
          delayTime: item.avgDelay,
        });
      }
    });

    // ===== Inbound Airport Delay =====
    res.inDelayAirport.forEach((item) => {
      if (!item) {
        return;
      }

      for (let i = 0; i < 5; i++) {
        this.data[i].delayData.airport.in.push({
          flightCode: item.iata,
          flightCount: item.numOfFlight,
          passengerCount: item.numOfPax,
          delayTime: item.avgDelay,
        });
      }
    });

    // ===== Outbound Airport Delay =====
    res.outDelayAirport.forEach((item) => {
      if (!item) {
        return;
      }

      for (let i = 0; i < 5; i++) {
        this.data[i].delayData.airport.out.push({
          flightCode: item.iata,
          flightCount: item.numOfFlight,
          passengerCount: item.numOfPax,
          delayTime: item.avgDelay,
        });
      }
    });

    // abnormalData: 0出境、1入境、2出入境
    res.outDelayFlights.forEach((item) => {
      if (item === null) {
        return;
      }

      this.abnormalOutData.info.push({
        flightNumber: item.flightNo,
        destination: item.airportName,
        scheduledTime: item.schTime,
        affectedPeople: +item.pax,
        status: item.reason,
      });
    });
    res.inDelayFlights.forEach((item) => {
      if (item === null) {
        return;
      }

      this.abnormalInData.info.push({
        flightNumber: item.flightNo,
        destination: item.airportName,
        scheduledTime: item.schTime,
        affectedPeople: +item.pax,
        status: item.reason,
      });
    });

    res.allDelayFlights.forEach((item) => {
      if (item === null) {
        return;
      }

      this.abnormalAllData.info.push({
        flightNumber: item.flightNo,
        destination: item.airportName,
        scheduledTime: item.schTime,
        affectedPeople: +item.pax,
        status: item.reason,
      });
    });


    res.outTop3Airport?.forEach((item) => {
      if (item === null) {
        return;
      }

      this.abnormalOutData.top3.push({
        city: item.name_zhTW,
        airport: item.iata,
        forecast: {
          flightCount: item.estimateFlight,
          passengerCount: item.estimatePax,
        },
        actual: {
          flightCount: item.actualFlight,
          passengerCount: item.actualPax,
        },
      });
    });

    res.inTop3Airport?.forEach((item) => {
      if (item === null) {
        return;
      }

      this.abnormalInData.top3.push({
        city: item.name_zhTW,
        airport: item.iata,
        forecast: {
          flightCount: item.estimateFlight,
          passengerCount: item.estimatePax,
        },
        actual: {
          flightCount: item.actualFlight,
          passengerCount: item.actualPax,
        },
      });
    });

    res.allTop3Airport.forEach((item) => {
      if (item === null) {
        return;
      }

      this.abnormalAllData.top3.push({
        city: item.name_zhTW,
        airport: item.iata,
        forecast: {
          flightCount: item.estimateFlight,
          passengerCount: item.estimatePax,
        },
        actual: {
          flightCount: item.actualFlight,
          passengerCount: item.actualPax,
        },
      });
    });

    //圓餅圖
    this.inboundData = [
      {
        label: '0~30m',
        data: { value: res.delayStat.inBound0 },
        colors: ['#00c4ce'],
        // unitText: '%',
      },
      {
        label: '30~60m',
        data: { value: res.delayStat.inBound30 },
        colors: ['#a4dd46'],
        // unitText: '%',
      },
      {
        label: '60m',
        data: { value: res.delayStat.inBound60 },
        colors: ['#ceedfe'],
        // unitText: '%',
      },
    ];

    /** 圓餅圖 */
    this.outboundData = [
      {
        label: '0~30m',
        data: { value: res.delayStat.outBound0 },
        colors: ['#00c4ce'],
        // unitText: '%',
      },
      {
        label: '30~60m',
        data: { value: res.delayStat.outBound30 },
        colors: ['#a4dd46'],
        // unitText: '%',
      },
      {
        label: '60m',
        data: { value: res.delayStat.outBound60 },
        colors: ['#ceedfe'],
        // unitText: '%',
      },
    ];

    this.pieCharData.inFlight = res.delayStat.inBoundFlights;
    this.pieCharData.inPax = res.delayStat.inBoundPax;
    this.pieCharData.inTime = res.delayStat.inBoundAvg;
    this.pieCharData.outFlight = res.delayStat.outBoundFlights;
    this.pieCharData.outPax = res.delayStat.outBoundPax;
    this.pieCharData.outTime = res.delayStat.outBoundAvg;

    // 長條圖
    this.inboundBarData = [
      {
        label: '入境實際人數',
        data: res.inBoundStatByHour.map((item) => ({
          key: item.hour,
          value: item.numOfPax,
        })),
        colors: ['#00d6c8'],
      },
      {
        label: '入境預報人數',
        data: res.inBoundPredictByHour.map((item) => ({
          key: item.hour,
          value: item.numOfPax,
        })),
        colors: ['#0279ce'],
      },
    ];

    // 折線圖
    this.inboundLineData = [
      {
        label: '入境實際架次',
        data: res.inBoundStatByHour.map((item) => ({
          key: item.hour,
          value: item.numOfFlight,
        })),
        colors: ['#00d6c8'],
      },
      {
        label: '入境預報架次',
        data: res.inBoundPredictByHour.map((item) => ({
          key: item.hour,
          value: item.numOfFlight,
        })),
        colors: ['#0279ce'],
      },
    ];

    // 長條圖
    this.outboundBarData = [
      {
        label: '出境實際人數',
        data: res.outBoundStatByHour.map((item) => ({
          key: item.hour,
          value: item.numOfPax,
        })),
        colors: ['#00d6c8'],
      },
      {
        label: '出境預報人數',
        data: res.outBoundPredictByHour.map((item) => ({
          key: item.hour,
          value: item.numOfPax,
        })),
        colors: ['#0279ce'],
      },
    ];

    // 折線圖
    this.outboundLineData = [
      {
        label: '出境實際架次',
        data: res.outBoundStatByHour.map((item) => ({
          key: item.hour,
          value: item.numOfFlight,
        })),
        colors: ['#00d6c8'],
      },
      {
        label: '出境預報架次',
        data: res.outBoundPredictByHour.map((item) => ({
          key: item.hour,
          value: item.numOfFlight,
        })),
        colors: ['#0279ce'],
      },
    ];
  }

  clearDelayData() {
    for (let i = 0; i < 5; i++) {
      this.data[i].delayData.airline.in = [];
      this.data[i].delayData.airline.out = [];
      this.data[i].delayData.airport.in = [];
      this.data[i].delayData.airport.out = [];
      this.data[i].abnormalData.info = [];
      this.data[i].abnormalData.top3 = [];
      this.abnormalAllData.info = [];
      this.abnormalAllData.top3 = [];
      this.abnormalInData.info = [];
      this.abnormalInData.top3 = [];
      this.abnormalOutData.info = [];
      this.abnormalOutData.top3 = [];
    }
  }
}
