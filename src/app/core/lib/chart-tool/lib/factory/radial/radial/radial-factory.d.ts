import { Observable } from 'rxjs';
import { RootSvg } from '../../../chart/root-svg';
import { DataSetWithData } from '../../../interface/common.interface';
import { BasicFactory } from '../../basic-factory';
import { RadialConfig } from './radial.config';
import { RadialState } from './radial-state';
/** 輻射定位組件，輻射中心型圖表必須使用 */
export declare class RadialFactory extends BasicFactory<RadialFactory> {
    private chart;
    private radialGroup;
    private dataSetWithData;
    private radialConfig;
    private radialState;
    private pointerover$;
    private pointerout$;
    constructor(chart: RootSvg);
    setConfig(radialConfig: Partial<RadialConfig>): RadialFactory;
    setData(data: DataSetWithData[]): RadialFactory;
    getConfig(): RadialConfig;
    getState(): RadialState;
    getSelector(): string;
    /** 監聽 Pointerover 事件 */
    onPointerover(): Observable<PointerEvent>;
    /** 監聽 Pointerout 事件 */
    onPointerout(): Observable<PointerEvent>;
    draw(useAnimation?: boolean): void;
    clear(useAnimation?: boolean): void;
}
