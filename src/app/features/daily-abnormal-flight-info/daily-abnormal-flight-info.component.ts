import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { ApiService } from '../../core/services/api-service.service';
import { CommonService } from '../../core/services/common.service';
import { IrregularFlightItem, IrregularInboundFlight } from '../../models/irregular-inbound-flight.model';

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
    this.getIrregularInboundFlight(this._activeIndex);
  }
  data = [
    {
      label: '國際兩岸線',
      value: 'nondomestic',
    },
    {
      label: '國際線',
      value: 'intl',
    },
    {
      label: '兩岸線',
      value: 'crossstrait',
    },
    {
      label: '國內線',
      value: 'domestic',
    },
    {
      label: '總數',
      value: 'all',
    },
  ];

  table: {
    flightNumber: string;
    origin: string;
    gate: string;
    scheduledArrival: string;
    actualArrival: string;
    delayTime: string;
    issue: string;
    plannedAction: string;
    actualAction: string;
  }[] = [];

  actualFlight: number = 0;
  actualPax: number = 0;
  estFlight: number = 0;
  estPax: number = 0;

  dropdownOptions = [{ label: '全部', value: 0 }];

  constructor(
    private apiService: ApiService, ) {
    // initial load
    this.getIrregularInboundFlight(this.activeIndex);
  }

  // note: ngOnChanges won't fire for internal property assignment
  // (it's only for @Input() changes). We use the setter above instead.

  getIrregularInboundFlight(activeIndex: number) {
    // clear previous table rows before loading new data
    this.table = [];

    this.actualFlight = 0;
    this.actualPax = 0;
    this.estFlight = 0;
    this.estPax = 0;

    this.apiService
      .getIrregularInboundFlight(this.data[activeIndex].value)
      .subscribe((res) => {
        this.setTableData(res);
      });
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
        issue: item.reason,
        plannedAction: item.estHandle,
        actualAction: item.actualHandle,
      });
    });

    this.actualFlight = data.actualFlight;
    this.actualPax = data.actualPax;
    this.estFlight = data.estFlight;
    this.estPax = data.estPax;
  }

  onTabClick(newIndex: number) {
    this.activeIndex = newIndex;
    this.getIrregularInboundFlight(newIndex);
  }
}
