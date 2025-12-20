import { Component, Input } from '@angular/core';
import { ForecastInput } from '../../../../models/forcast-input.model';

@Component({
  selector: 'app-forecast-card',
  imports: [],
  standalone: true,
  templateUrl: './forecast-card.component.html',
  styleUrl: './forecast-card.component.scss'
})
export class ForecastCardComponent {
  @Input() data: ForecastInput | null = null;
}