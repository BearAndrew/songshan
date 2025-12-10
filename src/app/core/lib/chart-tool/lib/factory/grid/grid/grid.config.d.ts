import { FontConfig } from '../../../config/font.config';
import { Direction } from '../../../enum/enum';
import { LayoutPosition } from '../../../interface/position.interface';
/** key軸格線畫的位置
 * - `center` 格線畫在刻度中心
 * - `centerPadding` 格線畫在刻度中心，且兩邊多空出一格寬度
 * - `between` 格線畫在刻度兩邊
 */
export declare enum KeyGridlineAlignment {
    center = 0,
    centerPadding = 1,
    between = 2
}
export interface GridConfig {
    /** X軸標籤文字樣式設定 */
    xlabelFontConfig: FontConfig;
    /** Y軸標籤文字樣式設定 */
    ylabelFontConfig: FontConfig;
    /** key 軸標籤文字後方單位字串 */
    keyUnit: string;
    /** value 軸標籤文字後方單位字串 */
    valueUnit: string;
    /** 圖表方向，vertical 為 X軸顯示key值，Y軸顯示value值 */
    direction: Direction;
    /** key軸格線繪製位置
     *  - `KeyGridlineAlignment.center` 格線畫在刻度中心
     *  - `KeyGridlineAlignment.centerPadding` 格線畫在刻度中心，且兩邊多空出一格寬度
     *  - `KeyGridlineAlignment.between` 格線畫在刻度兩邊
     */
    keyGridlineAlignment: KeyGridlineAlignment;
    /** 格線數值等分數量，ex. 0~100 五等分，一個 step 為20 */
    stepsCount: number;
    /** key軸頻帶寬度，介於 0 ~ 1 */
    bandwidth: number;
    /** 是否啟用游標事件，啟用後才能監聽 Pointerover Pointerout Click 事件與繪製效果 */
    isUsePointerEvent: boolean;
    /** hover 時顯示當前 hover 的 key 軸區間的顏色 */
    hoverColor: string;
    /** hover 時顯示當前 hover 的 key 軸區間的寬度 */
    hoverStrokeWidth: number;
    /** 設定要顯示的點擊區間索引值 */
    activeIndex: number;
    /** 點擊後顯示當前點擊的 key 軸區間的顏色 */
    activeColor: string;
    /** 點擊後更改當前點擊的 key 軸標籤文字的顏色 */
    activeTextColor: string;
    /** 是否顯示當前 key 軸上的所有數值點 */
    showHoverPoint: boolean;
    /** 是否顯示 hover 區間 */
    showHoverArea: boolean;
    /** 是否顯示 點擊區間 */
    showActiveArea: boolean;
    /** 自行設定的最小值，index 0 為左軸，index 1 為右軸 */
    settingMin: [number, number];
    /** 自行設定的最大值，index 0 為左軸，index 1 為右軸 */
    settingMax: [number, number];
    /** 格線與標籤的間距 */
    gridGap: LayoutPosition;
    /** 設定顯示軸線標籤，(影響格線內推空間) */
    isShowAxisLabel: boolean;
}
export declare const DefaultGridConfig: GridConfig;
