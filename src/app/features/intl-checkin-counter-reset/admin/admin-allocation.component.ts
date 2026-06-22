import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { ApiService } from '../../../core/services/api-service.service';
import { CommonService } from '../../../core/services/common.service';
import { parseTwDateTime } from '../../../core/utils/parse-tw-datetime';
import {
  CounterGetAllRequest,
  CounterInfo,
  CounterSeason,
} from '../../../models/counter.model';
import { Option } from '../../../shared/components/dropdown/dropdown.component';
import { CalendarTriggerComponent } from '../../../shared/components/calendar-trigger/calendar-trigger.component';
import { OpsSelectComponent } from '../components/ops-select.component';
import {
  ApplicationFormData,
  ApplicationFormModalComponent,
  ApplicationFormResult,
} from '../components/application-form-modal.component';
import { ApplyType, getApplyType, timeToDecimal } from '../reset-shared';

interface GanttBlock {
  info: CounterInfo;
  counter: number; // 0..5
  leftPct: number;
  widthPct: number;
  flight: string;
  dest: string;
  type: ApplyType;
}

const START_HOUR = 6;
const HOURS = 16; // 06:00 ~ 22:00

@Component({
  selector: 'app-admin-allocation',
  standalone: true,
  imports: [CommonModule, FormsModule, OpsSelectComponent, CalendarTriggerComponent],
  templateUrl: './admin-allocation.component.html',
  styles: [':host{display:flex;flex-direction:column;flex:1;min-height:0;}'],
})
export class AdminAllocationComponent implements OnInit {
  counters = [1, 2, 3, 4, 5, 6];
  hourCols = Array.from({ length: HOURS }, (_, i) => START_HOUR + i);

  blocks: GanttBlock[] = [];

  mode: '整季' | '單日' = '單日';
  dateStr = ''; // yyyy-MM-dd
  selectedDate: Date = new Date();

  seasonList: CounterSeason[] = [];
  seasonOptions: Option[] = [];
  selectedSeason = '';

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.dateStr = this.fmt(new Date());
    this.apiService.getSeasons().subscribe((res) => {
      this.seasonList = res || [];
      this.seasonOptions = this.seasonList.map((s) => ({ label: s.season, value: s.season }));
      this.selectedSeason = this.currentSeason()?.season || this.seasonList[0]?.season || '';
      this.load();
    });
  }

  private fmt(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }
  pad2(n: number): string {
    return String(n).padStart(2, '0');
  }
  private currentSeason(): CounterSeason | undefined {
    const today = new Date();
    return this.seasonList.find((s) => {
      const a = parseTwDateTime(s.startDate);
      const b = parseTwDateTime(s.endDate);
      return a && b && today >= a && today <= b;
    });
  }

  // ---- 載入 ----
  load(): void {
    let from = this.dateStr;
    let to = this.dateStr;
    if (this.mode === '整季') {
      const s = this.seasonList.find((x) => x.season === this.selectedSeason);
      const a = s ? parseTwDateTime(s.startDate) : null;
      const b = s ? parseTwDateTime(s.endDate) : null;
      if (a && b) {
        from = this.fmt(a);
        to = this.fmt(b);
      }
    }
    const payload: CounterGetAllRequest = { dateFrom: from, dateTo: to, status: 'ALL', agent: 'ALL' };
    this.apiService.getAllCounter(payload).subscribe((res) => {
      this.blocks = this.buildBlocks(res || []);
    });
  }

  private buildBlocks(data: CounterInfo[]): GanttBlock[] {
    const out: GanttBlock[] = [];
    for (const info of data) {
      if (info.status !== 'APPROVE') continue;
      const counter = Number(info.assignedCounterArea);
      if (!counter || counter < 1 || counter > 6) continue;
      const s = timeToDecimal(info.startTime);
      const e = timeToDecimal(info.endTime);
      if (isNaN(s) || isNaN(e) || e <= s) continue;
      const left = ((s - START_HOUR) / HOURS) * 100;
      const width = ((e - s) / HOURS) * 100;
      out.push({
        info,
        counter: counter - 1,
        leftPct: Math.max(0, left),
        widthPct: Math.max(1, Math.min(width, 100 - Math.max(0, left))),
        flight: `${info.airlineIata}${info.flightNo}`,
        dest: info.departureIata,
        type: getApplyType(info),
      });
    }
    return out;
  }

  blocksFor(counterIdx: number): GanttBlock[] {
    return this.blocks.filter((b) => b.counter === counterIdx);
  }

  onModeChange(m: '整季' | '單日'): void {
    if (this.mode === m) return;
    this.mode = m;
    this.load();
  }
  onDateChange(d: Date): void {
    if (!d) return;
    this.selectedDate = d;
    this.dateStr = this.fmt(d);
    this.load();
  }
  onSeasonChange(): void {
    this.load();
  }

  // ---- 點擊時段 → 異動彈窗(沿用申請表單元件 modify 模式) ----
  openEdit(b: GanttBlock): void {
    const data: ApplicationFormData = { mode: 'modify', info: b.info, agent: 'ALL' };
    this.commonService
      .openCustomDialog<ApplicationFormModalComponent, ApplicationFormResult>(
        ApplicationFormModalComponent,
        data,
      )
      .pipe(take(1))
      .subscribe((res) => {
        if (res && res.mode === 'modify') {
          this.apiService.applyEdit(res.payload).subscribe({
            next: () => {
              this.alert('異動已送出', '已更新申請內容');
              this.load();
            },
            error: (err) => this.alert('異動失敗', err?.error),
          });
        }
      });
  }

  private alert(title: string, message?: string): void {
    this.commonService
      .openDialog({ title, message: message || '', confirmText: '確定', cancelText: '' })
      .pipe(take(1))
      .subscribe();
  }
}
