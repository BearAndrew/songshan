import { Component } from '@angular/core';

@Component({
  selector: 'app-realtime-passenger-vehicle-domestic',
  imports: [],
  templateUrl: './realtime-passenger-vehicle-domestic.component.html',
  styleUrl: './realtime-passenger-vehicle-domestic.component.scss',
})
export class RealtimePassengerVehicleDomesticComponent {
  checkinData = [
    { people: 11, time: 1.7 },
    { people: 8, time: 2.3 },
    { people: 15, time: 0.9 },
    { people: 6, time: 3.1 },
    { people: 20, time: 1.2 },
    { people: 9, time: 2.0 },
  ];

  securityData = [
    { label: 'Fast track', people: 11, time: 1.7 },
    { label: '一般通道', people: 8, time: 2.3 },
    { label: '總計', people: 15, time: 0.9 },
  ];

  customsData = [{ people: 9, time: 2.0 }];

  departureData = [
    { label: '自動通關', people: 11, time: 1.7 },
    { label: '人工查驗', people: 8, time: 2.3 },
  ];

  arrivalData = [
    { label: '自動通關', people: 11, time: 1.7 },
    { label: '人工查驗', people: 8, time: 2.3 },
  ];
}
