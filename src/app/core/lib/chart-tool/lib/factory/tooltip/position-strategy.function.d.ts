import { Position, PositionX, PositionY } from '../../interface/position.interface';
/**
 * @param x  "left" | "center" | "right"
 * @param y  "center" | "top" | "bottom"
 */
export interface PositionStrategy {
    x: PositionX;
    y: PositionY;
}
/** 計算並返回 position */
export declare function calculatePosition(origin: Element, overlay: Element | null, strategy?: PositionStrategy, marginOfOrigin?: Position, paddingOfBody?: Position): Position;
