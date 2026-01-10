import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TaxiInfo } from '../../../models/taxi.model';
import { SearchTaxiData } from './taxi.interface';

@Injectable({
  providedIn: 'root',
})
export class TaxiService {
  constructor() {}

  // 建立 Subject
  private createTaxiSubject = new Subject<TaxiInfo>();
  // 暴露 Observable 給其他元件訂閱
  createTaxi$ = this.createTaxiSubject.asObservable();
  // 發送新建事件
  afterCreateTaxi(payload: TaxiInfo) {
    this.createTaxiSubject.next(payload);
  }

  // 建立 Subject
  private searchTaxiSubject = new Subject<SearchTaxiData>();
  // 暴露 Observable 給其他元件訂閱
  searchTaxi$ = this.searchTaxiSubject.asObservable();
  // 發送查詢事件
  afterSearchTaxi(taxiInfoList: SearchTaxiData) {
    this.searchTaxiSubject.next(taxiInfoList);
  }
}
