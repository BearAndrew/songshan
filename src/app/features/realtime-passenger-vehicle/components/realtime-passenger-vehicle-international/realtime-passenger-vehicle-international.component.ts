import { Subject, takeUntil } from 'rxjs';
import {
  RealTimeTrafficFlowItem,
  RealTimeTrafficPoint,
} from '../../../../models/real-time-traffic-flow.model';
import { RealTimeService } from './../../services/real-time.service';
import { Component } from '@angular/core';
import { CommonService } from '../../../../core/services/common.service';
import { CameraDialogComponent } from '../camera-dialog/camera-dialog.component';

@Component({
  selector: 'app-realtime-passenger-vehicle-international',
  imports: [],
  templateUrl: './realtime-passenger-vehicle-international.component.html',
  styleUrl: './realtime-passenger-vehicle-international.component.scss',
})
export class RealtimePassengerVehicleInternationalComponent {
  checkinData = [
    { label: '1', people: 0, time: 0 },
  ];

  securityData = [
    { label: 'Fast track', people: 0, time: 0 },
    { label: '一般通道', people: 0, time: 0 },
    { label: '總計', people: 0, time: 0 },
  ];

  customsData = [{ label: '1', people: 0, time: 0 }];

  departureData = [
    { label: '自動通關', people: 0, time: 0 },
    { label: '人工查驗', people: 0, time: 0 },
  ];

  arrivalData = [
    { label: '自動通關', people: 0, time: 0 },
    { label: '人工查驗', people: 0, time: 0 },
  ];

  private destroy$ = new Subject<void>();

  constructor(private realTimeService: RealTimeService, private commonService: CommonService) {}

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
    // 取得目前的 realtime data，找到對應 location -> point 的 images
    const data = this.realTimeService.getRealTimeData();
    const location = data[locationIndex];
    const point = location?.data?.[itemIndex];
    const images = (point?.image ?? []).map((img: string, idx: number) => ({ src: img, label: point?.label || '', pointIndex: itemIndex, imageIndex: idx }));
    // 傳入 images 陣列到 dialog
    this.commonService.openCustomDialog(CameraDialogComponent, { imgList: images });

    // 也觸發選取事件，讓父元件或其他 listener 可以同步切換
    // this.realTimeService.emitEvent({
    //   type: 'IMAGE_SELECT',
    //   payload: {
    //     locationIndex,
    //     imageIndex: 0,
    //     pointIndex: itemIndex,
    //   },
    // });
  }
}
