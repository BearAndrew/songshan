import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { ApiService } from '../../../core/services/api-service.service';
import { CommonService } from '../../../core/services/common.service';
import { parseTwDateTime } from '../../../core/utils/parse-tw-datetime';
import {
  CounterAdminApprovalRequest,
  CounterApplyEditRequest,
  CounterApplicationManualRequest,
  CounterGetAllRequest,
  CounterInfo,
  CounterSeason,
} from '../../../models/counter.model';
import {
  ApplyType,
  StatusKind,
  dayOfWeekLabel,
  flightCode,
  getApplyType,
  getStatusKind,
  hhmm,
  timeRange,
} from '../reset-shared';
import { AdminAllocationComponent } from './admin-allocation.component';
import { AdminReportsComponent } from './admin-reports.component';
import {
  AuditModalData,
  AuditNewModalComponent,
  AuditResult,
} from '../components/audit-new-modal.component';
import {
  ApplicationFormData,
  ApplicationFormModalComponent,
  ApplicationFormResult,
} from '../components/application-form-modal.component';
import { OpsSelectComponent } from '../components/ops-select.component';
import { Option } from '../../../shared/components/dropdown/dropdown.component';

interface AdminRow {
  info: CounterInfo;
  code: string;
  dest: string;
  week: string;
  dep: string;
  counter: string;
  applyTime: string;
  type: ApplyType;
  status: StatusKind;
}

type AdminTab = '航班資料' | '櫃檯分配' | '報表';

@Component({
  selector: 'app-intl-checkin-counter-reset-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OpsSelectComponent,
    AdminAllocationComponent,
    AdminReportsComponent,
  ],
  templateUrl: './intl-checkin-counter-reset-admin.component.html',
  styleUrl: './intl-checkin-counter-reset-admin.component.scss',
})
export class IntlCheckinCounterResetAdminComponent implements OnInit {
  tabs: AdminTab[] = ['航班資料', '櫃檯分配', '報表'];
  activeTab: AdminTab = '航班資料';

  rows: AdminRow[] = [];

  airlineFilter = '';
  typeFilter: 'all' | ApplyType = 'all';
  statusFilter: 'all' | StatusKind = 'all';
  search = '';
  /** 手機版上方控制列是否展開(手機預設收合;桌機此旗標不影響,篩選恆顯示)*/
  filtersOpen = false;

  airlineOptions: Option[] = [];
  airportNameMap: Record<string, string> = {};
  seasonList: CounterSeason[] = [];

  typeOptions: Option[] = [
    { label: '全部', value: 'all' },
    { label: '整季', value: 'season' },
    { label: '指定期間', value: 'range' },
  ];
  statusOptions: Option[] = [
    { label: '全部', value: 'all' },
    { label: '待審核', value: 'pending' },
    { label: '已核准', value: 'approved' },
    { label: '已駁回', value: 'rejected' },
  ];

  /** 航空公司篩選下拉(含「全部」) */
  get airlineFilterOptions(): Option[] {
    return [{ label: '全部', value: '' }, ...this.airlineOptions];
  }

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.apiService
      .getAirportListByTypeAirline('nondomestic', '')
      .subscribe((res) => res.forEach((a) => (this.airportNameMap[a.iata] = a.name_zhTW)));

    this.apiService.getAirlineList('intl').subscribe((res) => {
      this.airlineOptions = (res || []).map((a) => ({ label: a.name_zhTW, value: a.iata }));
    });

