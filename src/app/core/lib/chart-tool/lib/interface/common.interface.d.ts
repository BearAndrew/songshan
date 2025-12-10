import { Direction } from "../enum/enum";
/** 長寬
 * @property `width` : number
 * @property `height` : number
 */
export interface Size {
    width: number;
    height: number;
}
/** 資料節點
 * @property `key?` : string | number
 * @property `value` : string | number
 */
export interface Data {
    key?: string | number;
    value: string | number | null;
}
/** 資料集
 * @property `label` : string;
 * @property `colors?` : string[];
 * @property `gradientDirection?` : Direction;
 */
export interface DataSet {
    label: string;
    colors?: string[];
    gradientDirection?: Direction;
    unitText?: string;
    [key: string]: any;
}
/** 一筆一維資料集，ex. pie chart
 * @property `label` : string;
 * @property `data` : Data;
 * @property `colors?` : string[];
 * @property `gradientDirection?` : Direction;
*/
export interface DataSetWithData extends DataSet {
    data: Data;
}
/** 一筆二維資料集，ex. grid chart
 * @property `label` : string;
 * @property `data` : Data[];
 * @property `colors?` : string[];
 * @property `gradientDirection?` : Direction;
 */
export interface DataSetWithDataArray extends DataSet {
    data: Data[];
}
/** 最小值與最大值 */
export interface MinMaxValue {
    minValue: number;
    maxValue: number;
}
export type D3Operator = [string, string, any];
