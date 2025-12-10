import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-css-bar-chart',
  imports: [CommonModule],
  templateUrl: './css-bar-chart.component.html',
  styleUrl: './css-bar-chart.component.scss'
})
export class CssBarChartComponent {

  @Input()size: 'sm' | 'lg' = 'lg';
  @Input()colorClass = 'bg-[#02b3e5]';
  @Input()labels = ['實際人數', '預報人數'];
  @Input()chartData = [
    { label: '項目 1', value: 5000, total: 10000 },
    { label: '項目 2', value: 70, total: 100 },
    { label: '項目 3', value: 90, total: 100 },
    { label: '項目 4', value: 40, total: 100 },
    { label: '項目 5', value: 60, total: 100 },
  ];
}
