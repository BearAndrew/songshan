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
import { ComponentPortal } from '@angular/cdk/portal';
import { ChartTooltipComponent } from '../chart-tooltip/chart-tooltip.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';

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
  private overlayRef!: OverlayRef;

  constructor(private overlay: Overlay) {
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
    pie.setConfig({ donutWidthRatio: 0.3, isShowLabel: false });
    pie.onPointerover().subscribe((res) => {
      if (!res) {
        this.hideTooltip();
        return;
      }
      if (this.data.length < 1) return;
      this.handlePointerOver(res as any);
    });
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

  private handlePointerOver(res: {
    element: HTMLElement;
    keyIndex: number;
    data: any;
  }) {
    if (!res?.element) {
      return;
    }

    // 關閉舊 tooltip
    this.hideTooltip();

    // Pie：用 slice index 判斷左右
    const isRightSide = res.keyIndex < (this.data?.length ?? 0) / 2;

    const positionStrategy = this.createTooltipPosition(
      res.element,
      isRightSide
    );

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: '!pointer-events-none',
    });

    const tooltipPortal = new ComponentPortal(ChartTooltipComponent);
    const tooltipRef = this.overlayRef.attach(tooltipPortal);

    tooltipRef.instance.items = this.buildPieTooltipItems(res);
    tooltipRef.instance.unitText = this.data[0].unitText || '';
  }

  private buildPieTooltipItems(res: any) {
    return [
      {
        label: this.data[res.keyIndex].label,
        value: this.data[res.keyIndex].data.value ?? 0,
        color: this.data[res.keyIndex].colors?.[0] ?? '#999',
      },
    ];
  }
  private createTooltipPosition(element: HTMLElement, isRightSide: boolean) {
    return this.overlay
      .position()
      .flexibleConnectedTo(element)
      .withPositions([
        {
          originX: isRightSide ? 'end' : 'start',
          originY: 'center',
          overlayX: isRightSide ? 'start' : 'end',
          overlayY: 'center',
          offsetX: isRightSide ? 8 : -8,
        },
      ]);
  }

  private hideTooltip() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null!;
    }
  }
}
