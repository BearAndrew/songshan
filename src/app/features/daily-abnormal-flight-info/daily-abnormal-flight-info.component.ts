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

  MOCK_IRREGULAR_INBOUND: IrregularInboundFlight = {
    flightinfo: [
      {
        flightNo: 'CI123',
        departurePort: '東京成田',
        gate: 'A12',
        sta: '2026-01-02 08:30',
        ata: '2026-01-02 09:10',
        delay: '40 分鐘',
        status: '延誤',
        reason: '天候不佳',
        handle: '已通知旅客',
      },
      {
        flightNo: 'BR807',
        departurePort: '香港',
        gate: 'B5',
        sta: '2026-01-02 10:00',
        ata: '2026-01-02 10:45',
        delay: '45 分鐘',
        status: '延誤',
        reason: '機務檢修',
        handle: '安排餐點',
      },
      {
        flightNo: 'JL809',
        departurePort: '大阪關西',
        gate: 'C3',
        sta: '2026-01-02 11:20',
        ata: '2026-01-02 11:20',
        delay: '準點',
        status: '已到達',
        reason: '—',
        handle: '正常作業',
      },
    ],
    actualFlight: 3,
    actualPax: 420,
    estFlight: 4,
    estPax: 560,
  };

  constructor(private apiService: ApiService) {
    this.getIrregularInboundFlight();
  }

  ngOnInit(): void {
    this.apiService.getFlightStatus().subscribe((res) => {
      this.flightStatusOptions = res
        .filter((item) => item.normal === 0)
        .map((item) => ({
          label: item.title,
          value: item.id,
          normal: item.normal, // 保留額外資訊（可選）
        }));

        this.flightStatusOptions.unshift({ label: '全部', value: '', normal: 0});
    });
  }

  getIrregularInboundFlight() {
    // console.trace();
    // this.setTableData(this.MOCK_IRREGULAR_INBOUND);
    // return;

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
    this.table = [];
    this.actualFlight = 0;
    this.actualPax = 0;
    this.estFlight = 0;
    this.estPax = 0;

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
      `/${this.data[this.activeIndex].value}/${this.paramDirection}` +
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
