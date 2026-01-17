import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chart-tooltip',
  imports: [CommonModule],
  templateUrl: './chart-tooltip.component.html',
  styleUrl: './chart-tooltip.component.scss',
})
export class ChartTooltipComponent {
  items!: { label: string; value: string | number; color: string }[];
  unitText: string = '';
}
