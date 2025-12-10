export interface GridlineConfig {
    /** 格線 row 設定 */
    gridRow: GridlineSetting;
    /** 格線 col 設定 */
    gridCol: GridlineSetting;
    /** x 軸線設定 */
    xAxis: GridlineSetting;
    /** y 軸線設定 */
    yAxis: GridlineSetting;
    /** 是否顯示邊框 */
    showBorder: boolean;
    /** 每幾個 tick 顯示一次key軸的格線，預設為 1 (每個 tick 都顯示) */
    tickInterval: number;
}
export declare const DefaultGridlineConfig: GridlineConfig;
/**
 * gridline 相關設定
 * - `stroke` : string
 * - `stroke-width` : number
 * - `stroke-dasharray` : string
 */
export interface GridlineSetting {
    stroke: string;
    'stroke-width': number;
    'stroke-dasharray': string;
    'stroke-linecap': 'butt' | 'round' | 'square';
}
