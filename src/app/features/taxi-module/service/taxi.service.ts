import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PostTaxiRequest } from '../../../models/taxi.model';

@Injectable({
  providedIn: 'root',
})
export class TaxiService {
  // 建立 Subject
  private createTaxiSubject = new Subject<PostTaxiRequest>();

  // 暴露 Observable 給其他元件訂閱
  createTaxi$ = this.createTaxiSubject.asObservable();

  // 發送新建事件
  afterCreateTaxi(payload: PostTaxiRequest) {
    this.createTaxiSubject.next(payload);
  }

  constructor() {}
}
