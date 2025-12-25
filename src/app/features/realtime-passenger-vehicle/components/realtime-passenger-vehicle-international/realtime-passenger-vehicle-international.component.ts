import { Subject, takeUntil } from 'rxjs';
import {
  RealTimeTrafficFlowItem,
  RealTimeTrafficPoint,
} from '../../../../models/real-time-traffic-flow.model';
import { RealTimeService } from './../../services/real-time.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-realtime-passenger-vehicle-international',
  imports: [],
  templateUrl: './realtime-passenger-vehicle-international.component.html',
  styleUrl: './realtime-passenger-vehicle-international.component.scss',
})
export class RealtimePassengerVehicleInternationalComponent {
  checkinData = [
    { label: '1', people: 11, time: 1.7 },
    { label: '1', people: 8, time: 2.3 },
    { label: '1', people: 15, time: 0.9 },
    { label: '1', people: 6, time: 3.1 },
    { label: '1', people: 20, time: 1.2 },
    { label: '1', people: 9, time: 2.0 },
  ];

  securityData = [
    { label: 'Fast track', people: 11, time: 1.7 },
    { label: '一般通道', people: 8, time: 2.3 },
    { label: '總計', people: 15, time: 0.9 },
  ];

  customsData = [{ label: '1', people: 9, time: 2.0 }];

  departureData = [
    { label: '自動通關', people: 11, time: 1.7 },
    { label: '人工查驗', people: 8, time: 2.3 },
  ];

  arrivalData = [
    { label: '自動通關', people: 11, time: 1.7 },
    { label: '人工查驗', people: 8, time: 2.3 },
  ];

  private destroy$ = new Subject<void>();

  constructor(private realTimeService: RealTimeService) {}

  ngOnInit(): void {
    this.realTimeService.realTimeData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (!data || !data.length) return;
        this.mapRealTimeToViewData(data);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private mapPoints(points: RealTimeTrafficPoint[]) {
    return points.map((p) => ({
      label: p.label,
      people: p.population,
      time: p.waitTime,
    }));
  }

  private mapRealTimeToViewData(items: RealTimeTrafficFlowItem[]) {
    const safe = (i: number) => items[i]?.data ?? [];

    this.checkinData = this.mapPoints(safe(0));
    this.securityData = this.mapPoints(safe(1));
    this.customsData = this.mapPoints(safe(2));
    this.departureData = this.mapPoints(safe(3));
    this.arrivalData = this.mapPoints(safe(4));
  }

  onItemClick(locationIndex: number, itemIndex: number) {
    this.realTimeService.emitEvent({
      type: 'IMAGE_SELECT',
      payload: {
        locationIndex,
        imageIndex: itemIndex,
      },
    });
  }
}
