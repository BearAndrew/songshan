import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TaxiInfo, TaxiStatusInfo, TaxiViolation } from '../../../models/taxi.model';
import { SearchTaxiData } from './taxi.interface';

@Injectable({
  providedIn: 'root',
})
export class TaxiService {
  constructor() {}

  // 建立 Subject
  private createTaxiSubject = new Subject<TaxiInfo>();
  createTaxi$ = this.createTaxiSubject.asObservable();
  // 發送新建事件
  afterCreateTaxi(payload: TaxiInfo) {
    this.createTaxiSubject.next(payload);
  }

  // 建立 Subject
  private searchTaxiSubject = new Subject<SearchTaxiData>();
  searchTaxi$ = this.searchTaxiSubject.asObservable();
  // 發送查詢計程車事件
  afterSearchTaxi(taxiInfoList: SearchTaxiData) {
    this.searchTaxiSubject.next(taxiInfoList);
  }

  // 查詢類型 Subject
  private readTypeSubject = new Subject<string>();
  readType$ = this.readTypeSubject.asObservable();
  // 查詢類型
  afterReadType(readType: string) {
    this.readTypeSubject.next(readType);
  }

  // 黑灰名單 Subject
  private blackListSubject = new Subject<TaxiViolation[]>();
  // 暴露 Observable 給其他元件訂閱
  blackListSubject$ = this.blackListSubject.asObservable();
  // 發送查詢黑灰名單事件
  afterSearchViolationList(blackList: TaxiViolation[]) {
    this.blackListSubject.next(blackList);
  }

  // 黑灰名單 Subject
  private top6Subject = new Subject<TaxiStatusInfo[]>();
  // 暴露 Observable 給其他元件訂閱
  top6Subject$ = this.top6Subject.asObservable();
  // 發送查詢黑灰名單事件
  afterTop6(top6: TaxiStatusInfo[]) {
    this.top6Subject.next(top6);
  }
}
