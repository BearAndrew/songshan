import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CounterInfo } from '../../../models/counter.model';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private counterDataSubject = new Subject<CounterInfo>();

  /** 設定資料 */
  setCounterData(data: CounterInfo) {
    this.counterDataSubject.next(data);
  }

  /** 取得資料 */
  getCounterData(): Observable<CounterInfo> {
    return this.counterDataSubject.asObservable();
  }

}
