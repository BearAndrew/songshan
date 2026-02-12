import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { ApiService } from '../../core/services/api-service.service';
import {
  IrregularFlightItem,
  IrregularInboundFlight,
} from '../../models/irregular-inbound-flight.model';
import { TabType } from '../../core/enums/tab-type.enum';
import { Option } from '../../shared/components/dropdown/dropdown.component';
import { environment } from '../../../environments/environment';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  EMPTY,
  filter,
  interval,
  merge,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { CommonService } from '../../core/services/common.service';
import { MOCK_IRREGULAR_INBOUND } from './mock-data';

export interface FlightTableItem {
  flightNumber: string;
  direction: string;
  spot: string;
  gate: string;
  scheduledArrival: string;
  estimateArrival: string;
  actualArrival: string;
  delayTime: string;
  status: string;
  reason: string;
  handle: string;
}

@Component({
  selector: 'app-daily-abnormal-flight-info',
  imports: [CommonModule, DropdownComponent],
  templateUrl: './daily-abnormal-flight-info.component.html',
  styleUrl: './daily-abnormal-flight-info.component.scss',
})
export class DailyAbnormalFlightInfoComponent {
  activeIndex: number = 0;

  data = [
    {
      label: '國際兩岸線',
      value: TabType.NONDOMESTIC,
    },
    {
      label: '國際線',
      value: TabType.INTL,
    },
    {
      label: '兩岸線',
      value: TabType.CROSSSTRAIT,
    },
    {
      label: '國內線',
      value: TabType.DOMESTIC,
    },
    {
      label: '總數',
      value: TabType.ALL,
    },
  ];

  table: FlightTableItem[] = [];

  actualFlight: number = 0;
  actualPax: number = 0;
  estFlight: number = 0;
  estPax: number = 0;

  /** 下載 CSV */
  baseUrl = environment.apiBaseUrl + '/IrregularInboundFlightExport';
  csvUrl = '';
  airportCode = '';
  airportName = '';

  mobileOptions: Option[] = [
    {
      label: '國際兩岸線',
      value: 0,
    },
    {
      label: '國際線',
      value: 1,
    },
    {
      label: '兩岸線',
      value: 2,
    },
    {
      label: '國內線',
      value: 3,
    },
    {
      label: '總數',
      value: 4,
    },
  ];

  /** 異常狀態下拉選單 */
  flightStatusOptions: Option[] = [];
  flightStatusDefault = '';

  /** 飛航類型下拉選單 */
  flightDirectionOptions = [
    { label: '全部', value: 'all' },
    { label: '離站', value: 'outbound' },
    { label: '到站', value: 'inbound' },
  ];

  /** Get 請求用的參數：異常狀態 */
  paramDelayCode = null;
  /** Get 請求用的參數：飛航類型 */
  paramDirection = 'all';

  // #FFED97 淡黃
  // #FF8040 淡紅
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
  ) {
    this.commonService
      .getSelectedAirport()
      .pipe(
        takeUntil(this.destroy$),
        filter(Boolean),
        distinctUntilChanged(),
        switchMap((airportId) => {
          this.airportCode = airportId;
          this.airportName =
            this.commonService.getSelectedAirportName(airportId);

          return merge(this.refreshTrigger$, interval(30000)).pipe(
            startWith(0),
            switchMap(() =>
              this.getIrregularInboundFlight().pipe(
                catchError((err) => {
                  console.error('auto refresh error', err);
                  return EMPTY;
                }),
              ),
            ),
          );
        }),
      )
      .subscribe((res) => {
        if (!res) return;
        this.setTableData(res);
        this.setCSVUrl();
      });
  }

  ngOnInit(): void {
    // 假資料
    // this.setTableData(MOCK_IRREGULAR_INBOUND);
    this.apiService.getFlightStatus().subscribe((res) => {
      this.flightStatusOptions = res
        .filter((item) => item.normal == 0)
        .map((item) => ({ label: item.title, value: item.id }));
      this.flightStatusOptions.unshift({ label: '全部', value: '' });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** 取得 api 資料 */
  getIrregularInboundFlight(): Observable<IrregularInboundFlight> {
    const airportValue = this.data[this.activeIndex]?.value;
    if (!airportValue) return EMPTY;

    return this.apiService.getIrregularInboundFlight(
      airportValue,
      this.paramDirection,
      this.paramDelayCode,
    );
  }

  /** 設定表格資料 */
  setTableData(data: IrregularInboundFlight) {
    this.table = [];
    this.actualFlight = 0;
    this.actualPax = 0;
    this.estFlight = 0;
    this.estPax = 0;

    data.flightinfo.forEach((item: IrregularFlightItem, index: number) => {
      const isInbound = item.arrivalPort === this.airportName;
      this.table.push({
        flightNumber: item.flightNo,
        direction: isInbound ? '到站' : '離站',
        spot: isInbound ? item.departurePort : item.arrivalPort,
        gate: item.gate,
        scheduledArrival: item.sta,
        estimateArrival: item.eta,
        actualArrival: item.ata,
        delayTime: item.delay,
        status: item.status,
        reason: item.reason,
        handle: item.handle,
      });
    });

    this.actualFlight = data.actualFlight;
    this.actualPax = data.actualPax;
    this.estFlight = data.estFlight;
    this.estPax = data.estPax;
  }

  setCSVUrl() {
    this.csvUrl =
      this.baseUrl +
      `/${this.data[this.activeIndex].value}/${this.paramDirection}` +
      (this.paramDelayCode ? `/${this.paramDelayCode}` : '') +
      `?currAirport=${this.airportCode}`;

    console.log(this.csvUrl);
  }

  onTabClick(newIndex: number) {
    this.activeIndex = newIndex;
    this.refreshTrigger$.next();
  }

  onFlightStatusChange(option: Option) {
    this.paramDelayCode = option.value;
    this.refreshTrigger$.next();
  }

  onFlightDirectionChange(option: Option) {
    this.paramDirection = option.value;
    this.refreshTrigger$.next();
  }

  delayStyle(delay: string): string {
    if (Number(delay) >= 30 && Number(delay) < 60) {
      return '30';
    } else if (Number(delay) >= 60) {
      return '60';
    }
    return '';
  }
}
