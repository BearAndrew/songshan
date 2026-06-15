import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  OVERLAY_DATA,
  OVERLAY_RESULT,
} from '../../../shared/components/message-dialog/message-dialog.inject-token';
import { CounterInfo } from '../../../models/counter.model';
import { flightCode } from '../reset-shared';
import { AuditResult } from './audit-new-modal.component';

export interface ComparisonRow {
  field: string;
  before: string;
  after: string;
  changed: boolean;
}

export interface AuditModifyData {
  info: CounterInfo;
  /** 異動前後對照(由呼叫頁提供;後端需回傳異動前資料) */
  cmp: ComparisonRow[];
}

@Component({
  selector: 'app-audit-modify-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-modify-modal.component.html',
})
export class AuditModifyModalComponent implements OnInit {
  info!: CounterInfo;
  cmp: ComparisonRow[] = [];
  reason = '';
  submitted = false;

  constructor(
    @Inject(OVERLAY_DATA) public data: AuditModifyData,
    @Inject(OVERLAY_RESULT) private result$: Subject<AuditResult | null>,
  ) {}

  ngOnInit(): void {
    this.info = this.data.info;
    this.cmp = this.data.cmp || [];
  }

  get title(): string {
    const counter = this.info?.assignedCounterArea ? ` · 櫃檯 ${this.info.assignedCounterArea}` : '';
    return `審核 · 異動申請 · ${flightCode(this.info)}${counter}`;
  }

  approve(): void {
    this.result$.next({ action: 'approve', assignedCounterArea: this.info.assignedCounterArea });
    this.result$.complete();
  }

  reject(): void {
    this.submitted = true;
    if (!this.reason.trim()) return;
    this.result$.next({ action: 'reject', reason: this.reason });
    this.result$.complete();
  }

  cancel(): void {
    this.result$.next(null);
    this.result$.complete();
  }
}
