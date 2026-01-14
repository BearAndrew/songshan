import { Component, Input, SimpleChanges } from '@angular/core';
import {
  BarLineChart,
  Color,
  DataSetWithDataArray,
  DefaultDataColorArray,
} from '../../../core/lib/chart-tool';
import { randomId } from '../../../core/utils/random';
import { CommonModule } from '@angular/common';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChartTooltipComponent } from '../chart-tooltip/chart-tooltip.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';

@Component({
  selector: 'app-bar-line-chart',
  imports: [CommonModule],
  templateUrl: './bar-line-chart.component.html',
  styleUrl: './bar-line-chart.component.scss',
})
export class BarLineChartComponent {
  @Input() barData: DataSetWithDataArray[] = [];
  @Input() lineData: DataSetWithDataArray[] = [];
  @Input() flexDirection: 'v' | 'h' = 'v';
  @Input() showLegend: boolean = true;

  id: string;
  private barLineChart!: BarLineChart;
  colorArray: string[] = [];
  private overlayRef!: OverlayRef;

  constructor(private overlay: Overlay) {
    this.id = '_' + randomId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // 判斷 barData 和 lineData 是否有變化，並且不是第一次初始化
    const barChanged = changes['barData'] && !changes['barData'].firstChange;
    const lineChanged = changes['lineData'] && !changes['lineData'].firstChange;

    if (barChanged || lineChanged) {
      setTimeout(() => {
        this.barLineChart.setBarDataSets(this.barData);
        this.barLineChart.setLineDataSets(this.lineData);
        this.draw();
      }, 0);
    }
  }

  ngAfterViewInit(): void {
    this.barLineChart = new BarLineChart('div#bar-line-chart' + this.id);
    this.barLineChart.getDotFactory().setRadius(0);
    this.barLineChart.getBarFactory().setConfig({ borderRadius: 0 });
    const gridFactory = this.barLineChart.getGridFactory();
    gridFactory
      .setXLabelFont({ color: 'white' })
      .setYLabelFont({ color: 'white' })
      .setHover(true)
      .setShowActiveArea(false);

    gridFactory.onPointerover().subscribe((res) => {
      this.handlePointerOver(res);
    });

    gridFactory.onPointerout().subscribe(() => {
      this.hideTooltip();
    });

    this.barLineChart.setBarDataSets(this.barData);
    this.barLineChart.setLineDataSets(this.lineData);
    this.draw();
  }

  draw() {
    this.colorArray = this.barData.map((item, index) => {
      let colors: string;
      if (item.colors) {
        colors = item.colors[0];
      } else {
        colors = DefaultDataColorArray[index][0].color || '';
      }
      return colors;
    });
    this.barLineChart.drawChart();
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

    const isRightSide = res.keyIndex < this.barData[0].data.length / 2;

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

    tooltipRef.instance.items = this.buildTooltipItems(res.keyIndex);
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

  private buildTooltipItems(keyIndex: number) {
    const items: {
      label: string;
      value: string | number;
      color: string;
    }[] = [];

    for (let i = 0; i < this.barData.length; i++) {
      items.push({
        label: this.barData[i].label,
        value: this.barData[i].data[keyIndex]?.value ?? 0,
        color: this.barData[i].colors?.[0] ?? ''
      });

      items.push({
        label: this.lineData[i].label,
        value: this.lineData[i].data[keyIndex]?.value ?? 0,
        color: this.lineData[i].colors?.[0] ?? ''
      });
    }

    return items;
  }

  private hideTooltip() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null!;
    }
  }
}
