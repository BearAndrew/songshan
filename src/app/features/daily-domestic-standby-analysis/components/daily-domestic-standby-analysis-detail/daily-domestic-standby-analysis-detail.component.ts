import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-daily-domestic-standby-analysis-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './daily-domestic-standby-analysis-detail.component.html',
  styleUrl: './daily-domestic-standby-analysis-detail.component.scss',
})
export class DailyDomesticStandbyAnalysisDetailComponent {
  table = [
    {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      flightStatus: '已飛',
      waitlistCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      flightStatus: '延誤',
      waitlistCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      flightStatus: '已飛',
      waitlistCount: 2,
    },
        {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      flightStatus: '已飛',
      waitlistCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      flightStatus: '延誤',
      waitlistCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      flightStatus: '已飛',
      waitlistCount: 2,
    },
        {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      flightStatus: '已飛',
      waitlistCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      flightStatus: '延誤',
      waitlistCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      flightStatus: '已飛',
      waitlistCount: 2,
    },
        {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      flightStatus: '已飛',
      waitlistCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      flightStatus: '延誤',
      waitlistCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      flightStatus: '已飛',
      waitlistCount: 2,
    },
        {
      flightNumber: 'BR890',
      airline: '立榮',
      departureTime: '07:10',
      flightStatus: '已飛',
      waitlistCount: 5,
    },
    {
      flightNumber: 'CI752',
      airline: '華航',
      departureTime: '07:10',
      flightStatus: '延誤',
      waitlistCount: 3,
    },
    {
      flightNumber: 'AE582',
      airline: '立榮',
      departureTime: '07:10',
      flightStatus: '已飛',
      waitlistCount: 2,
    },
  ];
}
