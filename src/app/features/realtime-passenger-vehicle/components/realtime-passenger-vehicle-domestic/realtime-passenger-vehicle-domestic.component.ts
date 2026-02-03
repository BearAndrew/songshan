import { Component } from '@angular/core';
import { RealTimeTrafficFlowItem, RealTimeTrafficPoint } from '../../../../models/real-time-traffic-flow.model';
import { Subject, takeUntil } from 'rxjs';
import { RealTimeService } from '../../services/real-time.service';
import { TaxiData } from '../../realtime-passenger-vehicle.component';
import { CommonService } from '../../../../core/services/common.service';
import { CameraDialogComponent } from '../camera-dialog/camera-dialog.component';

@Component({
  selector: 'app-realtime-passenger-vehicle-domestic',
  imports: [],
  templateUrl: './realtime-passenger-vehicle-domestic.component.html',
  styleUrl: './realtime-passenger-vehicle-domestic.component.scss',
})
export class RealtimePassengerVehicleDomesticComponent {
  data1: TaxiData[] = [];

  data2: TaxiData[] = [];

  data3: TaxiData[] = [];

  private destroy$ = new Subject<void>();

  constructor(private realTimeService: RealTimeService, private commonService: CommonService) {}

  ngOnInit(): void {
    this.realTimeService.realTimeData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        if (!items || items.length < 3) return;
        this.mapRealTimeToViewData(items);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private mapRealTimeToViewData(items: RealTimeTrafficFlowItem[]) {
    const safe = (i: number) => items[i]?.data ?? [];

    this.data1 = this.mapPoints(safe(0));
    this.data2 = this.mapPoints(safe(1));
    this.data3 = this.mapPoints(safe(2));
  }

  private mapPoints(points: RealTimeTrafficPoint[]) {
    return points.map((p) => ({
      label: p.label ?? '',
      people: p.population ??  0,
      time: p.waitTime ?? 0,
    }));
  }

  onPeopleCountClick(locationIndex: number, itemIndex: number) {
    const data = this.realTimeService.getRealTimeData();
    const location = data[locationIndex];
    const point = location?.data?.[itemIndex];
    const images = (point?.image ?? []).map((img: string, idx: number) => ({
      src: img,
      label: point?.label || '',
      pointIndex: itemIndex,
      imageIndex: idx,
    }));

    // Open dialog with images
    this.commonService.openCustomDialog(CameraDialogComponent, { imgList: images });
  }
}
