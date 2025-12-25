import { RealTimeService } from './services/real-time.service';
import { ApiService } from './../../core/services/api-service.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RealTimeTrafficFlowItem } from '../../models/real-time-traffic-flow.model';

interface LocationImageGroup {
  locationName: string;
  images: { src: string; label: string }[]; // 每張圖片對應一個 label
  currentIndex: number; // 目前顯示第幾張
}

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
      value: 'intl',
    },
    {
      label: '國內線',
      routerLink: '/realtime-passenger-vehicle/domestic',
      value: 'domestic',
    },
    {
      label: '計程車',
      routerLink: '/realtime-passenger-vehicle/taxi',
      value: 'taxi',
    },
    {
      label: '國際線入境行李',
      routerLink: '/realtime-passenger-vehicle/baggage',
      value: '',
    },
  ];

  locationGroups: LocationImageGroup[] = [];
  private timerId?: number | null;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private realTimeService: RealTimeService
  ) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;

    const index = this.data.findIndex((item) =>
      currentUrl.startsWith(item.routerLink)
    );

    if (index !== -1) {
      this.activeIndex = index;
    }

    this.getData();

    this.realTimeService.events$.subscribe((event) => {
      if (event.type === 'IMAGE_SELECT') {
        this.onImageSelected(event.payload);
      }
    });
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private getData() {
    if (this.activeIndex < 3) {
      // 先停止輪播
      this.stopRotation();

      this.apiService
        .getRealTimeTrafficFlow(this.data[this.activeIndex].value)
        .subscribe((res) => {
          // 更新資料
          this.realTimeService.setRealTimeData(res);
          this.buildLocationGroups(res);

          // 資料更新完成後再啟動輪播
          this.startRotation();
        });
    }
  }

  /** 將 API 資料依 location 分組並攤平 images */
private buildLocationGroups(items: RealTimeTrafficFlowItem[]) {
  this.locationGroups = items.map((location) => {
    // 將每個 point 的圖片攤平，每張圖片保留對應 label
    const images = location.data.flatMap((point) =>
      (point.image ?? []).map((img) => ({
        src: img,
        label: point.label,
      }))
    );

    return {
      locationName: location.locationName,
      images,
      currentIndex: 0,
    };
  });
}

  /** 每 10 秒全部 location 一起切換圖片 */
  private startRotation() {
    this.timerId = window.setInterval(() => {
      this.locationGroups.forEach((group) => {
        if (group.images.length > 0) {
          group.currentIndex = (group.currentIndex + 1) % group.images.length;
        }
      });
    }, 10000);
  }

  private stopRotation() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /** 目前顯示的 image（template 使用） */
  getCurrentImage(group: LocationImageGroup): string | null {
    return group.images.length ? group.images[group.currentIndex].src : null;
  }

  /** 切換按鈕 */
  onTabChange(index: number) {
    this.activeIndex = index;
    this.getData();
    this.router.navigateByUrl(this.data[this.activeIndex].routerLink);
  }

  /** 輪播切換 */
  private onImageSelected(payload: {
    locationIndex: number;
    imageIndex: number;
  }) {
    const group = this.locationGroups[payload.locationIndex];

    if (!group || group.images.length === 0) return;

    // 防止 index 超界
    group.currentIndex = payload.imageIndex % group.images.length;
  }
}
