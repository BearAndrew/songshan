import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-css-bar-chart',
  imports: [CommonModule],
  templateUrl: './css-bar-chart.component.html',
  styleUrl: './css-bar-chart.component.scss',
})
export class CssBarChartComponent {
  @Input() size: 'sm' | 'lg' = 'lg';
  @Input() colorClass = 'bg-[#02b3e5]';
  @Input() labels = ['實際人數', '預報人數'];
  @Input() chartData = [
    { label: '項目 1', value: 500, total: 10000 },
    { label: '項目 2', value: 70, total: 100 },
    { label: '項目 3', value: 90, total: 100 },
    { label: '項目 4', value: 40, total: 100 },
    { label: '項目 5', value: 60, total: 100 },
  ];

  @ViewChild('bar') barRef!: ElementRef<HTMLDivElement>;
  @ViewChild('label') labelRef!: ElementRef<HTMLDivElement>;

  getLabelStyle(barWidth: number, labelWidth: number) {
    const gap = 8;
    if (barWidth < labelWidth + gap) {
      // 進度條太小 → 顯示在進度條外面，並加 gap
      return {
        left: barWidth + gap + 'px',
        color: 'black',
      };
    } else {
      // 進度條寬度足夠 → 顯示在進度條內，保留 gap
      return {
        right: gap + 'px',
        color: 'white',
      };
    }
  }

  getPercent(data: any): number {
    return data.total ? (data.value / data.total) * 100 : 0;
  }
}
