import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api-service.service';
import { StandbyListItem } from '../../../../models/standby.model';

@Component({
  selector: 'app-daily-domestic-standby-analysis-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './daily-domestic-standby-analysis-detail.component.html',
  styleUrl: './daily-domestic-standby-analysis-detail.component.scss',
})
export class DailyDomesticStandbyAnalysisDetailComponent {
  table: {
    flightNumber: string;
    airline: string;
    departureTime: string;
    flightStatus: string;
    waitlistCount: number;
  }[] = [];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    // 直接訂閱 queryParams
    this.route.queryParams.subscribe((params) => {
      const iata = params['iata']; // 從 URL ?iata=XXX 取得
      if (iata) {
        this.getStandbyList(iata);
      }
    });
  }

  getStandbyList(code: string) {
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
