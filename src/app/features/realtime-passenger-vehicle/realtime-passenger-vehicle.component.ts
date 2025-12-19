import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

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
      routerLink: '/realtime-passenger-vehicle/international'
    },
    {
      label: '國內線',
      routerLink: '/realtime-passenger-vehicle/domestic'
    },
    {
      label: '計程車',
      routerLink: '/realtime-passenger-vehicle/taxi'
    },
  ];
}
