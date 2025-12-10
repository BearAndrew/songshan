import * as d3 from 'd3';
import { Data, DataSetWithDataArray } from '../../../../interface/common.interface';
import { BasicFactory } from '../../../basic-factory';
import { GridFactory } from '../../grid/grid-factory';
import { CurveType } from '../../../../enum/curve.enum';
import { AreaConfig } from './area.config';
/** 折線組件，需繪製在 GridFactory 上 */
export declare class AreaFactory extends BasicFactory<AreaFactory> {
    private gridFactory;
    private gridState;
    private gridConfig;
    private dataSetWithDataArrays;
    private dataColorArray;
    private areaArrayGroup;
    private areaGroup;
    private areaConfig;
    constructor(gridFactory: GridFactory);
    /** 設定要被繪製在哪個 GridFactory 上 */
    setGridFactory(gridFactory: GridFactory): AreaFactory;
    /** 設定折線資料 */
    setDataSets(dataSetWithDataArrays: DataSetWithDataArray[], axisIndex?: number): AreaFactory;
    setConfig(areaConfig: Partial<AreaConfig>): AreaFactory;
    /** 設定曲線模式 */
    setCurveType(curveType: CurveType): AreaFactory;
    /** 設定折線繪製時的動畫 */
    setEnterAnimation(enterAnimationType: AreaAnimationType): AreaFactory;
    /** 取得線段中資料點的 x 座標 */
    getXPosition(d: Data): number;
    /** 取的線段中資料點的 y 座標 */
    getYPosition(d: Data): number;
    getLineGroup(): d3.Selection<SVGElement | SVGGElement, DataSetWithDataArray, d3.BaseType, any>;
    getSelector(): string;
    getConfig(): AreaConfig;
    /** 取得折線資料 */
    getDataSetWithDataArrays(): DataSetWithDataArray[];
    draw(useAnimation?: boolean): void;
    clear(useAnimation?: boolean): void;
    /** 判斷使用哪種動畫 */
    private getAnimation;
    /** line 動畫 從頭畫到尾 */
    private animateStartToEnd;
    /** line 動畫 淡入 */
    private animateFadeIn;
}
/** AreaFactory 的動畫種類 */
export declare enum AreaAnimationType {
    none = 0,
    startToEnd = 1,
    fadeIn = 2
}
