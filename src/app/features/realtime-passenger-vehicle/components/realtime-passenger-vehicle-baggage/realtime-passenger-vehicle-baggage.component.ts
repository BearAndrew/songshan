import { ApiService } from './../../../../core/services/api-service.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaggageTimeItem } from '../../../../models/baggage-time.model';

interface FlightInfo {
  flight: string;
  from: string;
  scheduledTime: string;
  actualArrival: string;
  flightArrival: string;
  firstBaggage: string;
  lastBaggage: string;

  baggageDetails: {
    subtitle: string;
    downTime: string;
    toCarousel: string;
    onCarousel: string;
    xrayIn: string;
    xrayOut: string;
  }[];
  isOpen: boolean;
}

@Component({
  selector: 'app-realtime-passenger-vehicle-baggage',
  imports: [CommonModule],
  templateUrl: './realtime-passenger-vehicle-baggage.component.html',
  styleUrl: './realtime-passenger-vehicle-baggage.component.scss',
})
export class RealtimePassengerVehicleBaggageComponent {
  items: FlightInfo[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getBaggageTime().subscribe((res: BaggageTimeItem[]) => {
      this.items = res.map((b) => {
        const baggageDetails = [
          {
            subtitle: '第一件行李時間',
            downTime: b.firstBagDeplane,
            toCarousel: b.firstBagArriveCarousel,
            onCarousel: b.firstBagOnCarousel,
            xrayIn: b.firstBagInXray,
            xrayOut: b.firstBagOutXray,
          },
          {
            subtitle: '最後一件行李時間',
            downTime: b.lastBagDeplane,
            toCarousel: b.lastBagArriveCarousel,
            onCarousel: b.lastBagOnCarousel,
            xrayIn: b.lastBagInXray,
            xrayOut: b.lastBagOutXray,
          },
        ];

        const flightInfo: FlightInfo = {
          flight: b.flightNo,
          from: b.departurePort,
          scheduledTime: b.sta,
          actualArrival: b.ata,
          flightArrival: b.ibt,
          firstBaggage: b.firstBagOutXray,
          lastBaggage: b.lastBagOutXray,
          baggageDetails,
          isOpen: false,
        };

        return flightInfo;
      });
    });
  }

  toggle(item: FlightInfo) {
    item.isOpen = !item.isOpen;
  }
}
