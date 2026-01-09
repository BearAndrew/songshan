import { Component } from '@angular/core';
import { ApiService } from '../../../../../core/services/api-service.service';
import { DropdownSecondaryComponent } from "../../../../../shared/components/dropdown-secondary/dropdown-secondary.component";
import { Option } from '../../../../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-update-form',
  imports: [DropdownSecondaryComponent],
  templateUrl: './update-form.component.html',
  styleUrl: './update-form.component.scss'
})
export class UpdateFormComponent {

  options: Option[] = [
    {label: '變更為無違規紀錄', value: '0'},
    {label: '加入黑名單', value: '1'},
  ];

  constructor(private apiService: ApiService) {}

  /** 送出呼叫API */
  onSubmit() {

  }
}
