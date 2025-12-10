import { GridFactory } from '../../factory/grid/grid/grid-factory';
import { GridlineFactory } from '../../factory/grid/gridline/gridline-factory';
import { AreaFactory } from '../../factory/grid/line/area-factory/area-factory';
import { DotFactory } from '../../factory/grid/line/dot-factory/dot-factory';
import { LineFactory } from '../../factory/grid/line/line-factory/line-factory';
import { DataSetWithDataArray } from '../../interface/common.interface';
import { RootChart } from '../root-chart';
/** 基礎區域圖 */
export declare class AreaChart extends RootChart {
    private gridFactory;
    private gridlineFactory;
    private lineFactory;
    private dotFactory;
    private areaFactory;
    private lineDataSetWithDataArray;
    private areaDataSetWithDataArray;
    private isUseGridlineFactory;
    private isUseLineFactory;
    private isUseDotFactory;
    private isUseAreaFactory;
    constructor(selector: string);
    protected setFactory(): void;
    /** 設定折線資料 */
    setLineDataSets(dataSets: DataSetWithDataArray[]): AreaChart;
    /** 設定區域資料 */
    setAreaDataSets(dataSets: DataSetWithDataArray[]): AreaChart;
    /** 設定要使用的 GridFactory */
    setGridFactory(gridFactory: GridFactory): AreaChart;
    /** 設定要使用的 GridlineFactory */
    setGridlineFactory(gridlineFactory: GridlineFactory): AreaChart;
    /** 設定要使用的 LineFactory */
    setLineFactory(lineFactory: LineFactory): AreaChart;
    /** 設定要使用的 AreaFactory */
    setAreaFactory(areaFactory: AreaFactory): AreaChart;
    getGridFactory(): GridFactory;
    getGridlineFactory(): GridlineFactory;
    getLineFactory(): LineFactory;
    getDotFactory(): DotFactory;
    getAreaFactory(): AreaFactory;
    useGridlineFactory(isUseGridlineFactory: boolean): AreaChart;
    useLineFactory(isUseLineFactory: boolean): AreaChart;
    useDotFactory(isUseDotFactory: boolean): AreaChart;
    useAreaFactory(isUseAreaFactory: boolean): AreaChart;
    drawChart(useAnimation?: boolean): void;
}
