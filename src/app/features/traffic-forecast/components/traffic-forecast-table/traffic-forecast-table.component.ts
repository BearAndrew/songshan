import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TrafficFlightRow } from '../../../../core/interface/traffic-forecast.interface';

@Component({
  selector: 'app-traffic-forecast-table',
  imports: [CommonModule],
  templateUrl: './traffic-forecast-table.component.html',
  styleUrl: './traffic-forecast-table.component.scss',
})
export class TrafficForecastTableComponent {
  @Input() title: string = '';
  @Input() table: TrafficFlightRow[] = [];
}
