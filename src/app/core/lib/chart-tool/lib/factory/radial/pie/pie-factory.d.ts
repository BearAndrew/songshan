import { Observable } from 'rxjs';
import { DataSetWithData } from '../../../interface/common.interface';
import { BasicFactory } from '../../basic-factory';
import { TooltipFactory } from '../../tooltip/tooltip-factory';
import { PieConfig } from './pie.config';
import { RadialFactory } from '../radial/radial-factory';
/** 雷達組件 */
export declare class PieFactory extends BasicFactory<PieFactory> {
    private tooltipFactory;
    private pieGroup;
    private radialState;
    private radialConfig;
    private dataSetWithData;
    private pieConfig;
    private pointerover$;
    private pointerout$;
    constructor(radialFactory: RadialFactory, tooltipFactory?: TooltipFactory<any>);
    setConfig(pieConfig: Partial<PieConfig>): PieFactory;
    setRadialFactory(radialFactory: RadialFactory): PieFactory;
    setData(data: DataSetWithData[]): PieFactory;
    getConfig(): PieConfig;
    getSelector(): string;
    /** 監聽 Pointerover 事件 */
    onPointerover(): Observable<PointerEvent>;
    /** 監聽 Pointerout 事件 */
    onPointerout(): Observable<PointerEvent>;
    draw(useAnimation?: boolean): void;
    clear(useAnimation?: boolean): void;
}
