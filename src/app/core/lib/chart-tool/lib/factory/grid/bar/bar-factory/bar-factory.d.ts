import { Observable } from 'rxjs';
import { FontConfig } from '../../../../config/font.config';
import { Data, DataSetWithDataArray } from '../../../../interface/common.interface';
import { BasicFactory } from '../../../basic-factory';
import { TooltipFactory } from '../../../tooltip/tooltip-factory';
import { GridFactory } from '../../grid/grid-factory';
import { BarConfig } from './bar.config';
export interface PointeroverData {
    key: string | number | undefined;
    activeIndex: number;
    data: (Data | undefined)[];
    elements: Element[];
    event: PointerEvent;
}
/** 長條組件，需繪製在 GridFactory 上 */
export declare class BarFactory extends BasicFactory<BarFactory> {
    private tooltipFactory;
    private gridFactory;
    private gridState;
    private gridConfig;
    private dataSetWithDataArrays;
    private dataColorArray;
    private barArrayGroup;
    private barGroup;
    private barConfig;
    private pointerover$;
    private pointerout$;
    constructor(gridFactory: GridFactory, tooltipFactory?: TooltipFactory<any>);
    /** 設定要被繪製在哪個 GridFactory 上 */
    setGridFactory(gridFactory: GridFactory): BarFactory;
    /** 設定長條資料 */
    setDataSets(dataSetWithDataArrays: DataSetWithDataArray[], axisIndex?: number): BarFactory;
    setConfig(barConfig: Partial<BarConfig>): BarFactory;
    /** 設定長條繪製時的動畫 */
    setEnterAnimation(enterAnimationType: BarAnimationType): BarFactory;
    /** 設定是否堆疊，若為否則平行呈現 */
    setStack(isStack: boolean): BarFactory;
    /** 設定是否顯示數值標籤 */
    setShowValueLabel(showValueLabel: boolean): BarFactory;
    /** 設定數值標籤文字樣式 */
    setValueLabelFont(valueLabelFontSetting: Partial<FontConfig>): BarFactory;
    /** 設定數值標籤顯示的位置 */
    setIsValueLabelOutside(isValueLabelOutside: boolean): BarFactory;
    /** 取的線段中資料點的 x 座標 */
    getXPosition(d: Data): number;
    /** 取的線段中資料點的 y 座標 */
    getYPosition(d: Data): number;
    getSelector(): string;
    getConfig(): BarConfig;
    /** 監聽 Pointerover 事件 */
    onPointerover(): Observable<PointeroverData>;
    /** 監聽 Pointerout 事件 */
    onPointerout(): Observable<PointerEvent>;
    draw(useAnimation?: boolean): void;
    clear(useAnimation?: boolean): void;
    /** 判斷使用哪種動畫 */
    private getAnimation;
    /** line 動畫 從頭畫到尾 */
    private animateStartToEnd;
    /** line 動畫 淡入 */
    private animateFadeIn;
}
/** BarFactory 的動畫種類 */
export declare enum BarAnimationType {
    none = 0,
    startToEnd = 1,
    fadeIn = 2
}
