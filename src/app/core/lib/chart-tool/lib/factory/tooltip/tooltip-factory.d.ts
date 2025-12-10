import { Color } from '../../config/color.config';
import { BasicFactory } from '../basic-factory';
import { PositionStrategy } from './position-strategy.function';
import { TooltipConfig } from './tooltip.config';
export declare abstract class TooltipFactory<T> extends BasicFactory<TooltipFactory<T>> {
    protected tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    protected tooltipConfig: TooltipConfig;
    abstract setData(d: any): T;
    /** 設定 tooltip 標題 */
    setTitle(title: string): T;
    /** 設定顯示要黏住哪個元素 */
    setElement(element: Element): T;
    /** 設定資料顯示顏色陣列 */
    setColor(colorsArray: Color[][]): T;
    /** 設定顯示策略 */
    setPositionStrategy(positionStrategy: PositionStrategy): T;
    clear(): void;
}
