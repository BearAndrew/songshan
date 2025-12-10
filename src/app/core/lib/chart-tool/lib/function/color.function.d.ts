import { Color } from '../config/color.config';
import { Direction } from '../enum/enum';
import { DataSet } from '../interface/common.interface';
/** 回傳 d3.selection fill 中需要的顏色 */
export declare function getSelectionColor(selection: d3.Selection<any, any, any, any>, colors: Color[], elementId: string, elementIndex: number | string, direction?: Direction): string;
/** 回傳 css color 中需要的顏色 */
export declare function getCssColor(colors: Color[], direction?: Direction): string;
/** 從 DataSet [ ] 中將 colors:string [ ] 轉換成 Color [ ] [ ] */
export declare function getColorTypeArray(DataSetWithDataArrays: DataSet[]): Color[][];
export declare function convertColourToColorType(colour: string): Color;
