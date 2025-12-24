import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-realtime-passenger-vehicle',
  imports: [CommonModule, RouterModule],
  templateUrl: './realtime-passenger-vehicle.component.html',
  styleUrl: './realtime-passenger-vehicle.component.scss',
})
export class RealtimePassengerVehicleComponent {
  activeIndex: number = 0;
  data = [
    {
      label: '國際線',
      routerLink: '/realtime-passenger-vehicle/international',
    },
    {
      label: '國內線',
      routerLink: '/realtime-passenger-vehicle/domestic',
    },
    {
      label: '計程車',
      routerLink: '/realtime-passenger-vehicle/taxi',
    },
    {
      label: '國際線入境行李',
      routerLink: '/realtime-passenger-vehicle/baggage',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;

    const index = this.data.findIndex((item) =>
      currentUrl.startsWith(item.routerLink)
    );

    if (index !== -1) {
      this.activeIndex = index;
    }
  }
}
