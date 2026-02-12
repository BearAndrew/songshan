import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  TaxiEventData,
  TaxiInfo,
  TaxiStatusInfo,
  TaxiViolation,
} from '../../../models/taxi.model';
import { SearchDailyTaxiData, SearchTaxiData } from './taxi.interface';

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

  // 查詢 Subject
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

  // 更新 Subject
  private updateSubject = new Subject<TaxiInfo>();
  update$ = this.updateSubject.asObservable();
  // 更新
  setUpdate(updateData: TaxiInfo) {
    this.updateSubject.next(updateData);
  }

  // 黑黑名單 Subject
  private blackListSubject = new Subject<TaxiViolation[]>();
  // 暴露 Observable 給其他元件訂閱
  blackListSubject$ = this.blackListSubject.asObservable();
  // 發送查詢黑黑名單事件
  afterSearchViolationList(blackList: TaxiViolation[]) {
    this.blackListSubject.next(blackList);
  }

  // 出勤前六名 Subject
  private top6Subject = new Subject<TaxiStatusInfo[]>();
  // 暴露 Observable 給其他元件訂閱
  top6Subject$ = this.top6Subject.asObservable();
  // 發送查詢出勤前六名
  afterTop6(top6: TaxiStatusInfo[]) {
    this.top6Subject.next(top6);
  }

  // 每日計程車查詢 Subject
  private dailySubject = new Subject<SearchDailyTaxiData>();
  // 暴露 Observable 給其他元件訂閱
  dailySubject$ = this.dailySubject.asObservable();
  // 發送查詢出勤前六名
  afterDaily(daily: SearchDailyTaxiData) {
    this.dailySubject.next(daily);
  }

  // 刪除發送 Subject
  private deleteSubject = new Subject<string>();
  // 暴露 Observable 給其他元件訂閱
  deleteSubject$ = this.deleteSubject.asObservable();
  // 發送查詢黑黑名單事件
  afterDelete() {
    this.deleteSubject.next('');
  }

  // 編輯發送 Subject
  private editSubject = new Subject<{
    activeTab: string;
    taxiInfo: TaxiInfo;
  }>();
  // 暴露 Observable 給其他元件訂閱
  editSubject$ = this.editSubject.asObservable();
  // 發送點擊編輯事件
  clickEdit(taxiInfo: TaxiInfo) {
    this.editSubject.next({ activeTab: 'update', taxiInfo });
  }
}
