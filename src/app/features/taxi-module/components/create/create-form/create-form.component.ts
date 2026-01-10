import { TaxiService } from './../../../service/taxi.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from './../../../../../core/services/api-service.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxiInfo } from '../../../../../models/taxi.model';

@Component({
  selector: 'app-create-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.scss',
})
export class CreateFormComponent {
  form!: FormGroup;

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
    });
  }

  onSubmit() {
    // 可檢核
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }

    console.log('送出資料', this.form.value);
    const payload: TaxiInfo = {
      regPlate: this.form.value.regPlate,
      driverNo: this.form.value.driverNo,
      driverName: this.form.value.driverName,
      driverPhone: this.form.value.driverPhone,
      remark: '',
      status: '',
    };
    this.apiService.postTaxi(payload).subscribe(() => {
      this.taxiService.afterCreateTaxi(payload);
    });
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
      alert('請上傳 Excel 檔案 (.xls, .xlsx)');
      input.value = '';
      return;
    }

    // ✔ 建立 FormData
    const formData = new FormData();
    formData.append('file', file);

    // ✔ 呼叫 API
    this.apiService.importTaxi(formData).subscribe({
      next: (res) => {
        console.log('匯入成功', res);
        alert('Excel 匯入成功');
        input.value = ''; // 清空 input，避免同檔案無法再選
      },
      error: (err) => {
        console.error('匯入失敗', err);
        alert('Excel 匯入失敗');
      },
    });
  }
}
