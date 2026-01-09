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
import { PostTaxiRequest, TaxiInfo } from '../../../../../models/taxi.model';

@Component({
  selector: 'app-create-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.scss',
})
export class CreateFormComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private taxiService: TaxiService) {}

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
    const payload: PostTaxiRequest = {
      regPlate: this.form.value.regPlate,
      driverNo: this.form.value.driverNo,
      driverName: this.form.value.driverName,
      driverPhone: this.form.value.driverPhone,
      remark: '',
      status: ''
    };
    this.apiService.postTaxi(payload).subscribe(() => {
      this.taxiService.afterCreateTaxi(payload);
    });
  }
}
