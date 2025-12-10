import { RootChart } from '../../chart/root-chart';
import { DataSetWithDataArray } from '../../interface/common.interface';
import { BasicFactory } from '../basic-factory';
import { LegnedConfig } from './legend.config';
export declare class LegendFactory extends BasicFactory<LegendFactory> {
    private input;
    private dataSets;
    private legendGroup;
    private legendConfig;
    private legendId;
    private colorArray;
    constructor(input: RootChart | string);
    setDataSets(dataSetsArray: DataSetWithDataArray[][]): LegendFactory;
    setConfig(legendConfig: Partial<LegnedConfig>): LegendFactory;
    getSelector(): string;
    getConfig(): LegnedConfig;
    draw(useAnimation?: boolean): void;
    clear(): void;
}
