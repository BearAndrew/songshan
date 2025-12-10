import { MinMaxValue, Size } from '../../../interface/common.interface';
import { LayoutPosition } from '../../../interface/position.interface';
/** Grid Factory 中維護的資料，使用者不可設定 */
export interface GridState {
    /** chart 的 id */
    id: string;
    /** x 方向的布局定位 下面 */
    x: d3.ScaleLinear<number, number, never> | d3.ScaleBand<string>;
    /** x 方向的布局定位 上面 */
    xTop: d3.ScaleLinear<number, number, never> | d3.ScaleBand<string>;
    /** x 方向的下刻度布局定位*/
    xGridlineBottom: d3.ScaleLinear<number, number, never> | d3.ScaleBand<string>;
    /** x 方向的上刻度布局定位*/
    xGridlineTop: d3.ScaleLinear<number, number, never> | d3.ScaleBand<string>;
    /** y 方向的線性定位 左邊*/
    y: d3.ScaleLinear<number, number, never> | d3.ScaleBand<string>;
    /** y 方向的線性定位 右邊*/
    yRight: d3.ScaleLinear<number, number, never> | d3.ScaleBand<string>;
    /** y 方向的左刻度布局定位*/
    yGridlineLeft: d3.ScaleLinear<number, number, never> | d3.ScaleBand<string>;
    /** y 方向的右刻度布局定位*/
    yGridlineRight: d3.ScaleLinear<number, number, never> | d3.ScaleBand<string>;
    /** 格狀 \<g id="grid"\> selection */
    gridGroup: d3.Selection<any, unknown, HTMLElement, any>;
    /** 格線 column 與 x標籤 \<g id="x"\> selection */
    xGroup: d3.Selection<any, unknown, HTMLElement, any>;
    /** 格線 column 與 x上方標籤 \<g id="x"\> selection */
    xTopGroup: d3.Selection<any, unknown, HTMLElement, any>;
    /** 格線 row 與 y標籤 \<g id="y"\> selection */
    yGroup: d3.Selection<any, unknown, HTMLElement, any>;
    /** 格線 row 與 y右方標籤 \<g id="y"\> selection */
    yRightGroup: d3.Selection<any, unknown, HTMLElement, any>;
    /** 格線寬高 */
    gridSize: Size;
    /** 格線 gridline 以外與圖表 chart 以內間距 */
    gridMargin: LayoutPosition;
    /** 左右軸線計算完後，實際呈現的最大最小值 */
    axisValues: MinMaxValue[];
    /** 紀錄 key 軸所有刻度標籤 */
    keyScaleLabels: string[];
    /** 紀錄 key 軸一單位寬度 */
    keyScaleStep: number;
    /** x軸標籤是否垂直顯示 */
    isVerticalLabel: boolean;
    /** x軸標籤垂直顯示旋轉角度(radian) */
    labelRotateAngle: number;
    /** x軸所有標籤的 DOMRect，用於計算旋轉後的 tranlate */
    xTextRectArray: DOMRect[];
}
