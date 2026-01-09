import { ApiService } from './../../../../../core/services/api-service.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-create-form',
  imports: [],
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.scss'
})
export class CreateFormComponent {

  constructor(private apiService: ApiService) {}

  /** 送出呼叫API */
  onSubmit() {

  }
}
