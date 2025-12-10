import { D3Operator } from "../interface/common.interface";
/**
 * 基礎組件工廠
 */
export declare abstract class BasicFactory<T> {
    protected isFirstUpdate: boolean;
    protected d3Operators: D3Operator[];
    protected factoryId: string;
    setD3Operator(d3Operators: D3Operator[]): T;
    /** 取得組件 id */
    getId(): string;
    protected ExtendD3(d3: any): void;
    /** 設定組件中所有可以被設定的值 */
    abstract setConfig(config: Partial<any>): T;
    /** 取得組件中所有可以被設定的值 */
    abstract getConfig(): Record<string, any>;
    /** 取得組件選擇器 */
    abstract getSelector(): string;
    /** 繪製 */
    abstract draw(useAnimation: boolean): void;
    /** 清除繪製的內容 */
    abstract clear(useAnimation: boolean): void;
}
