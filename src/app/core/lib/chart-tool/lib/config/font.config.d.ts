export declare enum FontFamilyType {
    Common = "\"PingFang TC\",\"Segoe UI\", \"Roboto\", \"\u5FAE\u8EDF\u6B63\u9ED1\u9AD4\", \"sans-serif\""
}
export type FontWeightType = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
/**
 * 文字相關設定
 * @param font-size string
 * @param font-family string
 * @param font-weight '100' ~ '900'
 * @param color string
 */
export interface FontConfig {
    'font-size': string;
    'font-family': string;
    'font-weight': FontWeightType;
    color: string;
}
/** 標籤文字預設樣式 */
export declare const DefaultLabel: FontConfig;
/** 軸線文字預設樣式 */
export declare const DefaultAxisLabel: FontConfig;
