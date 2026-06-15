import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  OVERLAY_DATA,
  OVERLAY_RESULT,
} from '../../../shared/components/message-dialog/message-dialog.inject-token';
import { CounterInfo } from '../../../models/counter.model';
import { Option } from '../../../shared/components/dropdown/dropdown.component';
import { OpsSelectComponent } from './ops-select.component';
import {
  ApplyType,
  dayOfWeekLabel,
  flightCode,
  getApplyType,
  hhmm,
} from '../reset-shared';

export interface AuditModalData {
  info: CounterInfo;
  /** 航點顯示名稱(航站管理員頁帶入) */
  airportName?: string;
}

/** 審核結果,由呼叫頁打 adminApproval */
export interface AuditResult {
  action: 'approve' | 'reject';
  assignedCounterArea?: string;
  reason?: string;
}

@Component({
  selector: 'app-audit-new-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, OpsSelectComponent],
  templateUrl: './audit-new-modal.component.html',
})
export class AuditNewModalComponent implements OnInit {
  info!: CounterInfo;
  airportName = '';

  code = '';
  dest = '';
  dep = '';
  week = '';
  openTime = '';
  closeTime = '';
  type: ApplyType = 'season';
  season = '';
  note = '';

  counterOptions: Option[] = ['1', '2', '3', '4', '5', '6'].map((c) => ({
    label: `櫃檯 ${c}`,
    value: c,
  }));
  assignedCounterArea = '';
  reason = '';
  submitted = false;

  constructor(
    @Inject(OVERLAY_DATA) public data: AuditModalData,
    @Inject(OVERLAY_RESULT) private result$: Subject<AuditResult | null>,
  ) {}

  ngOnInit(): void {
    this.info = this.data.info;
    this.airportName = this.data.airportName || '';
    const i = this.info;
    this.code = flightCode(i);
    this.dest = this.airportName ? `${i.departureIata} ${this.airportName}` : i.departureIata;
    this.dep = hhmm(i.departure_time);
    this.week = dayOfWeekLabel(i.dayOfWeek);
    this.openTime = hhmm(i.startTime);
    this.closeTime = hhmm(i.endTime);
    this.type = getApplyType(i);
    this.season = i.season || '';
    this.note = i.reason || '';
    this.assignedCounterArea = i.assignedCounterArea || '';
  }

  get title(): string {
    return `審核 · 新增申請 · ${this.code}`;
  }

  approve(): void {
    this.submitted = true;
    if (!this.assignedCounterArea) return;
    this.result$.next({ action: 'approve', assignedCounterArea: this.assignedCounterArea });
    this.result$.complete();
  }

  reject(): void {
    this.submitted = true;
    if (!this.reason.trim()) return; // 駁回需填原因
    this.result$.next({ action: 'reject', reason: this.reason });
    this.result$.complete();
  }

  cancel(): void {
    this.result$.next(null);
    this.result$.complete();
  }
}
