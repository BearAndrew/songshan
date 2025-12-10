import { Observable } from 'rxjs';
import { FontConfig } from '../../../../config/font.config';
import { BasicFactory } from '../../../basic-factory';
import { BasicTooltipFactory } from '../../../tooltip/basic-tooltip-factory';
import { TooltipFactory } from '../../../tooltip/tooltip-factory';
import { LineFactory } from '../line-factory/line-factory';
import { DotConfig } from './dot.config';
/** 圓點組件，需繪製在 LineFactory 上 */
export declare class DotFactory extends BasicFactory<DotFactory> {
    private lineFactory;
    private tooltipFactory;
    private dotConfig;
    private dataColorArray;
    private showDotIndexes;
    private gridConfig;
    private pointerover$;
    private pointerout$;
    constructor(lineFactory: LineFactory, tooltipFactory?: TooltipFactory<any>);
    /** 游標 hover 事件 */
    onPointerover(): Observable<any>;
    /** 游標離開事件 */
    onPointerout(): Observable<any>;
    setConfig(dotConfig: Partial<DotConfig>): DotFactory;
    /** 設定圓點半徑 */
    setRadius(radius: number): DotFactory;
    /** 設定是否顯示預設 tooltip */
    setShowTooltip(showTooltip: boolean): DotFactory;
    /** 設定要顯示的點的索引值 */
    setShowDotIndexes(showDotIndexes: boolean[]): DotFactory;
    /** 設定要顯示的 tooltip 種類 */
    setTooltipFactory(tooltipFactory: BasicTooltipFactory): DotFactory;
    /** 設定要繪製在哪個 LineFactory 上 */
    setLineFactory(lineFactory: LineFactory): DotFactory;
    /** 設定是否顯示數值標籤 */
    setShowValueLabel(showValueLabel: boolean): DotFactory;
    /** 設定數值標籤文字樣式 */
    setValueLabelFont(valueLabelFontSetting: Partial<FontConfig>): DotFactory;
    getSelector(): string;
    getConfig(): DotConfig;
    draw(useAnimation?: boolean): void;
    clear(useAnimation?: boolean): void;
}
