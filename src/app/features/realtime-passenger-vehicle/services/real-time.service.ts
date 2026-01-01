import { Injectable } from '@angular/core';
import { RealTimeTrafficFlowItem } from '../../../models/real-time-traffic-flow.model';
import { BehaviorSubject, Subject } from 'rxjs';

export interface RealTimeEvent {
  type: 'IMAGE_SELECT';
  payload: {
    locationIndex: number;
    pointIndex: number;
    imageIndex: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class RealTimeService {
  private realTimeDataSubject = new BehaviorSubject<RealTimeTrafficFlowItem[]>(
    []
  );

  /** 子層 / 父層皆可訂閱 */
  realTimeData$ = this.realTimeDataSubject.asObservable();

  setRealTimeData(data: RealTimeTrafficFlowItem[]) {
    this.realTimeDataSubject.next(data);
  }

  /** 直接取目前值（同步） */
  getRealTimeData(): RealTimeTrafficFlowItem[] {
    return this.realTimeDataSubject.value;
  }

  /** ===== 子層事件（Event Bus） ===== */

  private eventSubject = new Subject<RealTimeEvent>();
  events$ = this.eventSubject.asObservable();

  emitEvent(event: RealTimeEvent) {
    this.eventSubject.next(event);
  }
}
