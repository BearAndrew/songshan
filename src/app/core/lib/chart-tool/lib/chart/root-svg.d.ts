import * as d3 from 'd3';
import { Size } from '../interface/common.interface';
/**
 * 基礎svg
 */
export declare class RootSvg {
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    id: string;
    size: Size;
    chartElement: HTMLElement;
    private isFirst;
    constructor(selector: string);
    /** 設定長寬 */
    setSize(size: Size): void;
    protected draw(useAnimation: boolean): void;
}
