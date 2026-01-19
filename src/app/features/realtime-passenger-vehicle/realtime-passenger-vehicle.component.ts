import { RealTimeService } from './services/real-time.service';
import { ApiService } from './../../core/services/api-service.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RealTimeTrafficFlowItem } from '../../models/real-time-traffic-flow.model';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import {
  BehaviorSubject,
  EMPTY,
  interval,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

export interface LocationImage {
  src: string;
  label: string;
  pointIndex: number; // 大項目
  imageIndex: number; // 小項目
}

export interface LocationImageGroup {
  locationName: string;
  images: LocationImage[];
  currentIndex: number;
}

export interface TaxiData {
  label: string;
  people: number;
  time: number;
}

@Component({
  selector: 'app-realtime-passenger-vehicle',
  imports: [CommonModule, RouterModule, DropdownComponent],
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

  now = new Date();

  locationGroups: LocationImageGroup[] = [];
  private timerId?: number | null;
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private apiService: ApiService,
    private realTimeService: RealTimeService,
  ) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;
    const index = this.data.findIndex((item) =>
      currentUrl.startsWith(item.routerLink),
    );
    if (index !== -1) {
      this.activeIndex = index;
    }

    // ===== 統一輪詢 =====
    this.refreshTrigger$
      .pipe(
        startWith(0), // 預設立即執行一次
        switchMap(() =>
          interval(30000).pipe(
            startWith(0),
            switchMap(() => this.getData()),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.realTimeService.events$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event.type === 'IMAGE_SELECT') {
          this.onImageSelected(event.payload);
        }
      });
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getData(): Observable<any> {
    if (this.activeIndex >= 3) {
      return EMPTY; // 不輪詢
    }

    return this.apiService
      .getRealTimeTrafficFlow(this.data[this.activeIndex].value)
      .pipe(
        tap((res) => {
          this.realTimeService.setRealTimeData(res);

          if (this.activeIndex === 2) {
            this.buildTaxiLocationGroups(res);
          } else {
            this.buildLocationGroups(res);
          }

          this.now = new Date();
        }),
      );
  }

  /** 將 API 資料依 location 分組並攤平 images */
  private buildLocationGroups(items: RealTimeTrafficFlowItem[]) {
    this.locationGroups = items.map((location) => {
      const images = location.data.flatMap((point, pointIndex) =>
        (point.image ?? []).map((img, imageIndex) => ({
          src: img,
          label: point.label,
          pointIndex,
          imageIndex,
        })),
      );

      return {
        locationName: location.locationName,
        images,
        currentIndex: 0,
      };
    });
  }

  private buildTaxiLocationGroups(items: RealTimeTrafficFlowItem[]) {
    const groups = items.flatMap((location) => {
      return location.data.map((taxi, pointIndex) => {
        const images = (taxi.image ?? []).map((img, imageIndex) => ({
          src: img,
          label: '',
          pointIndex,
          imageIndex,
        }));

        return {
          locationName: taxi.label,
          images,
          currentIndex: 0,
        };
      });
    });

    // 移除最後一筆（不需要顯示）
    this.locationGroups = groups.slice(0, -1);

    console.log(this.locationGroups);
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
  onTabChange(index: number | string) {
    if (typeof index === 'number') {
      this.activeIndex = index;
    } else {
      const foundIndex = this.data.findIndex((item) => item.value === index);
      this.activeIndex = foundIndex !== -1 ? foundIndex : 0;
    }

    this.refreshTrigger$.next(); // 立即刷新資料
    this.router.navigateByUrl(this.data[this.activeIndex].routerLink);
  }

  /** 輪播切換 */
  private onImageSelected(payload: {
    locationIndex: number;
    pointIndex: number;
    imageIndex: number;
  }) {
    const group = this.locationGroups[payload.locationIndex];
    if (!group) return;

    // 找到對應的 flat index
    const flatIndex = group.images.findIndex(
      (img) =>
        img.pointIndex === payload.pointIndex &&
        img.imageIndex === payload.imageIndex,
    );

    if (flatIndex === -1) return;
    group.currentIndex = flatIndex;
  }
}
