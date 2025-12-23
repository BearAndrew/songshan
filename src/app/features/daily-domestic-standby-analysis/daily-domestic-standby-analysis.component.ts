import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlightRow } from '../../core/interface/daily-domestic-standby-analysis.interface';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api-service.service';
import { CommonService } from '../../core/services/common.service';
import { StandbySummaryItem } from '../../models/standby.model';

@Component({
  selector: 'app-daily-domestic-standby-analysis',
  imports: [CommonModule, RouterModule],
  templateUrl: './daily-domestic-standby-analysis.component.html',
  styleUrl: './daily-domestic-standby-analysis.component.scss',
})
export class DailyDomesticStandbyAnalysisComponent {
  tableData: FlightRow[] = [];

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
    this.tableData.forEach((group) => {
      group.maxWaitlist = Math.max(...group.details.map((d) => d.waitlist));
      group.maxNextFlights = Math.max(
        ...group.details.map((d) => d.nextFlights)
      );
      group.maxFlown = Math.max(...group.details.map((d) => d.flown));
      group.maxFilled = Math.max(...group.details.map((d) => d.filled));
    });
  }

  getStandbySummary(value: number) {
    const code = this.commonService.getAirportCodeById(value);
    this.apiService.getStandbySummary(code).subscribe((res) => {
      console.log('getStandbySummary', res);
      this.setTableData(res);
    });
  }

  setTableData(data: StandbySummaryItem[]) {
    data.forEach((item, index) => {
      this.tableData.push({
        route: item.destinationName,
        weather: {
          temperature: item.currWeather.temperature + '°C',
          description: item.currWeather.weatherStatus,
          visibility: item.currWeather.visibility,
          altitude: item.currWeather.cloudLevel,
          windSpeed: item.currWeather.windspeed,
        },
        details: [],
      });

      item.airlines.forEach(
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
  }
}
