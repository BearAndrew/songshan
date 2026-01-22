import { SearchTaxiData } from './../../../service/taxi.interface';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../../../core/services/api-service.service';
import { DropdownSecondaryComponent } from '../../../../../shared/components/dropdown-secondary/dropdown-secondary.component';
import { Option } from '../../../../../shared/components/dropdown/dropdown.component';
import { CalendarTriggerComponent } from '../../../../../shared/components/calendar-trigger/calendar-trigger.component';
import { TaxiService } from '../../../service/taxi.service';
import { TaxiInfo, TaxiViolation } from '../../../../../models/taxi.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { fakeData } from './fake-data';
import { parseTwDateTime } from '../../../../../core/utils/parse-tw-datetime';
import { take } from 'rxjs';
import { CommonService } from '../../../../../core/services/common.service';

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
  @Input() editTaxiInfo!: TaxiInfo;

  form!: FormGroup;

  options: Option[] = [];
  modifyContentOption: Option = { label: '變更為無違規紀錄', value: '0' };

  hasSearch: boolean = false;
  hasError: boolean = false;
  rid: number = 0;
  // 用於回傳後端
  dateFrom: string = '';
  dateTo: string = '';
  // 用於 calendar
  dateStart: Date | null = null;
  dateEnd: Date | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private taxiService: TaxiService,
    private commonService: CommonService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editTaxiInfo']?.currentValue && this.form) {
      this.patchForm(changes['editTaxiInfo'].currentValue);
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      regPlate: ['', Validators.required],
      driverNo: [''],
      driverName: [''],
      driverPhone: [''],
      remark: [''],
    });

    if (this.editTaxiInfo) {
      this.patchForm(this.editTaxiInfo);
    }
  }

  private patchForm(taxi: TaxiInfo): void {
    this.form.patchValue({
      regPlate: taxi.regPlate,
      driverNo: taxi.driverNo,
      driverName: taxi.driverName,
      driverPhone: taxi.driverPhone,
      remark: taxi.remark,
    });
    const searchTaxiData: SearchTaxiData = {
      searchRegPlate: this.form.value.regPlate,
      taxiInfoList: [this.editTaxiInfo],
    };
    this.searchSuccess(searchTaxiData);
  }

  /** 查詢資料 */
  onSearch() {
    this.apiService.searchTaxi(this.form.value.regPlate).subscribe((res) => {
      const searchTaxiData: SearchTaxiData = {
        searchRegPlate: this.form.value.regPlate,
        taxiInfoList: res,
      };

      if (res.length == 0 || res.length > 1) {
        this.taxiService.afterSearchTaxi(searchTaxiData);
        this.hasSearch = false;
        return;
      }

      this.searchSuccess(searchTaxiData);
    });

    const updateInfo: TaxiInfo = {
      regPlate: '',
      driverNo: '',
      driverName: '',
      driverPhone: '',
      remark: '',
      status: null,
      startDate: '',
      endDate: '',
    };
    this.taxiService.setUpdate(updateInfo);
  }

  searchSuccess(searchTaxiData: SearchTaxiData) {
    this.hasSearch = true;

    if (
      searchTaxiData.taxiInfoList[0].status?.includes('BLACKLIST') ||
      searchTaxiData.taxiInfoList[0].status?.includes('GREYLIST')
    ) {
      this.apiService.getTaxiViolationAll('ALL').subscribe((res) => {
        const taxiInfo = res.find(
          (item) => item.regPlate == searchTaxiData.taxiInfoList[0].regPlate,
        );
        console.log(taxiInfo);
        this.rid = taxiInfo?.rid || 0;

        this.options = [];
        if (taxiInfo?.violationType.includes('BLACKLIST')) {
          this.options.push({ label: '更新黑名單', value: '3' });
        }
        if (taxiInfo?.violationType.includes('GREYLIST')) {
          this.options.push({ label: '更新灰名單', value: '4' });
        }
        this.options.push({ label: '變更為無違規紀錄', value: '0' });
        this.modifyContentOption = this.options[0];

        this.dateStart = parseTwDateTime(taxiInfo?.dateFrom);
        this.dateEnd = parseTwDateTime(taxiInfo?.dateTo);
        this.onDateChange('start', this.dateStart);
        this.onDateChange('end', this.dateEnd);

        searchTaxiData.taxiInfoList[0]['startDate'] = this.formatDate(
          this.dateStart,
        );
        searchTaxiData.taxiInfoList[0]['endDate'] = this.formatDate(
          this.dateEnd,
        );
        this.taxiService.afterSearchTaxi(searchTaxiData);
      });
    } else {
      this.options = [
        { label: '加入黑名單', value: '1' },
        { label: '加入灰名單', value: '2' },
      ];
      this.modifyContentOption = this.options[0];
      this.dateStart = null;
      this.dateEnd = null;

      this.form.controls['remark'].setValue(
        searchTaxiData.taxiInfoList[0].remark,
      );
      this.form.controls['driverNo'].setValue(
        searchTaxiData.taxiInfoList[0].driverNo,
      );
      this.taxiService.afterSearchTaxi(searchTaxiData);
    }
  }

  /** 呼叫修改API */
  onModify() {
    if (!this.dateFrom || !this.dateTo) {
      this.hasError = true;
      return;
    }
    let status = '';
    switch (this.modifyContentOption.value) {
      case '0': {
        this.apiService.deleteTaxiViolation(this.rid).subscribe(() => {});
        break;
      }

      case '1':
        this.addViolationList('BLACKLIST');
        status = 'BLACKLIST';
        break;

      case '2':
        this.addViolationList('GREYLIST');
        status = 'GREYLIST';
        break;

      case '3':
        this.updateViolationList('BLACKLIST');
        status = 'BLACKLIST';
        break;

      case '4':
        this.updateViolationList('GREYLIST');
        status = 'GREYLIST';
        break;
    }

    const updateInfo: TaxiInfo = {
      regPlate: this.form.value.regPlate,
      driverNo: this.form.value.driverNo,
      driverName: '',
      driverPhone: '',
      remark: '',
      status: status,
      startDate: this.dateFrom,
      endDate: this.dateTo,
    };
    this.taxiService.setUpdate(updateInfo);
  }

  addViolationList(type: 'BLACKLIST' | 'GREYLIST') {
    const payload: TaxiViolation = {
      rid: 0,
      regPlate: this.form.value.regPlate,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      violationType: type,
      reason: this.form.value.remark,
      driver_no: this.form.value.driverNo,
      driver_name: this.form.value.driverName,
    };
    this.apiService.postTaxiViolation(payload).subscribe(() => {});
  }

  updateViolationList(type: 'BLACKLIST' | 'GREYLIST') {
    const payload: TaxiViolation = {
      rid: 0,
      regPlate: this.form.value.regPlate,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      violationType: type,
      reason: this.form.value.remark,
      driver_no: this.form.value.driverNo,
      driver_name: this.form.value.driverName,
    };
    this.apiService.updateTaxiViolation(this.rid, payload).subscribe(() => {});
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
    if (this.dateFrom && this.dateTo) {
      this.hasError = false;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // ✔ 檢查是否為 Excel
    const isExcel =
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';

    if (!isExcel) {
      this.commonService
        .openDialog({
          message: '請上傳 Excel 檔案 (.xls, .xlsx)',
          confirmText: '確定',
          cancelText: '',
        })
        .pipe(take(1))
        .subscribe();
      input.value = '';
      return;
    }

    // ✔ 建立 FormData
    const formData = new FormData();
    formData.append('file', file);

    // ✔ 呼叫 API
    this.apiService.importTaxi(formData).subscribe({
      next: (res) => {
        this.commonService
          .openDialog({
            message: 'Excel 匯入成功',
            confirmText: '確定',
            cancelText: '',
          })
          .pipe(take(1))
          .subscribe();
        input.value = ''; // 清空 input，避免同檔案無法再選
      },
      error: (err) => {
        this.commonService
          .openDialog({
            title: 'Excel 匯入失敗',
            message: '錯誤訊息:' + err,
            confirmText: '確定',
            cancelText: '',
          })
          .pipe(take(1))
          .subscribe();
      },
    });
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
  }
}