    this.apiService.getSeasons().subscribe((res) => {
      this.seasonList = res || [];
      this.loadFlights();
    });
  }

  setTab(t: AdminTab): void {
    this.activeTab = t;
  }

  private fmt(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  /** 航班資料載入區間:當季(找不到則本週) */
  private currentRange(): { from: string; to: string } {
    const today = new Date();
    const s = this.seasonList.find((x) => {
      const start = parseTwDateTime(x.startDate);
      const end = parseTwDateTime(x.endDate);
      return start && end && today >= start && today <= end;
    });
    if (s) {
      const start = parseTwDateTime(s.startDate);
      const end = parseTwDateTime(s.endDate);
      if (start && end) return { from: this.fmt(start), to: this.fmt(end) };
    }
    const day = today.getDay();
    const sun = new Date(today);
    sun.setDate(today.getDate() - day);
    const sat = new Date(sun);
    sat.setDate(sun.getDate() + 6);
    return { from: this.fmt(sun), to: this.fmt(sat) };
  }

  loadFlights(): void {
    const { from, to } = this.currentRange();
    const payload: CounterGetAllRequest = {
      dateFrom: from,
      dateTo: to,
      status: 'ALL',
      agent: 'ALL',
    };
    this.apiService.getAllCounter(payload).subscribe((res) => {
      this.rows = (res || [])
        .map((info) => this.toRow(info))
        .filter((r): r is AdminRow => r !== null);
    });
  }

  private toRow(info: CounterInfo): AdminRow | null {
    const status = getStatusKind(info.status);
    if (!status) return null;
    const destName = this.airportNameMap[info.departureIata] || '';
    return {
      info,
      code: flightCode(info),
      dest: destName ? `${info.departureIata} ${destName}` : info.departureIata,
      week: dayOfWeekLabel(info.dayOfWeek),
      dep: hhmm(info.departure_time),
      counter: info.assignedCounterArea || '—',
      applyTime: timeRange(info),
      type: getApplyType(info),
      status,
    };
  }

  get filteredRows(): AdminRow[] {
    const kw = this.search.trim().toLowerCase();
    return this.rows.filter(
      (r) =>
        (!this.airlineFilter || r.info.airlineIata === this.airlineFilter) &&
        (this.typeFilter === 'all' || r.type === this.typeFilter) &&
        (this.statusFilter === 'all' || r.status === this.statusFilter) &&
        (!kw ||
          r.code.toLowerCase().includes(kw) ||
          r.dest.toLowerCase().includes(kw)),
    );
  }

  // ---- 審核(pending) ----
  openAudit(r: AdminRow): void {
    const data: AuditModalData = {
      info: r.info,
      airportName: this.airportNameMap[r.info.departureIata] || '',
    };
    this.commonService
      .openCustomDialog<AuditNewModalComponent, AuditResult>(AuditNewModalComponent, data)
      .pipe(take(1))
      .subscribe((res) => {
        if (res) this.submitApproval(r.info, res);
      });
  }

  private submitApproval(info: CounterInfo, res: AuditResult): void {
    const payload: CounterAdminApprovalRequest = {
      requestId: info.requestId,
      reason: res.reason || '',
      assignedCounterArea: res.assignedCounterArea || info.assignedCounterArea || '',
      assignedCounterBooth: '',
      assignedBy: '',
      status: res.action === 'approve' ? 'APPROVE' : 'REJECT',
    };
    this.apiService.adminApproval(payload).subscribe({
      next: () => {
        this.alert(res.action === 'approve' ? '核准成功' : '駁回成功', '已更新申請狀態');
        this.loadFlights();
      },
      error: (err) => this.alert('操作失敗', err?.error),
    });
  }

  // ---- 編輯(非 pending)→ 異動表單 ----
  openEdit(r: AdminRow): void {
    const data: ApplicationFormData = { mode: 'modify', info: r.info, agent: 'ALL' };
    this.commonService
      .openCustomDialog<ApplicationFormModalComponent, ApplicationFormResult>(
        ApplicationFormModalComponent,
        data,
      )
      .pipe(take(1))
      .subscribe((res) => {
        if (res && res.mode === 'modify') this.submitEdit(res.payload);
      });
  }

  private submitEdit(payload: CounterApplyEditRequest): void {
    this.apiService.applyEdit(payload).subscribe({
      next: () => {
        this.alert('修改成功', '已更新申請內容');
        this.loadFlights();
      },
      error: (err) => this.alert('修改失敗', err?.error),
    });
  }

  // ---- 新增航班 → 新增申請表單 ----
  openCreate(): void {
    const data: ApplicationFormData = { mode: 'new', agent: 'ALL' };
    this.commonService
      .openCustomDialog<ApplicationFormModalComponent, ApplicationFormResult>(
        ApplicationFormModalComponent,
        data,
      )
      .pipe(take(1))
      .subscribe((res) => {
        if (res && res.mode === 'new') this.submitCreate(res.payload);
      });
  }

  private submitCreate(payload: CounterApplicationManualRequest): void {
    this.apiService.addCounterApplication(payload).subscribe({
      next: () => {
        this.alert('新增成功', '已建立申請');
        this.loadFlights();
      },
      error: (err) => this.alert('新增失敗', err?.error),
    });
  }

  // ---- 匯入 EXCEL ----
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const isExcel =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      this.alert('', '請上傳 Excel 檔案 (.xls, .xlsx)');
      input.value = '';
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    this.apiService.importCounter(formData).subscribe({
      next: () => {
        this.alert('', 'Excel 匯入成功');
        input.value = '';
        this.loadFlights();
      },
      error: (err) => {
        this.alert('Excel 匯入失敗', err?.error);
        input.value = '';
      },
    });
  }

  private alert(title: string, message?: string): void {
    this.commonService
      .openDialog({ title, message: message || '', confirmText: '確定', cancelText: '' })
      .pipe(take(1))
      .subscribe();
  }
}
