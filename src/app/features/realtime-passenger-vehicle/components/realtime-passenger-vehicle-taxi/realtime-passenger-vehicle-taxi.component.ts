import { Component } from '@angular/core';
import { RealTimeTrafficFlowItem, RealTimeTrafficPoint } from '../../../../models/real-time-traffic-flow.model';
import { RealTimeService } from '../../services/real-time.service';
import { Subject, takeUntil } from 'rxjs';
import { TaxiData } from '../../realtime-passenger-vehicle.component';
import { CameraDialogComponent } from '../camera-dialog/camera-dialog.component';
import { CommonService } from '../../../../core/services/common.service';

@Component({
  selector: 'app-realtime-passenger-vehicle-taxi',
  imports: [],
  templateUrl: './realtime-passenger-vehicle-taxi.component.html',
  styleUrl: './realtime-passenger-vehicle-taxi.component.scss'
})
export class RealtimePassengerVehicleTaxiComponent {
  data1: TaxiData[] = [];

  data2: TaxiData[] = [];

  data3: TaxiData[] = [];

  private destroy$ = new Subject<void>();

  constructor(private realTimeService: RealTimeService, private commonService: CommonService) {}

  ngOnInit(): void {
    this.realTimeService.realTimeData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.mapRealTimeToViewData(items[0]);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private mapRealTimeToViewData(item: RealTimeTrafficFlowItem) {
    const safe = (i: number) => item?.data?.[i] ? [item.data[i]] : [];

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

  onPeopleCountClick(itemIndex: number) {
    const data = this.realTimeService.getRealTimeData();
    const location = data[0];
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
