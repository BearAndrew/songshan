/** 標示座標(x,y)
 * @param x: number
 * @param y: number
 */
export interface Position {
    x: number;
    y: number;
}
/** 標示定位(上下左右)
 * @param top: number
 * @param bottom: number
 * @param left: number
 * @param right: number
 */
export interface LayoutPosition {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
export type PositionX = keyof typeof PositionXType;
export type PositionY = keyof typeof PositionYType;
export declare enum PositionXType {
    left = "left",
    center = "center",
    right = "right"
}
export declare enum PositionYType {
    top = "top",
    center = "center",
    bottom = "bottom"
}
