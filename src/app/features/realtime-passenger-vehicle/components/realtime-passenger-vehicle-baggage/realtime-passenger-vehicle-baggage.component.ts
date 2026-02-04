import { ApiService } from './../../../../core/services/api-service.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaggageTimeItem } from '../../../../models/baggage-time.model';
import { mock } from './mock-data';

export interface FlightInfo {
  flight: string;
  from: string;
  scheduledTime: string;
  actualArrival: string;
  flightArrival: string;
  firstBaggage: string;
  lastBaggage: string;
  firstPax: string;
  lastPax: string;

  // 行李明細
  baggageDetails: {
    subtitle: string;
    downTime: string;
    toCarousel: string;
    onCarousel: string;
    xrayIn: string;
    xrayOut: string;
  }[];

  // 旅客明細（比照行李結構）
  paxDetails: {
    subtitle: string;
    gate: string;
    immigration: string;
    carousel: string;
    arrCustom: string;
    exitCustom: string;
    taxi: string;
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
      // res = mock;
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

        const paxDetails = [
          {
            subtitle: '第一位旅客',
            gate: b.paxFirstGate,
            immigration: b.paxFirstImmigration,
            carousel: b.paxFirstCarousel,
            arrCustom: b.paxFirstArrCustom,
            exitCustom: b.paxFirstExitCustom,
            taxi: b.paxFirstTaxi,
          },
          {
            subtitle: '最後一位旅客',
            gate: b.paxLastGate,
            immigration: b.paxLastImmigration,
            carousel: b.paxLastCarousel,
            arrCustom: b.paxLastArrCustom,
            exitCustom: b.paxLastExitCustom,
            taxi: b.paxLastTaxi,
          },
        ];

        return {
          flight: b.flightNo,
          from: b.departurePort,
          scheduledTime: b.sta,
          actualArrival: b.ata,
          flightArrival: b.ibt,
          firstBaggage: b.firstBagDeplane,
          lastBaggage: b.lastBagDeplane,
          firstPax: b.paxFirstExitCustom,
          lastPax: b.paxLastExitCustom,
          baggageDetails,
          paxDetails,
          isOpen: false,
        };
      });
    });
  }

  toggle(item: FlightInfo) {
    item.isOpen = !item.isOpen;
  }
}
