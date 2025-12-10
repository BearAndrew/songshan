import * as d3 from 'd3';
/** 取得字串長寬 */
export declare function getTextRect(text: string, fontFamily?: string, fontSize?: string, fontWeight?: string): DOMRect;
/** 深拷貝 */
export declare function deepCopy(obj: any): any;
/** 生成隨機小寫英文字串，預設 8 碼 */
export declare function getRandomId(length?: number): string;
/** 限制文本長度並添加 ...，使中英文實際顯示寬度接近 */
export declare function truncateText(textElement: d3.Selection<any, unknown, null, undefined>, maxWidth: number): void;
/** 生成 text 標籤
 *
 * 預設數值:
 * - dominant-baseline: middle;
 * - pointer-events: none;
 * - user-select: none; */
export declare function createText(parent: d3.Selection<any, any, any, any>, customAttrs: (text: d3.Selection<any, any, any, any>) => void): d3.Selection<any, unknown, any, any>;
