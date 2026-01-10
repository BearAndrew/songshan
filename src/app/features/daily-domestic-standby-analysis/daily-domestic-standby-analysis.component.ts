import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlightRow } from '../../core/interface/daily-domestic-standby-analysis.interface';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api-service.service';
import { CommonService } from '../../core/services/common.service';
import {
  StandbyAirlineSummary,
  StandbySummaryItem,
} from '../../models/standby.model';

@Component({
  selector: 'app-daily-domestic-standby-analysis',
  imports: [CommonModule, RouterModule],
  templateUrl: './daily-domestic-standby-analysis.component.html',
  styleUrl: './daily-domestic-standby-analysis.component.scss',
})
export class DailyDomesticStandbyAnalysisComponent {
  tableData: FlightRow[] = [];
  MOCK_STANDBY_SUMMARY: StandbySummaryItem[] = [
    {
      destinationName: '東京成田',
      currWeather: {
        iata: 'NRT',
        temperature: '18°C',
        weatherStatus: '多雲',
        visibility: '10 公里',
        cloudLevel: '低雲',
        windspeed: '每小時 12 公里',
      },
      airlines: [
        {
          airlineIATA: '',
          airlineName: '',
          standby_Reg: 25,
          standby_FlightRemain: 5,
          pax_Departed: 210,
          standby_OK: 14,
        },
        {
          airlineIATA: 'JL',
          airlineName: '日本航空',
          standby_Reg: 25,
          standby_FlightRemain: 5,
          pax_Departed: 120,
          standby_OK: 8,
        },
        {
          airlineIATA: 'BR',
          airlineName: '長榮航空',
          standby_Reg: 0,
          standby_FlightRemain: 0,
          pax_Departed: 90,
          standby_OK: 6,
        },
      ],
      totalStandbyReg: 25,
      currStandby: 18,
      total_FlightRemain: 8,
      total_PaxDeparted: 210,
      total_StandbyOK: 14,
    },
    {
      destinationName: '大阪關西',
      currWeather: {
        iata: 'KIX',
        temperature: '22°C',
        weatherStatus: '晴朗',
        visibility: '12 公里',
        cloudLevel: '無雲',
        windspeed: '每小時 8 公里',
      },
      airlines: [
        {
          airlineIATA: 'CI',
          airlineName: '中華航空',
          standby_Reg: 20,
          standby_FlightRemain: 6,
          pax_Departed: 150,
          standby_OK: 12,
        },
      ],
      totalStandbyReg: 20,
      currStandby: 12,
      total_FlightRemain: 6,
      total_PaxDeparted: 150,
      total_StandbyOK: 12,
    },
  ];

  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    if (this.commonService.realAirportValue !== -1) {
      this.getStandbySummary(this.commonService.realAirportValue);
    }
    //預設取得不分機場總數
    this.commonService.getSelectedAirport().subscribe((airportId) => {
      // 根據選擇的機場ID執行相應的操作，例如重新載入資料
      if (airportId === -1) {
        return;
      }
      this.getStandbySummary(airportId);
    });
  }

  ngOnInit(): void {
    // this.getStandbySummary(0);
  }

  getStandbySummary(value: number) {
    const code = this.commonService.getAirportCodeById(value);

    // console.log(this.MOCK_STANDBY_SUMMARY);
    // this.setTableData(this.MOCK_STANDBY_SUMMARY);
    // return;
    this.apiService.getStandbySummary(code).subscribe({
      next: (res) => {
        this.setTableData(res);
      }
    });
  }

  setTableData(data: StandbySummaryItem[]) {
    this.tableData = [];
    data.forEach((item, index) => {
      const rawTemp = item.currWeather.temperature;
      const tempValue = Number(String(rawTemp).match(/-?\d+/)?.[0] ?? 0);
      this.tableData.push({
        route: item.destinationName,
        weather: {
          temperature: tempValue + '°C',
          description: item.currWeather.weatherStatus,
          visibility: item.currWeather.visibility,
          altitude: item.currWeather.cloudLevel,
          windSpeed: item.currWeather.windspeed,
        },
        details: [],
        routerParam: item.currWeather.iata,
      });

      const airlines = [...item.airlines].slice(0, 3);

      const emptyDetail: StandbyAirlineSummary = {
        airlineIATA: '',
        airlineName: '',
        standby_Reg: '\u00A0',
        standby_FlightRemain: '\u00A0',
        pax_Departed: '\u00A0',
        standby_OK: '\u00A0',
      };
      while (airlines.length < 3) {
        airlines.push(emptyDetail);
      }

      airlines.forEach(
        (detail: {
          airlineName: any;
          standby_Reg: any;
          standby_FlightRemain: any;
          pax_Departed: any;
          standby_OK: any;
        }) => {
          this.tableData[index].details.push({
            airline: detail.airlineName,
            waitlist: detail.standby_Reg,
            onsite: item.currStandby,
            nextFlights: detail.standby_FlightRemain,
            flown: detail.pax_Departed,
            filled: detail.standby_OK,
          });
        }
      );
    });

    // 計算最大值
    this.tableData.forEach((group) => {
      group.maxWaitlist = Math.max(...group.details.map((d) => d.waitlist));
      group.maxNextFlights = Math.max(
        ...group.details.map((d) => d.nextFlights)
      );
      group.maxFlown = Math.max(...group.details.map((d) => d.flown));
      group.maxFilled = Math.max(...group.details.map((d) => d.filled));
    });
  }
}
