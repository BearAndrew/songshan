import { BasicFactory } from '../../basic-factory';
import { GridFactory } from '../grid/grid-factory';
import { GridlineConfig, GridlineSetting } from './gridline.config';
/** 格線組件，需繪製在 GridFactory 上 */
export declare class GridlineFactory extends BasicFactory<GridlineFactory> {
    private gridFactory;
    private gridState;
    private gridConfig;
    private gridlineConfig;
    constructor(gridFactory: GridFactory);
    /** 設定要被繪製在哪個 GridFactory 上 */
    setGridFactory(gridFactory: GridFactory): GridlineFactory;
    setConfig(gridlineConfig: Partial<GridlineConfig>): GridlineFactory;
    /** 設定橫向格線的樣式 */
    setGridRow(gridlineSetting: Partial<GridlineSetting>): GridlineFactory;
    /** 設定縱向格線的樣式 */
    setGridCol(gridlineSetting: Partial<GridlineSetting>): GridlineFactory;
    /** 設定X軸線的樣式 */
    setXAxis(gridlineSetting: Partial<GridlineSetting>): GridlineFactory;
    /** 設定Y軸線的樣式 */
    setYAxis(gridlineSetting: Partial<GridlineSetting>): GridlineFactory;
    getSelector(): string;
    getConfig(): GridlineConfig;
    draw(useAnimation?: boolean): void;
    clear(useAnimation?: boolean): void;
}
