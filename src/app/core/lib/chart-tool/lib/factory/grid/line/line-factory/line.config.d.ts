import { LineAnimationType } from "./line-factory";
import { CurveType } from "../../../../enum/curve.enum";
export interface LineConfig {
    /** 顯示在第幾個 value 軸 */
    axisIndex: number;
    /** 折線寬度 */
    strokeWidth: number;
    /** 曲線型別 */
    curveType: CurveType;
    /** 動畫種類 */
    enterAnimationType: LineAnimationType;
}
export declare const DefaultLineConfig: LineConfig;
