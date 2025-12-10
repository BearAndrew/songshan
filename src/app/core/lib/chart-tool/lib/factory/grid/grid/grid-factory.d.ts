import { RootSvg } from '../../../chart/root-svg';
import { FontConfig } from '../../../config/font.config';
import { DataSetWithDataArray } from '../../../interface/common.interface';
import { GridState } from './grid.state';
import { Direction } from '../../../enum/enum';
import { LayoutPosition } from '../../../interface/position.interface';
import { Observable } from 'rxjs';
import { GridConfig, KeyGridlineAlignment } from './grid.config';
import { BasicFactory } from '../../basic-factory';
/** 格線的游標事件，onPointerover 與 onClick 回傳的型別 */
export interface GridPointerEvent {
    /** key 軸索引值 */
    keyIndex: number;
    /** 事件回傳的數據 */
    data: DataSetWithDataArray[];
    /** 離游標最近的數據索引值 */
    nearestDataIndex: number;
    /** 游標事件 */
    event: PointerEvent;
    /** hover 或 click 事件的 HTMLElement */
    element: HTMLElement;
}
/** 格線定位組件，格線型圖表必須使用 */
export declare class GridFactory extends BasicFactory<GridFactory> {
    private chart;
    private gridGroup;
    private gridState;
    private gridConfig;
    private dataSetWithDataArrays;
    private x;
    private xTop;
    private xGridlineBottom;
    private xGridlineTop;
    private y;
    private yRight;
    private yGridlineLeft;
    private yGridlineRight;
    private xGroup;
    private xTopGroup;
    private yGroup;
    private yRightGroup;
    private gridSize;
    private gridMargin;
    private axisValues;
    private keyScaleLabels;
    private keyScaleStep;
    private isVerticalLabel;
    private labelRotateAngle;
    private xTextRectArray;
    /** 上一筆資料集，若資料集為空則使用這個 */
    private lastDataSetsWithDataArray;
    private gridId;
    private pointerover$;
    private pointerout$;
    private click$;
    constructor(chart: RootSvg);
    setConfig(config: Partial<GridConfig>): GridFactory;
    /** 設定資料，分為堆疊型與非堆疊型 */
    setDataSetWithDataArrays(dataSetWithDataArraysDetail: {
        dataSetWithDataArray: DataSetWithDataArray;
        isStack: boolean;
        axisIndex?: number;
    }[]): GridFactory;
    /** 設定 value 軸的刻度等分數量，ex. 數值為 0 ~ 100，5 等分則每個刻度 20 */
    setStepsCount(stepsCount: number): GridFactory;
    /** 設定 x 軸標籤文字樣式 */
    setXLabelFont(fontConfig: Partial<FontConfig>): GridFactory;
    /** 設定 y 軸標籤文字樣式 */
    setYLabelFont(fontConfig: Partial<FontConfig>): GridFactory;
    /** 設定 x 軸標籤單位文字 */
    setKeyLabelUnit(unit: string): GridFactory;
    /** 設定 y 軸標籤單位文字 */
    setValueLabelUnit(unit: string): GridFactory;
    /** 設定圖表呈現方向，預設為 vertical (key 在 x 軸，value 在 y 軸) */
    setDirection(direction: Direction): GridFactory;
    /** 設定 key 軸格線繪製的位置
     * - `KeyGridlineAlignment.center` 格線畫在刻度中心
     * - `KeyGridlineAlignment.centerPadding` 格線畫在刻度中心，且兩邊多空出一格寬度
     * - `KeyGridlineAlignment.between` 格線畫在刻度兩邊
     */
    setKeyGridlineAlignment(keyGridlineAlignment: KeyGridlineAlignment): GridFactory;
    /** 設定 key 軸頻帶寬度，數值介於 0 ~ 1 */
    setBandwidth(bandwidth: number): GridFactory;
    /** 設定是否顯示 hover 的區域，需啟用 hover 功能 */
    setShowHoverArea(isShow: boolean): GridFactory;
    /** 設定是否顯示點擊後的選取區域，需啟用 hover 功能 */
    setShowActiveArea(isShow: boolean): GridFactory;
    /** 設定是否啟用 hover 功能 */
    setHover(isUsePointerEvent: boolean): GridFactory;
    /** 設定 hover 區域的顏色 */
    setHoverColor(hoverColor: string): GridFactory;
    /** 設定 hover 區域的寬度，預設為 -1 (-1代表不設定，寬度為一格 key軸 刻度) */
    setHoverStrokeWidth(strokeWidth: number): GridFactory;
    /** 設定起始顯示點擊區間的索引值 */
    setActiveIndex(activeIndex: number): GridFactory;
    /** 設定點擊後的選取區域的顏色 */
    setActiveColor(activeColor: string): GridFactory;
    /** 設定點擊後的選取區域對應的 key 軸標籤文字顏色 */
    setActiveTextColor(activeTextColor: string): GridFactory;
    /** 設定格線的最小數值(若最小值大於數據中的最小值，圖表會無視此項設定，自動計算該顯示的最小值)
     * @param min 最小值
     * @param axisIndex ? 第幾條 key 軸，預設為 0
     */
    setMinValue(min: number, axisIndex?: number): GridFactory;
    /** 設定格線的最大數值(若最大值小於數據中的最大值，圖表會無視此項設定，自動計算該顯示的最大值)
     * @param max 最大值
     * @param axisIndex ? 第幾條 key 軸，預設為 0
     */
    setMaxValue(min: number, axisIndex?: number): GridFactory;
    /** 設定格線與標籤的間距 */
    setGridGap(gridGap: Partial<LayoutPosition>): GridFactory;
    /** 設定顯示軸線標籤，(影響格線內推空間) */
    setShowAxisLabel(isShow: boolean): GridFactory;
    getConfig(): GridConfig;
    getSelector(): string;
    /** 取得 GridFactory 中不可被設定的值 */
    getState(): GridState;
    /** 監聽 Pointerover 事件 */
    onPointerover(): Observable<GridPointerEvent>;
    /** 監聽 Pointerout 事件 */
    onPointerout(): Observable<PointerEvent>;
    /** 監聽點擊選取區間的事件 */
    onClick(): Observable<GridPointerEvent>;
    /** pointerover 觸發的事件 */
    private pointeroverEvent;
    /** pointerout 觸發的事件 */
    private pointeroutEvent;
    /** 格線中點擊選取區間的事件 */
    private clickEvent;
    /** 計算最大最小值 */
    private calculateMinMax;
    private calcGridSize;
    draw(useAnimation?: boolean): void;
    clear(useAnimation?: boolean): void;
}
