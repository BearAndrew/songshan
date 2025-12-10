import { Size } from '../../../interface/common.interface';
/** Radial Factory 中維護的資料，使用者不可設定 */
export interface RadialState {
    /** 半徑 */
    radius: number;
    /** 標籤高度 */
    labelSize: Size;
}
export declare const DefaultRadialState: RadialState;
