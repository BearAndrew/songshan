import { BarFactory } from '../../factory/grid/bar/bar-factory/bar-factory';
import { GridFactory } from '../../factory/grid/grid/grid-factory';
import { GridlineFactory } from '../../factory/grid/gridline/gridline-factory';
import { DataSetWithDataArray } from '../../interface/common.interface';
import { RootChart } from '../root-chart';
/** 基礎長條圖 */
export declare class BarChart extends RootChart {
    private gridFactory;
    private gridlineFactory;
    private barFactory;
    private barDataSetWithDataArray;
    private isUseGridlineFactory;
    private isUseBarFactory;
    constructor(selector: string);
    protected setFactory(): void;
    /** 設定資料 */
    setDataSets(dataSets: DataSetWithDataArray[], isStack?: boolean): BarChart;
    /** 設定要使用的 GridFactory */
    setGridFactory(gridFactory: GridFactory): BarChart;
    /** 設定要使用的 GridlineFactory */
    setGridlineFactory(gridlineFactory: GridlineFactory): BarChart;
    /** 設定要使用的 BarFactory */
    setBarFactory(barFactory: BarFactory): BarChart;
    getGridFactory(): GridFactory;
    getGridlineFactory(): GridlineFactory;
    getBarFactory(): BarFactory;
    drawChart(useAnimation?: boolean): void;
}
