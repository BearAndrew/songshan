import { AreaAnimationType } from "./area-factory";
import { CurveType } from "../../../../enum/curve.enum";
export interface AreaConfig {
    /** 顯示在第幾個 value 軸 */
    axisIndex: number;
    /** 曲線型別 */
    curveType: CurveType;
    /** 動畫種類 */
    enterAnimationType: AreaAnimationType;
}
export declare const DefaultAreaConfig: AreaConfig;
