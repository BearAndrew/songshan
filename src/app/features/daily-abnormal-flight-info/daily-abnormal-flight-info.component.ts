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

@Component({
  selector: 'app-daily-abnormal-flight-info',
  imports: [CommonModule, DropdownComponent],
  templateUrl: './daily-abnormal-flight-info.component.html',
  styleUrl: './daily-abnormal-flight-info.component.scss',
})
export class DailyAbnormalFlightInfoComponent {
  // use a private backing field and a setter so assignments like
  // (click)="activeIndex = i" will run our change logic automatically
  private _activeIndex = 0;

  get activeIndex(): number {
    return this._activeIndex;
  }

  set activeIndex(value: number) {
    if (this._activeIndex === value) return;
    this._activeIndex = value;
    // when activeIndex changes, reload data for that index
    this.getIrregularInboundFlight();
  }
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

  table: {
    flightNumber: string;
    origin: string;
    gate: string;
    scheduledArrival: string;
    actualArrival: string;
    delayTime: string;
    status: string;
    reason: string;
    handle: string;
  }[] = [];

  actualFlight: number = 0;
  actualPax: number = 0;
  estFlight: number = 0;
  estPax: number = 0;

  /** 下載 CSV */
  baseUrl = environment.apiBaseUrl + '/IrregularInboundFlightExport';
  csvUrl = '';

  /** 異常狀態下拉選單 */
  flightStatusOptions: Option[] = [];

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

  constructor(private apiService: ApiService) {
    // initial load
    this.getIrregularInboundFlight();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.apiService.getFlightStatus().subscribe((res) => {
      this.flightStatusOptions = res.map((item) => ({
        label: item.title,
        value: item.id,
        normal: item.normal, // 保留額外資訊（可選）
      }));
    });
  }

  // note: ngOnChanges won't fire for internal property assignment
  // (it's only for @Input() changes). We use the setter above instead.

  getIrregularInboundFlight() {
    // clear previous table rows before loading new data
    this.table = [];

    this.actualFlight = 0;
    this.actualPax = 0;
    this.estFlight = 0;
    this.estPax = 0;

    this.apiService
      .getIrregularInboundFlight(
        this.data[this.activeIndex].value,
        this.paramDirection,
        this.paramDelayCode
      )
      .subscribe((res) => {
        this.setTableData(res);
      });

    this.setCSVUrl();
  }

  setTableData(data: IrregularInboundFlight) {
    data.flightinfo.forEach((item: IrregularFlightItem, index: number) => {
      this.table.push({
        flightNumber: item.flightNo,
        origin: item.departurePort,
        gate: item.gate,
        scheduledArrival: item.sta,
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
      `/${this.data[this._activeIndex].value}/${this.paramDirection}` +
      (this.paramDelayCode ? `/${this.paramDelayCode}` : '');
  }

  onTabClick(newIndex: number) {
    this.activeIndex = newIndex;
    this.getIrregularInboundFlight();
  }

  /** 異常狀態選擇 */
  onFlightStatusChange(option: Option) {
    this.paramDelayCode = option.value;
    this.getIrregularInboundFlight();
  }

  /** 異常狀態選擇 */
  onFlightDirectionChange(option: Option) {
    this.paramDirection = option.value;
    this.getIrregularInboundFlight();
  }
}
