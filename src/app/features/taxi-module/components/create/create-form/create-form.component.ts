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
import { CommonService } from '../../../../../core/services/common.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-create-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.scss',
})
export class CreateFormComponent {
  form!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      regPlate: ['', Validators.required],
      driverNo: ['', Validators.required],
      driverName: ['', Validators.required],
      driverPhone: ['', Validators.required],
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && this.submitted);
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: TaxiInfo = {
      regPlate: this.form.value.regPlate,
      driverNo: this.form.value.driverNo,
      driverName: this.form.value.driverName,
      driverPhone: this.form.value.driverPhone,
      remark: '',
      status: '',
    };

    this.apiService.postTaxi(payload).subscribe(
      () => {
        this.commonService
          .openDialog({
            title: '建立成功',
            message: `車號：${this.form.value.regPlate}
            編號：${this.form.value.driverNo}
            姓名：${this.form.value.driverName}
            聯絡電話：${this.form.value.driverPhone}`,
            confirmText: '確定',
            cancelText: '',
          })
          .pipe(take(1))
          .subscribe();
      },
      (err) => {
        this.commonService
          .openDialog({
            title: '建立失敗',
            message: '已有相同車號',
            confirmText: '確定',
            cancelText: '',
          })
          .pipe(take(1))
          .subscribe();
      },
    );
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
            message: err.error,
            confirmText: '確定',
            cancelText: '',
          })
          .pipe(take(1))
          .subscribe();
      },
    });
  }
}
