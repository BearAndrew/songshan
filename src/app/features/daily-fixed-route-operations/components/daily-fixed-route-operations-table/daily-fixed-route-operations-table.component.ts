import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface DailyFixedRouteOperationsTableData {
  out: number;
  in: number;
}

@Component({
  selector: 'app-daily-fixed-route-operations-table',
  imports: [CommonModule],
  templateUrl: './daily-fixed-route-operations-table.component.html',
  styleUrl: './daily-fixed-route-operations-table.component.scss',
})
export class DailyFixedRouteOperationsTableComponent {
  @Input() header: string[] = ['出境', '入境', '總數'];
  @Input() data: DailyFixedRouteOperationsTableData[] = [];
  @Input() isShowSideHeader: boolean = false;
}
