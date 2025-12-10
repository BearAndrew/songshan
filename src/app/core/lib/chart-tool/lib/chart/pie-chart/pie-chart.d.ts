import { PieFactory } from '../../factory/radial/pie/pie-factory';
import { RadialFactory } from '../../factory/radial/radial/radial-factory';
import { RootChart } from '../root-chart';
import { DataSetWithData } from '../../interface/common.interface';
/** 基礎折線圖 */
export declare class PieChart extends RootChart {
    private radialFactory;
    private pieFactory;
    private pieDataSetWithData;
    constructor(selector: string);
    protected setFactory(): void;
    /** 設定資料 */
    setDataSets(dataSets: DataSetWithData[]): PieChart;
    getRadialFactory(): RadialFactory;
    getPieFactory(): PieFactory;
    drawChart(useAnimation?: boolean): void;
}
