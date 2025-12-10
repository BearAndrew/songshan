import { FontConfig } from "../../../config/font.config";
export declare enum LabelDispalyMode {
    /** LabelOnly */
    LabelOnly = "labelOnly",
    /** ValueOnly */
    ValueOnly = "valueOnly",
    /** LabelValue */
    LabelValue = "labelValue"
}
export interface RadialConfig {
    /** 標籤與輻射圖之間的距離 */
    labelOffset: number;
    /** 標籤文字設定 */
    labelFontConfig: FontConfig;
    /** 標籤顯示模式 */
    labelDispalyMode: LabelDispalyMode;
}
export declare const DefaultRadialConfig: RadialConfig;
