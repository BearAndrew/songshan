import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DailyFixedRouteOperationsTableComponent } from './components/daily-fixed-route-operations-table/daily-fixed-route-operations-table.component';
import { PieChartComponent } from "../../shared/chart/pie-chart/pie-chart.component";

@Component({
  selector: 'app-daily-fixed-route-operations',
  imports: [CommonModule, DailyFixedRouteOperationsTableComponent, PieChartComponent],
  templateUrl: './daily-fixed-route-operations.component.html',
  styleUrl: './daily-fixed-route-operations.component.scss',
})
export class DailyFixedRouteOperationsComponent {
  /** 國際線 */
  foreignLineData = [
    { type: '航班數', out: 3, in: 5 },
    { type: '遊客數', out: 627, in: 556 },
  ];

  /** 兩岸航線 */
  crossStraitLineData = [
    { type: '航班數', out: 4, in: 5 },
    { type: '遊客數', out: 587, in: 512 },
  ];

  /** 國內線 */
  domesticLineData = [
    { type: '航班數', out: 3, in: 5 },
    { type: '遊客數', out: 627, in: 556 },
  ];
}
