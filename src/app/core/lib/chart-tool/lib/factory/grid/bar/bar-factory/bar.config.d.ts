import { FontConfig } from "../../../../config/font.config";
import { BarAnimationType } from "./bar-factory";
export interface BarConfig {
    /** 顯示在第幾個 value 軸 */
    axisIndex: number;
    /** hover 時顯示預設 tooltip */
    showTooltip: boolean;
    /** 是否顯示數值標籤在 bar 上 */
    showValueLabel: boolean;
    /** 數值標籤是否顯示在 bar 外 */
    isValueLabelOutside: boolean;
    /** 數值標籤文字樣式設定 */
    valueLabelFontSetting: FontConfig;
    /** 動畫種類 */
    enterAnimationType: BarAnimationType;
    /** 是否堆疊，若為否則平行呈現 */
    isStack: boolean;
    /** Bar寬度設定，數值介於0~1 */
    bandwidth: number;
    /** Bar 的圓角 */
    borderRadius: number;
}
export declare const DefaultBarConfig: BarConfig;
