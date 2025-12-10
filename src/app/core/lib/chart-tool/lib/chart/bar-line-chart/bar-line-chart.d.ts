import { BarFactory } from '../../factory/grid/bar/bar-factory/bar-factory';
import { GridFactory } from '../../factory/grid/grid/grid-factory';
import { DotFactory } from '../../factory/grid/line/dot-factory/dot-factory';
import { LineFactory } from '../../factory/grid/line/line-factory/line-factory';
import { DataSetWithDataArray } from '../../interface/common.interface';
import { RootChart } from '../root-chart';
import { GridlineFactory } from '../../factory/grid/gridline/gridline-factory';
export declare class BarLineChart extends RootChart {
    private gridFactory;
    private gridlineFactory;
    private lineFactory;
    private dotFactory;
    private barFactory;
    private lineDataSetWithDataArray;
    private barDataSetWithDataArray;
    private lineAxisIndex;
    private barAxisIndex;
    private isUseGridlineFactory;
    private isUseBarFactory;
    private isUseLineFactory;
    private isUseDotFactory;
    constructor(selector: string);
    protected setFactory(): void;
    /** 設定折線資料
     * @param dataSets DataSetWithDataArray[]
     * @param axisIndex ? 第幾條 key 軸，預設為 1
     */
    setLineDataSets(dataSets: DataSetWithDataArray[], axisIndex?: number): BarLineChart;
    /** 設定長條資料
     * @param dataSets DataSetWithDataArray[]
     * @param axisIndex ? 第幾條 key 軸，預設為 0
     */
    setBarDataSets(dataSets: DataSetWithDataArray[], axisIndex?: number): BarLineChart;
    private setGridDataSets;
    /** 設定要使用的 GridFactory */
    setGridFactory(gridFactory: GridFactory): BarLineChart;
    /** 設定要使用的 GridlineFactory */
    setGridlineFactory(gridlineFactory: GridlineFactory): BarLineChart;
    /** 設定要使用的 LineFactory */
    setLineFactory(lineFactory: LineFactory): BarLineChart;
    /** 設定要使用的 BarFactory */
    setBarFactory(barFactory: BarFactory): BarLineChart;
    getGridFactory(): GridFactory;
    getGridlineFactory(): GridlineFactory;
    getLineFactory(): LineFactory;
    getDotFactory(): DotFactory;
    getBarFactory(): BarFactory;
    useGridlineFactory(isUseGridlineFactory: boolean): BarLineChart;
    useBarFactory(isUseBarFactory: boolean): BarLineChart;
    useLineFactory(isUseLineFactory: boolean): BarLineChart;
    useDotFactory(isUseDotFactory: boolean): BarLineChart;
    drawChart(useAnimation?: boolean): void;
}
