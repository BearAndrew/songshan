import { Component } from '@angular/core';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-daily-flight-analysis',
  imports: [DropdownComponent],
  templateUrl: './daily-flight-analysis.component.html',
  styleUrl: './daily-flight-analysis.component.scss',
})
export class DailyFlightAnalysisComponent {
  cities = [
    { label: 'Taipei', value: 1 },
    { label: 'Taichung', value: 2 },
    { label: 'Kaohsiung', value: 3 },
  ];

  onCityChange(sel: any) {
    console.log(sel);
  }
}
