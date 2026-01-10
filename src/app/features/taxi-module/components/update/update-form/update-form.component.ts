import { SearchTaxiData } from './../../../service/taxi.interface';
import { Component } from '@angular/core';
import { ApiService } from '../../../../../core/services/api-service.service';
import { DropdownSecondaryComponent } from '../../../../../shared/components/dropdown-secondary/dropdown-secondary.component';
import { Option } from '../../../../../shared/components/dropdown/dropdown.component';
import { CalendarTriggerComponent } from '../../../../../shared/components/calendar-trigger/calendar-trigger.component';
import { TaxiService } from '../../../service/taxi.service';
import { TaxiInfo } from '../../../../../models/taxi.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { fakeData } from './fake-data';

@Component({
  selector: 'app-update-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DropdownSecondaryComponent,
    CalendarTriggerComponent,
  ],
  templateUrl: './update-form.component.html',
  styleUrl: './update-form.component.scss',
})
export class UpdateFormComponent {
  form!: FormGroup;

  options: Option[] = [
    { label: '變更為無違規紀錄', value: '0' },
    { label: '加入黑名單', value: '1' },
  ];
  modifyContentOption: Option = { label: '變更為無違規紀錄', value: '0' };

  hasSearch: boolean = false;

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

  /** 查詢資料 */
  onSearch() {
    this.hasSearch = true;
    const searchTaxiData: SearchTaxiData = {
      searchRegPlate: this.form.value.regPlate,
      taxiInfoList: fakeData.map((item) => ({
        ...item,
        modifyContent: this.modifyContentOption, // 修改內容 欄位
        suspensionPeriod: '', // 新增欄位
      })),
    };
    this.form.controls['remark'].setValue(searchTaxiData.taxiInfoList[0].remark);
    this.form.controls['driverNo'].setValue(searchTaxiData.taxiInfoList[0].driverNo);
    this.taxiService.afterSearchTaxi(searchTaxiData);
    return;

    this.apiService.searchTaxi(this.form.value.regPlate).subscribe((res) => {
      this.hasSearch = true;
      const searchTaxiData: SearchTaxiData = {
        searchRegPlate: this.form.value.regPlate,
        taxiInfoList: res.map((item) => ({
          ...item,
          modifyContent: this.modifyContentOption, // 新增欄位
          suspensionPeriod: '', // 新增欄位
        })),
      };
      this.form.controls['remark'].setValue(searchTaxiData.taxiInfoList[0].remark);
      this.taxiService.afterSearchTaxi(searchTaxiData);
    });
  }

  /** 呼叫查詢API */
  onSubmit() {}

  /** 呼叫修改API */
  onModify() {

  }

  /** 日期更改 */
  onDateChange(type: 'start' | 'end', event: Date) {}
}
