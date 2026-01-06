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

  mockStandbyList: StandbyListItem[] = [
    {
      flightNo: 'CI123',
      airlineName: '中華航空',
      departureTime: '08:30',
      status: 'On Time',
      standbyOK: 5,
    },
    {
      flightNo: 'BR456',
      airlineName: '長榮航空',
      departureTime: '10:15',
      status: 'Delayed',
      standbyOK: 2,
    },
    {
      flightNo: 'JX789',
      airlineName: '星宇航空',
      departureTime: '13:45',
      status: 'Boarding',
      standbyOK: 0,
    },
    {
      flightNo: 'CI888',
      airlineName: '中華航空',
      departureTime: '16:20',
      status: 'Cancelled',
      standbyOK: 10,
    },
  ];

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    const mockData: StandbyListItem[] = this.mockStandbyList;
    this.setTableData(mockData);
    return;
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
