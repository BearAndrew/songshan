import { Component } from '@angular/core';
import { DropdownSecondaryComponent } from '../../../../../shared/components/dropdown-secondary/dropdown-secondary.component';
import { Option } from '../../../../../shared/components/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-read-form',
  imports: [CommonModule, DropdownSecondaryComponent],
  templateUrl: './read-form.component.html',
  styleUrl: './read-form.component.scss',
})
export class ReadFormComponent {
  options: Option[] = [
    { label: '計程車資訊查詢', value: '0' },
    { label: '黑名單清單', value: '1' },
    { label: '灰名單清單', value: '2' },
    { label: '出勤前六名', value: '3' },
  ];

  searchCondition: string = '0';

  top6Options: Option[] = [{ label: '出勤次數', value: '' }];

  /** 送出呼叫API */
  onSubmit() {}
}
