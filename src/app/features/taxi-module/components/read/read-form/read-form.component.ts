import { ApiService } from './../../../../../core/services/api-service.service';
import { Component } from '@angular/core';
import { DropdownSecondaryComponent } from '../../../../../shared/components/dropdown-secondary/dropdown-secondary.component';
import { Option } from '../../../../../shared/components/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { TaxiService } from '../../../service/taxi.service';
import { SearchTaxiData } from '../../../service/taxi.interface';
import { taxiInfoFakeData } from './fake-data';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalendarTriggerComponent } from '../../../../../shared/components/calendar-trigger/calendar-trigger.component';

@Component({
  selector: 'app-read-form',
  imports: [CommonModule, DropdownSecondaryComponent, CalendarTriggerComponent],
  templateUrl: './read-form.component.html',
  styleUrl: './read-form.component.scss',
})
export class ReadFormComponent {
  form!: FormGroup;

  options: Option[] = [
    { label: '計程車資訊查詢', value: '0' },
    { label: '黑名單清單', value: '1' },
    { label: '灰名單清單', value: '2' },
    { label: '出勤前六名', value: '3' },
  ];

  searchCondition: string = '0';

  top6Options: Option[] = [
    { label: '排名', value: '排名' },
    { label: '車號', value: '車號' },
    { label: '駕駛姓名', value: '駕駛姓名' },
    { label: '出勤次數', value: '出勤次數' },
  ];
  top6SortType: string = '排名';

  dateFrom: string = '';
  dateTo: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private taxiService: TaxiService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      regPlate: [''],
      driverNo: [''],
    });
  }

  onReadTypeChange(event: Option) {
    this.searchCondition = event.value;
    this.taxiService.afterReadType(this.searchCondition);
  }

  /** 送出呼叫API */
  onSubmit() {
    switch (this.searchCondition) {
      case '0':
        this.searchTaxi();
        break;
      case '1':
        this.searchViolationList('BLACKLIST');
        break;
      case '2':
        this.searchViolationList('GREYLIST');
        break;
      case '3':
        this.searchTop6();
    }
  }

  searchTaxi() {
    // const searchTaxiData: SearchTaxiData = {
    //   searchRegPlate: this.form.value.regPlate,
    //   taxiInfoList: taxiInfoFakeData.map((item) => ({
    //     ...item,
    //   })),
    // };
    // this.taxiService.afterSearchTaxi(searchTaxiData);
    // return;

    this.apiService.searchTaxi(this.form.value.regPlate).subscribe((res) => {
      const searchTaxiData: SearchTaxiData = {
        searchRegPlate: this.form.value.regPlate,
        taxiInfoList: res.map((item) => ({
          ...item,
        })),
      };
      this.taxiService.afterSearchTaxi(searchTaxiData);
    });
  }

  searchViolationList(type: string) {
    this.apiService.getTaxiViolationAll(type).subscribe((res) => {
      this.taxiService.afterSearchViolationList(res);
    });
  }

  searchTop6() {
    this.apiService
      .getTop6Taxi(this.top6SortType, this.dateFrom, this.dateTo)
      .subscribe((res) => {
        this.taxiService.afterTop6(res);
      });
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
}
