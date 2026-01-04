import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {
  Color,
  DataSetWithData,
  DefaultDataColorArray,
  LabelDispalyMode,
  PieChart,
} from '../../../core/lib/chart-tool';
import { randomId } from '../../../core/utils/random';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pie-chart',
  imports: [CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent {
  @Input() data: DataSetWithData[] = [];
  @Input() centerLabel: string | number = '';
  @Input() textColor: string = '';
  @Input() fontSize: string = '32px';
  @Input() flexDirection: 'v' | 'h' = 'v';
  @Input() showLegend: boolean = true;
  id: string;
  private pieChart!: PieChart;
  colorArray: Color[] = [];

  constructor() {
    this.id = '_' + randomId();
  }

  get formattedCenterLabel(): string | number {
    return typeof this.centerLabel === 'number'
      ? new Intl.NumberFormat().format(this.centerLabel) // Angular number pipe 等效
      : this.centerLabel;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']?.firstChange) {
      return;
    }
    this.draw();
  }

  ngAfterViewInit(): void {
    this.pieChart = new PieChart('div#pie-chart' + this.id);
    this.pieChart.setDataSets(this.data);
    const radial = this.pieChart.getRadialFactory();
    const pie = this.pieChart.getPieFactory();
    radial.setConfig({
      labelFontConfig: {
        'font-size': '20px',
        'font-family': '',
        'font-weight': '400',
        color: '#fff',
      },
      labelOffset: 8,
      labelDispalyMode: LabelDispalyMode.ValueOnly,
    });
    pie.setConfig({ donutWidthRatio: 0.3 });
    setTimeout(() => {
      this.draw();
    }, 0);
  }

  draw() {
    // console.log(this.data)
    this.colorArray = this.data.map((item, index) => {
      let colors: Color;
      if (item.colors) {
        colors = { color: item.colors[0], opacity: 1 };
      } else {
        colors = DefaultDataColorArray[index][0] || [{ color: '', opacity: 1 }];
      }
      return colors;
    });
    this.pieChart.setDataSets(this.data);
    this.pieChart.drawChart();
  }
}
