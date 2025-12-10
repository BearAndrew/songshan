import { RootSvg } from './root-svg';
/**
 * 基礎圖表 包含圖表共用資訊
 */
export declare abstract class RootChart extends RootSvg {
    constructor(selector: string);
    protected abstract setFactory(): void;
    draw(useAnimation: boolean): void;
    /** 繪製圖表 */
    abstract drawChart(useAnimation?: boolean): void;
}
