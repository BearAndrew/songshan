import { GridFactory } from '../../factory/grid/grid/grid-factory';
import { GridlineFactory } from '../../factory/grid/gridline/gridline-factory';
import { DotFactory } from '../../factory/grid/line/dot-factory/dot-factory';
import { LineFactory } from '../../factory/grid/line/line-factory/line-factory';
import { DataSetWithDataArray } from '../../interface/common.interface';
import { RootChart } from '../root-chart';
/** 基礎折線圖 */
export declare class LineChart extends RootChart {
    private gridFactory;
    private gridlineFactory;
    private lineFactory;
    private dotFactory;
    private lineDataSetWithDataArray;
    private isUseGridlineFactory;
    private isUseLineFactory;
    private isUseDotFactory;
    constructor(selector: string);
    protected setFactory(): void;
    /** 設定資料 */
    setDataSets(dataSets: DataSetWithDataArray[]): LineChart;
    /** 設定要使用的 GridFactory */
    setGridFactory(gridFactory: GridFactory): LineChart;
    /** 設定要使用的 GridlineFactory */
    setGridlineFactory(gridlineFactory: GridlineFactory): LineChart;
    /** 設定要使用的 LineFactory */
    setLineFactory(lineFactory: LineFactory): LineChart;
    getGridFactory(): GridFactory;
    getGridlineFactory(): GridlineFactory;
    getLineFactory(): LineFactory;
    getDotFactory(): DotFactory;
    useGridlineFactory(isUseGridlineFactory: boolean): LineChart;
    useLineFactory(isUseLineFactory: boolean): LineChart;
    useDotFactory(isUseDotFactory: boolean): LineChart;
    drawChart(useAnimation?: boolean): void;
}
