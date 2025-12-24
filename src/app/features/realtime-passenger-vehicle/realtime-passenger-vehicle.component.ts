import { ApiService } from './../../core/services/api-service.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RealTimeTrafficFlowItem } from '../../models/real-time-traffic-flow.model';

interface LocationImageGroup {
  locationName: string;
  images: string[];        // 攤平後的所有 image
  currentIndex: number;    // 目前顯示第幾張
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
    },
    {
      label: '國內線',
      routerLink: '/realtime-passenger-vehicle/domestic',
    },
    {
      label: '計程車',
      routerLink: '/realtime-passenger-vehicle/taxi',
    },
    {
      label: '國際線入境行李',
      routerLink: '/realtime-passenger-vehicle/baggage',
    },
  ];

   locationGroups: LocationImageGroup[] = [];
  private timerId?: number;

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;

    const index = this.data.findIndex((item) =>
      currentUrl.startsWith(item.routerLink)
    );

    if (index !== -1) {
      this.activeIndex = index;
    }

    this.apiService.getRealTimeTrafficFlow().subscribe((res) => {
      this.buildLocationGroups(res);
      this.startRotation();
    });
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  /** 將 API 資料依 location 分組並攤平 images */
  private buildLocationGroups(items: RealTimeTrafficFlowItem[]) {
    this.locationGroups = items.map((location) => {
      const images = location.data.flatMap((point) => point.image ?? []);
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

  /** 目前顯示的 image（template 使用） */
  getCurrentImage(group: LocationImageGroup): string | null {
    return group.images.length ? group.images[group.currentIndex] : null;
  }
}
