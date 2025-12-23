import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api-service.service';
import { CommonService } from '../../../../core/services/common.service';
import { StandbyListItem } from '../../../../models/standby.model';

@Component({
  selector: 'app-daily-domestic-standby-analysis-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './daily-domestic-standby-analysis-detail.component.html',
  styleUrl: './daily-domestic-standby-analysis-detail.component.scss',
})
export class DailyDomesticStandbyAnalysisDetailComponent {
  table: { flightNumber: string; airline: string; departureTime: string; flightStatus: string; waitlistCount: number; }[] = [
  ];

  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    if (this.commonService.realAirportValue !== -1) {
      this.getStandbyList(this.commonService.realAirportValue);
    }
    //預設取得不分機場總數
    this.commonService.getSelectedAirport().subscribe((airportId) => {
      // 根據選擇的機場ID執行相應的操作，例如重新載入資料
      if (airportId === -1) {
        return;
      }
      this.getStandbyList(airportId);
    });
  }

  getStandbyList(value: number) {
    const code = this.commonService.getAirportCodeById(value);
    this.apiService.getStandbyList(code).subscribe((res) => {
      this.setTableData(res);
    });
  }

  setTableData(data: StandbyListItem[]) {
    // Implement your logic to set the table data
    data.forEach((item: StandbyListItem, index: number) => {
      this.table.push({
        flightNumber: item.flightNo,
        airline: item.airlineName,
        departureTime: item.departureTime,
        flightStatus: item.status,
        waitlistCount: item.standbyOK,
      });
    });
  }
}
