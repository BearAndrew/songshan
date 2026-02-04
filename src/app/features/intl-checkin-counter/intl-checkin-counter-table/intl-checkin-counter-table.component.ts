import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api-service.service';
import { CalendarTriggerComponent } from '../../../shared/components/calendar-trigger/calendar-trigger.component';
import {
  DropdownComponent,
  Option,
} from '../../../shared/components/dropdown/dropdown.component';
import {
  CounterApplyEditRequest,
  CounterGetAllRequest,
  CounterInfo,
  statusMap,
} from '../../../models/counter.model';
import { Airline } from '../../../models/airline.model';
import { CounterService } from '../service/counter.service';

@Component({
  selector: 'app-intl-checkin-counter-table',
  imports: [
    CommonModule,
    RouterModule,
    CalendarTriggerComponent,
    DropdownComponent,
  ],
  templateUrl: './intl-checkin-counter-table.component.html',
  styleUrl: './intl-checkin-counter-table.component.scss',
})
export class IntlCheckinCounterTableComponent {
  @Input() isUser: boolean = false;
  table: CounterInfo[] = [];

  airlineOptions: Option[] = [];
  islandOptions: Option[] = [
    { label: '全部', value: 'ALL' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
  ];

  island: string = 'ALL';
  airline: string = 'ALL';
  dateFrom: string = '';
  dateTo: string = '';
  statusMap = statusMap;

  /** 權限管控 */
  agent: string = 'ALL';
  redirectURL: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.agent = params.get('user') || 'ALL';
    });

    // 取得航空公司清單
    this.apiService.getAirlineList('intl').subscribe((res: Airline[]) => {
      this.airlineOptions = res.map((airline) => ({
        label: airline.name_zhTW,
        value: airline.iata,
      }));
      this.airlineOptions.unshift({ label: '全部', value: '' });
    });

    this.redirectURL = this.isUser
      ? '/intl-checkin-counter-user'
      : '/intl-checkin-counter-admin';
  }

  /** 日期更改 */
  onDateChange(type: 'start' | 'end', event: Date) {
    const yyyy = event.getFullYear();
    const mm = String(event.getMonth() + 1).padStart(2, '0'); // 月份要 +1
    const dd = String(event.getDate()).padStart(2, '0');

    const formatted = `${yyyy}-${mm}-${dd}`;
    if (type === 'start') {
      this.dateFrom = formatted || '';
    } else {
      this.dateTo = formatted || '';
    }
  }

  // 選擇事件
  onAirlineChange(option: Option) {
    this.airline = option.value;
  }

  onIslandChange(option: Option) {
    this.island = option.value;
  }

  onConfirm() {
    // 組裝 API payload
    const payload: CounterGetAllRequest = {
      dateFrom: this.dateFrom || '',
      dateTo: this.dateTo || '',
      status: 'ALL',
      agent: this.agent,
    };

    this.apiService.getAllCounter(payload).subscribe((res) => {
      console.log(res);
      this.table = res;
    });
  }

  getAirlineLabel(value: string): string {
    return this.airlineOptions.find((item) => item.value == value)?.label || '';
  }

  goEdit(data: CounterInfo) {
    const applyRequest: CounterApplyEditRequest =
      this.mapCounterInfoToApplyRequest(data);

    // 導向另一個元件，把所有參數放 URL
    this.router.navigate([this.redirectURL], {
      queryParams: {
        isEdit: 'Y',
        requestId: applyRequest.requestId,
        airlineIata: applyRequest.airlineIata,
        flightNo: applyRequest.flightNo,
        season: applyRequest.season,
        apply_for_period: applyRequest.apply_for_period,
        startDate: applyRequest.startDate,
        endDate: applyRequest.endDate,
        dayOfWeek: applyRequest.dayOfWeek,
        startTime: applyRequest.startTime,
        endTime: applyRequest.endTime,
      },
    });
  }

  mapCounterInfoToApplyRequest(data: CounterInfo): CounterApplyEditRequest {
    // 確保 apply_for_period 格式正確
    const apply_for_period =
      data.applyForPeriod && data.applyForPeriod.includes('~')
        ? data.applyForPeriod
        : '';

    return {
      requestId: data.requestId || '',
      airlineIata: data.airlineIata || '',
      flightNo: data.flightNo || '',
      season: data.season || '',
      apply_for_period, // 注意改成下底線
      startDate: '',
      endDate: '',
      dayOfWeek: data.dayOfWeek || '',
      startTime: data.startTime || '',
      endTime: data.endTime || '',
    };
  }
}
