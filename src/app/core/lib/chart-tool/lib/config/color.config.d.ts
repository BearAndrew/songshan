/**
 * @param color string
 * @param opacity number
 */
export interface Color {
    color: string;
    opacity: number;
}
export declare enum DefaultDataColor {
    Sage = "#9EDBB6",
    PastelOrange = "#FFCC83",
    SkyBlue = "#8EC7FF",
    SalmonPink = "#F99798",
    Lavender = "#C0A8F4",
    CottonCandyPink = "#FFBDF8",
    MintGreen = "#A8F4AE",
    PaleYellow = "#FFE68E",
    CornflowerBlue = "#798ED6",
    LightCyan = "#83F6FF"
}
/** 一筆 Color[] 代表一個資料集的顏色，若 Color[] 陣列長度 > 1，則代表為漸層顏色 */
export declare const DefaultDataColorArray: Color[][];
