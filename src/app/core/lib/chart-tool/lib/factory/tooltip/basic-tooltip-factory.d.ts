import { Data } from '../../interface/common.interface';
import { TooltipFactory } from './tooltip-factory';
import { TooltipConfig } from './tooltip.config';
export declare class BasicTooltipFactory extends TooltipFactory<BasicTooltipFactory> {
    setData(d: Data[]): BasicTooltipFactory;
    setConfig(tooltipConfig: Partial<TooltipConfig>): TooltipFactory<BasicTooltipFactory>;
    getSelector(): string;
    getConfig(): TooltipConfig;
    draw(): void;
}
