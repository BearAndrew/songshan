import * as d3 from 'd3';
import { Data, DataSetWithDataArray } from '../../../../interface/common.interface';
import { BasicFactory } from '../../../basic-factory';
import { GridFactory } from '../../grid/grid-factory';
import { GridConfig } from '../../grid/grid.config';
import { GridState } from '../../grid/grid.state';
import { LineConfig } from './line.config';
import { CurveType } from '../../../../enum/curve.enum';
/** 折線組件，需繪製在 GridFactory 上 */
export declare class LineFactory extends BasicFactory<LineFactory> {
    private gridFactory;
    private gridState;
    private gridConfig;
    private dataSetWithDataArrays;
    private dataColorArray;
    private lineArrayGroup;
    private lineGroup;
    private lineConfig;
    constructor(gridFactory: GridFactory);
    /** 設定要被繪製在哪個 GridFactory 上 */
    setGridFactory(gridFactory: GridFactory): LineFactory;
    /** 設定折線資料 */
    setDataSets(dataSetWithDataArrays: DataSetWithDataArray[], axisIndex?: number): LineFactory;
    setConfig(lineConfig: Partial<LineConfig>): LineFactory;
    /** 設定折線粗細 */
    setStrokeWidth(width: number): LineFactory;
    /** 設定曲線模式 */
    setCurveType(curveType: CurveType): LineFactory;
    /** 設定折線繪製時的動畫 */
    setEnterAnimation(enterAnimationType: LineAnimationType): LineFactory;
    /** 取得線段中資料點的 x 座標 */
    getXPosition(d: Data): number;
    /** 取的線段中資料點的 y 座標 */
    getYPosition(d: Data): number;
    getLineGroup(): d3.Selection<SVGElement | SVGGElement, DataSetWithDataArray, d3.BaseType, any>;
    getSelector(): string;
    getConfig(): LineConfig;
    /** 取得 GridConfig */
    getGridConfig(): GridConfig;
    /** 取得 GridState */
    getState(): GridState;
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
/** LineFactory 的動畫種類 */
export declare enum LineAnimationType {
    none = 0,
    startToEnd = 1,
    fadeIn = 2
}
