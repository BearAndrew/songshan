import { Color } from '../../config/color.config';
import { Data } from '../../interface/common.interface';
import { PositionStrategy } from './position-strategy.function';
export interface TooltipConfig {
    /** 標題 */
    title: string;
    /** 黏著元素 */
    element: Element;
    /** 黏著元素的 DOMRect */
    rect: DOMRect;
    /** 資料顏色陣列 */
    colorsArray: Color[][];
    /** 資料陣列 */
    data: Data[];
    /** 顯示策略 */
    positionStrategy: PositionStrategy;
    /** 強調顏色的索引值 */
    activeIndex: number;
}
export declare const DefaultTooltipConfig: TooltipConfig;
