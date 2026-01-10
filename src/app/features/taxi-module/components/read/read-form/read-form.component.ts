import { ApiService } from './../../../../../core/services/api-service.service';
import { Component } from '@angular/core';
import { DropdownSecondaryComponent } from '../../../../../shared/components/dropdown-secondary/dropdown-secondary.component';
import { Option } from '../../../../../shared/components/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { TaxiService } from '../../../service/taxi.service';
import { SearchTaxiData } from '../../../service/taxi.interface';
import { taxiInfoFakeData } from './fake-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-read-form',
  imports: [CommonModule, DropdownSecondaryComponent],
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

  top6Options: Option[] = [{ label: '出勤次數', value: '' }];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private taxiService: TaxiService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      regPlate: ['', Validators.required],
      driverNo: [''],
      driverName: [''],
      driverPhone: [''],
      remark: [''],
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


}
