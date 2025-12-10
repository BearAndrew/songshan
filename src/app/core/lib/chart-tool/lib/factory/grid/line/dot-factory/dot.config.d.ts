import { FontConfig } from "../../../../config/font.config";
export interface DotConfig {
    /** 圓點半徑 */
    radius: number;
    /** hover 時顯示預設 tooltip */
    showTooltip: boolean;
    /** 設定要顯示的點的索引值 */
    showDotIndexes: boolean[];
    /** 是否顯示數值標籤在 dot 上 */
    showValueLabel: boolean;
    /** 數值標籤文字樣式設定 */
    valueLabelFontSetting: FontConfig;
}
export declare const DefaultDotConfig: DotConfig;
