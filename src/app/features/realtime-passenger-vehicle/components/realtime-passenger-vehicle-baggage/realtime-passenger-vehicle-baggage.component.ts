import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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
  items: FlightInfo[] = [
    {
      flight: 'CI223',
      from: '羽田',
      scheduledTime: '10:55',
      actualArrival: '10:54',
      flightArrival: '10:54',
      firstBaggage: '11:10',
      lastBaggage: '11:30',
      baggageDetails: [
        {
          subtitle: '第一件行李時間',
          downTime: '11:10',
          toCarousel: '11:20',
          onCarousel: '11:23',
          xrayIn: '11:25',
          xrayOut: '11:27',
        },
        {
          subtitle: '最後一件行李時間',
          downTime: '11:10',
          toCarousel: '11:20',
          onCarousel: '11:23',
          xrayIn: '11:25',
          xrayOut: '11:27',
        },
      ],
      isOpen: false,
    },
    {
      flight: 'CI224',
      from: '成田',
      scheduledTime: '11:20',
      actualArrival: '11:25',
      flightArrival: '11:25',
      firstBaggage: '11:40',
      lastBaggage: '12:05',
      baggageDetails: [
        {
          subtitle: '第一件行李時間',
          downTime: '11:40',
          toCarousel: '11:50',
          onCarousel: '11:53',
          xrayIn: '11:55',
          xrayOut: '11:57',
        },
        {
          subtitle: '最後一件行李時間',
          downTime: '11:40',
          toCarousel: '11:50',
          onCarousel: '11:53',
          xrayIn: '11:55',
          xrayOut: '11:57',
        },
      ],
      isOpen: false,
    },
    {
      flight: 'CI225',
      from: '香港',
      scheduledTime: '12:00',
      actualArrival: '12:05',
      flightArrival: '12:05',
      firstBaggage: '12:20',
      lastBaggage: '12:45',
      baggageDetails: [
        {
          subtitle: '第一件行李時間',
          downTime: '12:20',
          toCarousel: '12:30',
          onCarousel: '12:33',
          xrayIn: '12:35',
          xrayOut: '12:37',
        },
        {
          subtitle: '最後一件行李時間',
          downTime: '12:20',
          toCarousel: '12:30',
          onCarousel: '12:33',
          xrayIn: '12:35',
          xrayOut: '12:37',
        },
      ],
      isOpen: false,
    },
  ];

  toggle(item: FlightInfo) {
    item.isOpen = !item.isOpen;
  }
}
