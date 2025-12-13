import * as d3 from 'd3';
import { Subject } from 'rxjs';

/** 取得字串長寬 */
function getTextRect(text, fontFamily = '', fontSize = '16', fontWeight = '400') {
    const tempSvg = d3.select('body').append('svg');
    const tempSpan = tempSvg
        .append('text')
        .attr('visibility', 'hidden')
        .attr('position', 'absolute')
        .attr('left', 0)
        .attr('font-family', fontFamily)
        .attr('font-size', fontSize)
        .attr('font-weight', fontWeight)
        .text(text);
    const rect = tempSpan.node()?.getBoundingClientRect() || new DOMRect();
    tempSvg.remove();
    return rect;
}
/** 深拷貝 */
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/** 生成隨機小寫英文字串，預設 8 碼 */
function getRandomId(length = 8) {
    let id = '';
    const randomChar = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        id += randomChar.charAt(Math.floor((randomBuffer[0] / (0xffffffff + 1)) * randomChar.length));
    }
    return id;
}
/** 限制文本長度並添加 ...，使中英文實際顯示寬度接近 */
// export function truncateText(text: string, maxLength: number = 20) {
//   let weightedLength = 0;
//   let truncated = '';
//   // 判斷字符是否為中文
//   function isChinese(char: string) {
//     return /[\u4e00-\u9fff]/.test(char);
//   }
//   for (let i = 0; i < text.length; i++) {
//     const char = text[i];
//     const charLength = isChinese(char) ? 2 : 1;
//     // 如果超過最大長度 - 4 (扣除...長度)，停止截取
//     if (weightedLength + charLength > maxLength - 4) {
//       truncated += '...';
//       break;
//     }
//     truncated += char;
//     weightedLength += charLength;
//   }
//   return truncated;
// }
function truncateText(textElement, maxWidth) {
    let text = textElement.text();
    // 如果文本寬度超過 maxWidth，進行截斷
    while (textElement.node()?.getComputedTextLength() > maxWidth && text.length > 0) {
        text = text.slice(0, -1); // 逐字縮短文本
        textElement.text(text + '...'); // 在文本末尾加上 "..."
    }
}
/** 生成 text 標籤
 *
 * 預設數值:
 * - dominant-baseline: middle;
 * - pointer-events: none;
 * - user-select: none; */
function createText(parent, customAttrs) {
    return parent
        .append('text')
        .attr('dominant-baseline', 'middle')
        .style('pointer-events', 'none')
        .style('user-select', 'none')
        .call(customAttrs);
}

/**
 * 基礎svg
 */
class RootSvg {
    svg;
    id = getRandomId();
    size = { width: 500, height: 500 };
    chartElement;
    isFirst = true;
    constructor(selector) {
        this.chartElement = document.querySelector(selector);
        const rect = this.chartElement?.getBoundingClientRect() || {
            width: 500,
            height: 500
        };
        this.size = { width: rect?.width, height: rect?.height };
        this.svg = d3.select(selector).append('svg').attr('id', this.id).attr('width', this.size.width).attr('height', this.size.height);
        if (!this.chartElement) {
            console.error(`找不到${selector}`);
            return;
        }
        // flex grow 的時候加上 min-height:0 min-width:0，防止resizeObserver無限觸發
        if (this.chartElement.style.flexGrow) {
            this.chartElement.style.minHeight = '0';
            this.chartElement.style.minWidth = '0';
        }
        const resizeObserver = new ResizeObserver(entries => {
            if (this.isFirst) {
                this.isFirst = false;
                return;
            }
            for (let entry of entries) {
                this.size = {
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                };
                setTimeout(() => this.draw(false), 0);
            }
        });
        resizeObserver.observe(this.chartElement);
    }
    /** 設定長寬 */
    setSize(size) {
        this.size = size;
    }
    draw(useAnimation) {
        this.svg.attr('width', this.size.width).attr('height', this.size.height);
    }
}

/**
 * 基礎圖表 包含圖表共用資訊
 */
class RootChart extends RootSvg {
    constructor(selector) {
        super(selector);
    }
    draw(useAnimation) {
        this.svg.attr('width', this.size.width).attr('height', this.size.height);
        this.drawChart(useAnimation);
    }
}

var D3Accessor;
(function (D3Accessor) {
    D3Accessor["attr"] = "attr";
    D3Accessor["style"] = "style";
})(D3Accessor || (D3Accessor = {}));
var Direction;
(function (Direction) {
    Direction["vertical"] = "vertical";
    Direction["horizontal"] = "horizontal";
})(Direction || (Direction = {}));

var DefaultDataColor;
(function (DefaultDataColor) {
    DefaultDataColor["Sage"] = "#9EDBB6";
    DefaultDataColor["PastelOrange"] = "#FFCC83";
    DefaultDataColor["SkyBlue"] = "#8EC7FF";
    DefaultDataColor["SalmonPink"] = "#F99798";
    DefaultDataColor["Lavender"] = "#C0A8F4";
    DefaultDataColor["CottonCandyPink"] = "#FFBDF8";
    DefaultDataColor["MintGreen"] = "#A8F4AE";
    DefaultDataColor["PaleYellow"] = "#FFE68E";
    DefaultDataColor["CornflowerBlue"] = "#798ED6";
    DefaultDataColor["LightCyan"] = "#83F6FF";
})(DefaultDataColor || (DefaultDataColor = {}));
/** 一筆 Color[] 代表一個資料集的顏色，若 Color[] 陣列長度 > 1，則代表為漸層顏色 */
const DefaultDataColorArray = [
    [{ color: DefaultDataColor.Sage, opacity: 1 }],
    [{ color: DefaultDataColor.PastelOrange, opacity: 1 }],
    [{ color: DefaultDataColor.SkyBlue, opacity: 1 }],
    [{ color: DefaultDataColor.SalmonPink, opacity: 1 }],
    [{ color: DefaultDataColor.Lavender, opacity: 1 }],
    [{ color: DefaultDataColor.CottonCandyPink, opacity: 1 }],
    [{ color: DefaultDataColor.MintGreen, opacity: 1 }],
    [{ color: DefaultDataColor.PaleYellow, opacity: 1 }],
    [{ color: DefaultDataColor.CornflowerBlue, opacity: 1 }],
    [{ color: DefaultDataColor.LightCyan, opacity: 1 }],
];

/** 回傳 d3.selection fill 中需要的顏色 */
function getSelectionColor(selection, colors, elementId, elementIndex, direction = Direction.horizontal) {
    let returnColor = '';
    if (colors.length == 1) {
        returnColor =
            convertColourToColorType(colors[0].color).color +
                numberToHex(colors[0].opacity);
    }
    else {
        // 漸層色定義
        selection.selectAll(`defs.linearGradient[id^="${elementId}_"]`).remove();
        let lineGradient = selection
            .select(`defs.linearGradient#${elementId}_${elementIndex}`)
            .select(`linearGradient#gradient_${elementId}_${elementIndex}`);
        if (lineGradient.empty()) {
            lineGradient = selection
                .append('defs')
                .attr('class', 'linearGradient')
                .attr('id', `${elementId}_${elementIndex}`)
                .datum(colors)
                .append('linearGradient');
        }
        lineGradient
            .attr('id', `gradient_${elementId}_${elementIndex}`)
            .attr('x1', '0%')
            .attr('x2', direction == Direction.horizontal ? '100%' : '0%')
            .attr('y1', '0%')
            .attr('y2', direction == Direction.horizontal ? '0%' : '100%');
        for (let i = 0; i < colors.length; i++) {
            lineGradient
                .append('stop')
                .attr('offset', (100 / (colors.length - 1)) * i + '%')
                .style('stop-color', colors[i].color)
                .style('stop-opacity', colors[i].opacity);
        }
        returnColor = `url(#gradient_${elementId}_${elementIndex})`;
    }
    return returnColor;
}
/** 回傳 css color 中需要的顏色 */
function getCssColor(colors, direction = Direction.horizontal) {
    let returnColor = '';
    if (colors.length == 1) {
        returnColor =
            convertColourToColorType(colors[0].color).color +
                numberToHex(colors[0].opacity);
    }
    else {
        returnColor = `linear-gradient(${direction == Direction.horizontal ? '90' : '180'}deg,${colors.map((item) => `${convertColourToColorType(item.color).color + numberToHex(item.opacity)}`)})`;
    }
    return returnColor;
}
/** 從 DataSet [ ] 中將 colors:string [ ] 轉換成 Color [ ] [ ] */
function getColorTypeArray(DataSetWithDataArrays) {
    let colorTypeArray = [...DefaultDataColorArray];
    const colorArray = DataSetWithDataArrays.map((data) => {
        if (data.colors) {
            return data.colors.map((item) => {
                const color = convertColourToColorType(item);
                return color;
            });
        }
        else {
            return [];
        }
    });
    for (let i = 0; i < colorArray.length; i++) {
        colorTypeArray[i] =
            colorArray[i].length < 1 ? DefaultDataColorArray[i] : colorArray[i];
    }
    return colorTypeArray;
}
function numberToHex(num) {
    let hex = Math.round(num * 255).toString(16);
    if (hex.length == 1) {
        hex = '0' + hex;
    }
    return hex;
}
function convertColourToColorType(colour) {
    const colorString = colourNameToHex(colour);
    return colourToColorType(colorString);
}
function colourNameToHex(colour) {
    const colours = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrodyellow: '#fafad2',
        lightgrey: '#d3d3d3',
        lightgreen: '#90ee90',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370d8',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#d87093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32',
    };
    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];
    return colour;
}
function colourToColorType(colour) {
    if (colour.includes('rgb')) {
        let rgb = colour.split('(')[1].split(')');
        let opacity = 1;
        if (colour.includes('rgba')) {
            const rgba = colour.split('(')[1].split(')');
            rgb = rgba.slice(0, -1);
            opacity = Number(rgba[rgba.length - 1]);
        }
        const hex = rgb.map((x) => {
            x = parseInt(x).toString(16);
            return x.length == 1 ? '0' + x : x;
        });
        return {
            color: '#' + hex.join(''),
            opacity: opacity,
        };
    }
    else if (colour.includes('#')) {
        let color = '';
        let opacity = 1;
        switch (colour.length) {
            case 4:
                color = `#${colour[1]}${colour[1]}${colour[2]}${colour[2]}${colour[3]}${colour[3]}`;
                break;
            case 7:
                color = colour;
                break;
            case 5:
                color = colour.slice(0, -1);
                opacity = parseInt(colour.slice(-1), 16) / 15;
                break;
            case 9:
                color = colour.slice(0, -2);
                opacity = parseInt(colour.slice(-2), 16) / 255;
        }
        return {
            color: color,
            opacity: opacity,
        };
    }
    else {
        return {
            color: colour,
            opacity: 1,
        };
    }
}

var ColorType;
(function (ColorType) {
    ColorType["Grid"] = "#EEEEEE";
    ColorType["Axis"] = "#757575";
    ColorType["AxisLabel"] = "#757575";
    ColorType["Hint"] = "#FFFFFF";
    ColorType["HintBg"] = "#686868";
    ColorType["Title"] = "Black";
    ColorType["SubTitle"] = "#757575";
})(ColorType || (ColorType = {}));

var FontFamilyType;
(function (FontFamilyType) {
    FontFamilyType["Common"] = "\"PingFang TC\",\"Segoe UI\", \"Roboto\", \"\u5FAE\u8EDF\u6B63\u9ED1\u9AD4\", \"sans-serif\"";
})(FontFamilyType || (FontFamilyType = {}));
/** 標籤文字預設樣式 */
const DefaultLabel = {
    'font-size': '12px',
    'font-family': FontFamilyType.Common,
    'font-weight': '400',
    color: ColorType.AxisLabel,
};
/** 軸線文字預設樣式 */
const DefaultAxisLabel = {
    'font-size': '14px',
    'font-family': FontFamilyType.Common,
    'font-weight': '400',
    color: ColorType.AxisLabel,
};

/** key軸格線畫的位置
 * - `center` 格線畫在刻度中心
 * - `centerPadding` 格線畫在刻度中心，且兩邊多空出一格寬度
 * - `between` 格線畫在刻度兩邊
 */
var KeyGridlineAlignment;
(function (KeyGridlineAlignment) {
    KeyGridlineAlignment[KeyGridlineAlignment["center"] = 0] = "center";
    KeyGridlineAlignment[KeyGridlineAlignment["centerPadding"] = 1] = "centerPadding";
    KeyGridlineAlignment[KeyGridlineAlignment["between"] = 2] = "between";
})(KeyGridlineAlignment || (KeyGridlineAlignment = {}));
const DefaultGridConfig = {
    xlabelFontConfig: deepCopy(DefaultAxisLabel),
    ylabelFontConfig: deepCopy(DefaultAxisLabel),
    keyUnit: '',
    valueUnit: '',
    direction: Direction.vertical,
    keyGridlineAlignment: KeyGridlineAlignment.centerPadding,
    stepsCount: 5,
    bandwidth: 1,
    isUsePointerEvent: false,
    hoverColor: '#3333',
    hoverStrokeWidth: -1,
    activeIndex: -1,
    activeColor: '#3333',
    activeTextColor: '#3333',
    showHoverPoint: false,
    showHoverArea: true,
    showActiveArea: true,
    settingMin: [0, 0],
    settingMax: [0, 0],
    gridGap: { top: 0, bottom: 0, left: 0, right: 0 },
    isShowAxisLabel: true
};

/**
 * 基礎組件工廠
 */
class BasicFactory {
    isFirstUpdate = true;
    d3Operators;
    factoryId = getRandomId();
    setD3Operator(d3Operators) {
        this.d3Operators = d3Operators;
        return this;
    }
    /** 取得組件 id */
    getId() {
        return this.factoryId;
    }
    ExtendD3(d3) {
        if (this.d3Operators) {
            for (const configItem of this.d3Operators) {
                switch (configItem[0]) {
                    case D3Accessor.attr:
                        d3.attr(configItem[1], configItem[2]);
                        break;
                    case D3Accessor.style:
                        d3.style(configItem[1], configItem[2]);
                        break;
                }
            }
        }
    }
}

/** 格線定位組件，格線型圖表必須使用 */
class GridFactory extends BasicFactory {
    chart;
    gridGroup;
    gridState;
    gridConfig = deepCopy(DefaultGridConfig);
    dataSetWithDataArrays = [];
    // gridState 所有變數
    x = getScaleLinear(0, 0, 0, 0);
    xTop = getScaleLinear(0, 0, 0, 0);
    xGridlineBottom = getScaleLinear(0, 0, 0, 0);
    xGridlineTop = getScaleLinear(0, 0, 0, 0);
    y = getScaleLinear(0, 0, 0, 0);
    yRight = getScaleLinear(0, 0, 0, 0);
    yGridlineLeft = getScaleLinear(0, 0, 0, 0);
    yGridlineRight = getScaleLinear(0, 0, 0, 0);
    xGroup;
    xTopGroup;
    yGroup;
    yRightGroup;
    gridSize = { width: 0, height: 0 };
    gridMargin = { top: 0, bottom: 0, left: 0, right: 0 };
    axisValues = [{ minValue: 0, maxValue: 0 }];
    keyScaleLabels = [];
    keyScaleStep = 0;
    isVerticalLabel = false;
    labelRotateAngle = Math.PI / 3; // 60度
    xTextRectArray = [];
    // grid factory 私有變數
    /** 上一筆資料集，若資料集為空則使用這個 */
    lastDataSetsWithDataArray = [
        {
            label: '',
            colors: [],
            data: [{ key: '', value: 0 }],
        },
    ];
    gridId = getRandomId(8);
    pointerover$ = new Subject();
    pointerout$ = new Subject();
    click$ = new Subject();
    constructor(chart) {
        super();
        this.chart = chart;
        this.gridGroup = this.chart.svg.select(`g#gridFactory_${this.chart.id}_${this.gridId}`).node()
            ? this.chart.svg.select(`g#gridFactory_${this.chart.id}`)
            : this.chart.svg.append('g').attr('id', `gridFactory_${this.chart.id}_${this.gridId}`);
        this.xGroup = this.gridGroup.select('g#x').node()
            ? this.gridGroup.select('g#x')
            : this.gridGroup.append('g').attr('id', 'x');
        this.xTopGroup = this.gridGroup.select('g#x_top').node()
            ? this.gridGroup.select('g#x_top')
            : this.gridGroup.append('g').attr('id', 'x_top');
        this.yGroup = this.gridGroup.select('g#y').node()
            ? this.gridGroup.select('g#y')
            : this.gridGroup.append('g').attr('id', 'y');
        this.yRightGroup = this.gridGroup.select('g#y_right').node()
            ? this.gridGroup.select('g#y_right')
            : this.gridGroup.append('g').attr('id', 'y_right');
    }
    setConfig(config) {
        Object.assign(this.gridConfig, config);
        return this;
    }
    /** 設定資料，分為堆疊型與非堆疊型 */
    setDataSetWithDataArrays(dataSetWithDataArraysDetail) {
        this.dataSetWithDataArrays = dataSetWithDataArraysDetail.map((item) => item.dataSetWithDataArray);
        this.calculateMinMax(dataSetWithDataArraysDetail);
        return this;
    }
    /** 設定 value 軸的刻度等分數量，ex. 數值為 0 ~ 100，5 等分則每個刻度 20 */
    setStepsCount(stepsCount) {
        this.gridConfig.stepsCount = stepsCount;
        return this;
    }
    /** 設定 x 軸標籤文字樣式 */
    setXLabelFont(fontConfig) {
        Object.assign(this.gridConfig.xlabelFontConfig, fontConfig);
        return this;
    }
    /** 設定 y 軸標籤文字樣式 */
    setYLabelFont(fontConfig) {
        Object.assign(this.gridConfig.ylabelFontConfig, fontConfig);
        return this;
    }
    /** 設定 x 軸標籤單位文字 */
    setKeyLabelUnit(unit) {
        this.gridConfig.keyUnit = unit;
        return this;
    }
    /** 設定 y 軸標籤單位文字 */
    setValueLabelUnit(unit) {
        this.gridConfig.valueUnit = unit;
        return this;
    }
    /** 設定圖表呈現方向，預設為 vertical (key 在 x 軸，value 在 y 軸) */
    setDirection(direction) {
        this.gridConfig.direction = direction;
        return this;
    }
    /** 設定 key 軸格線繪製的位置
     * - `KeyGridlineAlignment.center` 格線畫在刻度中心
     * - `KeyGridlineAlignment.centerPadding` 格線畫在刻度中心，且兩邊多空出一格寬度
     * - `KeyGridlineAlignment.between` 格線畫在刻度兩邊
     */
    setKeyGridlineAlignment(keyGridlineAlignment) {
        this.gridConfig.keyGridlineAlignment = keyGridlineAlignment;
        return this;
    }
    /** 設定 key 軸頻帶寬度，數值介於 0 ~ 1 */
    setBandwidth(bandwidth) {
        this.gridConfig.bandwidth = Math.max(0, Math.min(1, bandwidth));
        return this;
    }
    /** 設定是否顯示 hover 的區域，需啟用 hover 功能 */
    setShowHoverArea(isShow) {
        this.gridConfig.showHoverArea = isShow;
        return this;
    }
    /** 設定是否顯示點擊後的選取區域，需啟用 hover 功能 */
    setShowActiveArea(isShow) {
        this.gridConfig.showActiveArea = isShow;
        return this;
    }
    /** 設定是否啟用 hover 功能 */
    setHover(isUsePointerEvent) {
        this.gridConfig.isUsePointerEvent = isUsePointerEvent;
        return this;
    }
    /** 設定 hover 區域的顏色 */
    setHoverColor(hoverColor) {
        this.gridConfig.hoverColor = hoverColor;
        return this;
    }
    /** 設定 hover 區域的寬度，預設為 -1 (-1代表不設定，寬度為一格 key軸 刻度) */
    setHoverStrokeWidth(strokeWidth) {
        this.gridConfig.hoverStrokeWidth = strokeWidth;
        return this;
    }
    /** 設定起始顯示點擊區間的索引值 */
    setActiveIndex(activeIndex) {
        this.gridConfig.activeIndex = activeIndex;
        return this;
    }
    /** 設定點擊後的選取區域的顏色 */
    setActiveColor(activeColor) {
        this.gridConfig.activeColor = activeColor;
        return this;
    }
    /** 設定點擊後的選取區域對應的 key 軸標籤文字顏色 */
    setActiveTextColor(activeTextColor) {
        this.gridConfig.activeTextColor = activeTextColor;
        return this;
    }
    /** 設定格線的最小數值(若最小值大於數據中的最小值，圖表會無視此項設定，自動計算該顯示的最小值)
     * @param min 最小值
     * @param axisIndex ? 第幾條 key 軸，預設為 0
     */
    setMinValue(min, axisIndex = 0) {
        this.gridConfig.settingMin[axisIndex == 0 ? 0 : 1] = min;
        return this;
    }
    /** 設定格線的最大數值(若最大值小於數據中的最大值，圖表會無視此項設定，自動計算該顯示的最大值)
     * @param max 最大值
     * @param axisIndex ? 第幾條 key 軸，預設為 0
     */
    setMaxValue(min, axisIndex = 0) {
        this.gridConfig.settingMax[axisIndex == 0 ? 0 : 1] = min;
        return this;
    }
    /** 設定格線與標籤的間距 */
    setGridGap(gridGap) {
        Object.assign(this.gridConfig.gridGap, gridGap);
        return this;
    }
    /** 設定顯示軸線標籤，(影響格線內推空間) */
    setShowAxisLabel(isShow) {
        this.gridConfig.isShowAxisLabel = isShow;
        return this;
    }
    getConfig() {
        return deepCopy(this.gridConfig);
    }
    getSelector() {
        return `gridFactory_${this.factoryId}`;
    }
    /** 取得 GridFactory 中不可被設定的值 */
    getState() {
        this.gridState = {
            id: this.chart.id,
            x: this.x,
            xTop: this.xTop,
            xGridlineBottom: this.xGridlineBottom,
            xGridlineTop: this.xGridlineTop,
            y: this.y,
            yRight: this.yRight,
            yGridlineLeft: this.yGridlineLeft,
            yGridlineRight: this.yGridlineRight,
            gridGroup: this.gridGroup,
            xGroup: this.xGroup,
            xTopGroup: this.xTopGroup,
            yGroup: this.yGroup,
            yRightGroup: this.yRightGroup,
            gridSize: this.gridSize,
            gridMargin: this.gridMargin,
            axisValues: this.axisValues,
            keyScaleLabels: this.keyScaleLabels,
            keyScaleStep: this.keyScaleStep,
            isVerticalLabel: this.isVerticalLabel,
            labelRotateAngle: this.labelRotateAngle,
            xTextRectArray: this.xTextRectArray,
        };
        return { ...this.gridState };
    }
    /** 監聽 Pointerover 事件 */
    onPointerover() {
        return this.pointerover$.asObservable();
    }
    /** 監聽 Pointerout 事件 */
    onPointerout() {
        return this.pointerout$.asObservable();
    }
    /** 監聽點擊選取區間的事件 */
    onClick() {
        return this.click$.asObservable();
    }
    /** pointerover 觸發的事件 */
    pointeroverEvent(keyIndex, data, nearestDataIndex, event) {
        setTimeout(() => {
            const el = document.querySelector(`path#hover-area_${this.chart.id}`);
            this.pointerover$.next({
                keyIndex: keyIndex,
                data: this.dataSetWithDataArrays.length > 0 ? data : [],
                nearestDataIndex: nearestDataIndex,
                event: event,
                element: el,
            });
        }, 0);
    }
    /** pointerout 觸發的事件 */
    pointeroutEvent(event) {
        this.pointerout$.next(event);
    }
    /** 格線中點擊選取區間的事件 */
    clickEvent(keyIndex, data, nearestDataIndex, event) {
        this.gridConfig.activeIndex = keyIndex;
        setTimeout(() => {
            const el = document.querySelector(`path#active-area_${this.chart.id}`);
            this.click$.next({
                keyIndex: keyIndex,
                data: this.dataSetWithDataArrays.length > 0 ? data : [],
                nearestDataIndex: nearestDataIndex,
                event: event,
                element: el,
            });
        }, 0);
    }
    /** 計算最大最小值 */
    calculateMinMax(dataSetWithDataArraysDetail) {
        if (dataSetWithDataArraysDetail.length < 1)
            return; // 空值不計算
        // 左右軸線最大最小值
        const axisValues = [
            {
                minValue: this.gridConfig.settingMin[0],
                maxValue: this.gridConfig.settingMax[0],
            },
        ];
        const stackDataSetWithDataArrays = []; // 堆疊的所有資料集合
        let stackAxisIndex = 0; // 堆疊軸線所引值
        for (const DataSetWithDataArrayDetail of dataSetWithDataArraysDetail) {
            const axisIndex = DataSetWithDataArrayDetail.axisIndex || 0;
            if (axisIndex >= axisValues.length) {
                axisValues.length = axisIndex + 1;
                axisValues[axisIndex] = {
                    minValue: this.gridConfig.settingMin[1],
                    maxValue: this.gridConfig.settingMax[0],
                };
            }
            // 堆疊與非堆疊型分開計算
            if (DataSetWithDataArrayDetail.isStack) {
                stackAxisIndex = DataSetWithDataArrayDetail.axisIndex || 0;
                stackDataSetWithDataArrays.push(DataSetWithDataArrayDetail.dataSetWithDataArray);
            }
            else {
                const valueArray = DataSetWithDataArrayDetail.dataSetWithDataArray.data.map((item) => Number(item.value));
                const dataMinValue = Math.min(...valueArray);
                const dataMaxValue = Math.max(...valueArray);
                axisValues[axisIndex].minValue = Math.min(dataMinValue, axisValues[axisIndex].minValue);
                axisValues[axisIndex].maxValue = Math.max(dataMaxValue, axisValues[axisIndex].maxValue);
            }
        }
        // 計算堆疊最大最小值
        let stacksMaxPositive = 0;
        let stacksMaxNegetive = 0;
        if (stackDataSetWithDataArrays.length > 0) {
            const categories = stackDataSetWithDataArrays[0].data.map((d) => d.key);
            const stackData = categories.map((category, i) => {
                let obj = { name: category };
                stackDataSetWithDataArrays.forEach((d) => {
                    obj[d.label] = d.data[i].value;
                });
                return obj;
            });
            for (const stackDataItem of stackData) {
                const keys = Object.keys(stackDataItem);
                let stackMaxPositive = 0;
                let stackMaxNegetive = 0;
                for (let i = 1; i < keys.length; i++) {
                    const value = stackDataItem[keys[i]];
                    if (value > 0) {
                        stackMaxPositive += value;
                    }
                    else {
                        stackMaxNegetive += value;
                    }
                }
                stacksMaxPositive = Math.max(stacksMaxPositive, stackMaxPositive);
                stacksMaxNegetive = Math.min(stacksMaxNegetive, stackMaxNegetive);
            }
        }
        for (const [i, axisValue] of axisValues.entries()) {
            const minValue = Math.min(axisValue.minValue, stackAxisIndex == i ? stacksMaxNegetive : 0, this.gridConfig.settingMin[i]);
            const maxValue = Math.max(axisValue.maxValue, stackAxisIndex == i ? stacksMaxPositive : 0, this.gridConfig.settingMax[i]);
            const [modifiedMin, modifiedMax] = getPrettyMinMax(minValue, maxValue, this.gridConfig.stepsCount);
            this.axisValues[i] = { minValue: modifiedMin, maxValue: modifiedMax };
        }
    }
    calcGridSize() {
        this.gridSize = {
            width: this.chart.size.width - this.gridMargin.left - this.gridMargin.right,
            height: this.chart.size.height - this.gridMargin.top - this.gridMargin.bottom,
        };
    }
    draw(useAnimation) {
        const isPaddingOuter = this.gridConfig.keyGridlineAlignment == KeyGridlineAlignment.centerPadding;
        // 無資料或全部資料為空，則以上一筆資料設定格狀
        const dataSetWithDataArrays = this.dataSetWithDataArrays.length < 1
            ? this.lastDataSetsWithDataArray
            : this.dataSetWithDataArrays;
        const keySet = new Set();
        // 遍歷每個 dataset，收集所有的 key
        dataSetWithDataArrays.forEach((dataset) => {
            dataset.data.forEach((item) => {
                keySet.add(item.key);
            });
        });
        this.keyScaleLabels = Array.from(keySet);
        //#region 計算標籤文字長寬，x軸計算第一個與最後一個，y軸計算長度最長的
        /** 每個軸線的所有 tick */
        const axisValueTicks = [];
        for (const axisValue of this.axisValues) {
            const valueRange = Math.abs(axisValue.maxValue - axisValue.minValue);
            const axisValueTick = d3.range(axisValue.minValue, axisValue.maxValue + 1, valueRange / this.gridConfig.stepsCount);
            // 加上千分位
            axisValueTicks.push(axisValueTick.map((item) => item.toLocaleString()));
        }
        // 顯示軸線標籤時，計算格線內推距離
        if (this.gridConfig.isShowAxisLabel) {
            const keyRectArray = [];
            for (const scaleBandKey of this.keyScaleLabels) {
                const keyRect = getTextRect(scaleBandKey + this.gridConfig.keyUnit, this.gridConfig.xlabelFontConfig['font-family'], this.gridConfig.xlabelFontConfig['font-size'], this.gridConfig.xlabelFontConfig['font-weight']);
                keyRectArray.push(keyRect);
            }
            /** 計算每個軸線標籤 Rect */
            const valueRectArray = axisValueTicks.map((axisitem) => axisitem.map((pointItem) => getTextRect(pointItem + this.gridConfig.valueUnit, this.gridConfig.ylabelFontConfig['font-family'], this.gridConfig.ylabelFontConfig['font-size'], this.gridConfig.ylabelFontConfig['font-weight'])));
            const xTextRectArray = this.gridConfig.direction == Direction.vertical
                ? [...keyRectArray]
                : [...valueRectArray[0]];
            const xFirstTextRect = xTextRectArray[0];
            const xLastTextRect = xTextRectArray[xTextRectArray.length - 1];
            const xMaxTextRect = xTextRectArray.length > 0
                ? xTextRectArray.reduce((maxItem, item) => {
                    return item.width > maxItem.width ? item : maxItem;
                }, xTextRectArray[0])
                : { width: 0, height: 0 };
            this.xTextRectArray = xTextRectArray;
            const yLeftTextRectArray = this.gridConfig.direction == Direction.vertical
                ? valueRectArray[0]
                : [...keyRectArray];
            const yLeftMaxTextRect = yLeftTextRectArray.reduce((maxItem, item) => {
                return item.width > maxItem.width ? item : maxItem;
            }, yLeftTextRectArray[0]) || { width: 0, height: 0 };
            // 垂直且有兩個以上的y軸
            const yRightMaxTextRect = this.axisValues.length > 1
                ? valueRectArray[1].reduce((maxItem, item) => {
                    return item.width > maxItem.width ? item : maxItem;
                }, valueRectArray[1][0]) || { width: 0, height: 0 }
                : new DOMRect();
            this.gridMargin = {
                top: Math.max(this.gridConfig.gridGap.top, yLeftMaxTextRect.height / 2),
                bottom: Math.max(xFirstTextRect.height + this.gridConfig.gridGap.bottom, yLeftMaxTextRect.height / 2),
                left: Math.max(yLeftMaxTextRect.width + this.gridConfig.gridGap.left, xFirstTextRect.width / 2) + 2,
                right: Math.max(yRightMaxTextRect.width + this.gridConfig.gridGap.right, xLastTextRect.width / 2) + 2,
            };
            this.calcGridSize();
            //#region 計算格狀定為step，若字串最大長度大於step則將x軸標籤轉成斜的
            const scaleStepCount = Math.max(this.keyScaleLabels.length -
                1 +
                (isPaddingOuter ? 2 : 0), 1);
            const scaleStep = this.gridSize.width / scaleStepCount;
            this.isVerticalLabel = xMaxTextRect.width > scaleStep; //若字串最大長度大於step則將x軸標籤轉成斜的
            this.labelRotateAngle = Math.PI / 3; // 旋轉角度60度
            const oneLetterRotateWidth = xMaxTextRect.height * Math.cos(this.labelRotateAngle); // 一個字旋轉後的寬度
            const rotateHeight = (xMaxTextRect.width + xMaxTextRect.height) *
                Math.sin(this.labelRotateAngle) -
                xFirstTextRect.height / 2; // 旋轉後的高，xMaxTextRect.height 為單一字元寬度
            const rotateWidth = xMaxTextRect.width * Math.cos(this.labelRotateAngle); // 旋轉後的寬
            // 重新計算 gridMargin
            this.gridMargin.left =
                Math.max(yLeftMaxTextRect.width + this.gridConfig.gridGap.left, this.isVerticalLabel
                    ? rotateWidth -
                        (isPaddingOuter ? scaleStep : 0) -
                        oneLetterRotateWidth
                    : xFirstTextRect.width / 2 -
                        (isPaddingOuter ? scaleStep : 0)) + 2;
            this.gridMargin.right =
                Math.max(yRightMaxTextRect.width + this.gridConfig.gridGap.right, this.isVerticalLabel
                    ? oneLetterRotateWidth -
                        (isPaddingOuter ? scaleStep : 0)
                    : xLastTextRect.width / 2 -
                        (isPaddingOuter &&
                            this.gridConfig.direction == Direction.vertical
                            ? scaleStep
                            : 0)) + 2;
            this.gridMargin.bottom = Math.max(this.gridConfig.gridGap.bottom +
                (this.isVerticalLabel ? rotateHeight : xFirstTextRect.height), yLeftMaxTextRect.height / 2);
            //#endregion
        }
        else {
            this.gridMargin = {
                top: this.gridConfig.gridGap.top,
                bottom: this.gridConfig.gridGap.bottom + 2,
                left: this.gridConfig.gridGap.left,
                right: this.gridConfig.gridGap.right + 2,
            };
        }
        this.calcGridSize();
        this.gridGroup
            .transition()
            .duration(useAnimation ? 500 : 0)
            .attr('transform', `translate(${this.gridMargin.left}, ${this.gridMargin.top})`);
        //#region x y scacle 設定
        const paddingOuter = (() => {
            switch (this.gridConfig.keyGridlineAlignment) {
                case KeyGridlineAlignment.between: return 0.5;
                case KeyGridlineAlignment.centerPadding: return 1;
                default: return 0;
            }
        })();
        const bandwidth = 1 - this.gridConfig.bandwidth;
        if (this.gridConfig.direction == Direction.vertical) {
            this.xGridlineBottom = getScaleBand(this.keyScaleLabels, 0, this.gridSize.width, bandwidth, paddingOuter);
            this.y = getScaleLinear(this.axisValues[0].minValue, this.axisValues[0].maxValue, this.gridSize.height, 0);
            this.yGridlineLeft = getScaleBand(axisValueTicks[0].map((item) => item.toString()), this.gridSize.height, 0, 1);
            // 右方 Y 軸
            if (this.axisValues.length > 1) {
                this.yRight = getScaleLinear(this.axisValues[1].minValue, this.axisValues[1].maxValue, this.gridSize.height, 0);
                this.yGridlineRight = getScaleBand(axisValueTicks[1].map((item) => item.toString()), this.gridSize.height, 0, 1);
            }
        }
        else {
            this.x = getScaleLinear(this.axisValues[0].minValue, this.axisValues[0].maxValue, 0, this.gridSize.width);
            this.xGridlineBottom = getScaleBand(axisValueTicks[0].map((item) => item.toString()), 0, this.gridSize.width, 1);
            this.yGridlineLeft = getScaleBand(this.keyScaleLabels, this.gridSize.height, 0, bandwidth, paddingOuter);
            // 上方 X 軸
            if (this.axisValues.length > 1) {
                this.xTop = getScaleLinear(this.axisValues[1].minValue, this.axisValues[1].maxValue, 0, this.gridSize.width);
                this.xGridlineTop = getScaleBand(axisValueTicks[1].map((item) => item.toString()), 0, this.gridSize.width, 1);
            }
        }
        this.keyScaleStep =
            this.gridConfig.direction == Direction.vertical
                ? this.xGridlineBottom.step()
                : this.yGridlineLeft.step();
        //#endregion
        this.getState();
        // hover effect
        if (this.gridConfig.isUsePointerEvent) {
            setTimeout(() => {
                hoverPosition(this.chart, this.gridState, this.gridConfig, this.lastDataSetsWithDataArray, getColorTypeArray(this.dataSetWithDataArrays), this.pointeroverEvent.bind(this), this.pointeroutEvent.bind(this), this.clickEvent.bind(this));
            }, 0);
        }
        else {
            this.chart.svg
                .selectAll(`g#grid-hover-view_${this.gridState.id}_${this.gridId}`)
                .remove();
            this.chart.svg
                .selectAll(`g#grid-hover-effects_${this.gridState.id}_${this.gridId}`)
                .remove();
        }
        this.lastDataSetsWithDataArray = deepCopy(this.dataSetWithDataArrays);
    }
    clear(useAnimation) {
        this.gridGroup
            .selectAll('path')
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove();
    }
}
/** 取得比例尺-線性刻度: 連續的數值 */
function getScaleLinear(domainS, domainE, rangeS, rangeE) {
    return d3.scaleLinear().domain([domainS, domainE]).range([rangeS, rangeE]);
}
/** 取得比例尺-非線性刻度: ex: 非連續性資料像是性別或人名或是任意的資料集*/
function getScaleBand(keys, rangeS, rangeE, bandwidth, paddingOuter = 0) {
    return d3
        .scaleBand()
        .domain(keys)
        .range([rangeS, rangeE])
        .padding(bandwidth)
        .paddingOuter(paddingOuter - (1 - bandwidth) / 2);
}
/** hover 顯示當前x位置的所有點 */
function hoverPosition(rootChart, gridState, gridConfig, data, colors, hoverCallback, pointeroutCallback, clickCallback) {
    let lastIndex = -1;
    let lastPostion = -1; // 計算滑鼠移動
    let nearestIndex = -1; // 距離滑鼠最近的數據組索引值
    let activeIndex = gridConfig.activeIndex;
    const id = rootChart.id;
    const isVertical = gridConfig.direction == Direction.vertical;
    const step = isVertical
        ? gridState.xGridlineBottom.step()
        : gridState.yGridlineLeft.step();
    const dataLength = data[0].data.length;
    const isPaddingOuter = gridConfig.keyGridlineAlignment == KeyGridlineAlignment.centerPadding;
    //#region 元素生成
    rootChart.svg.selectAll(`g#grid-hover-effects_${id}`).remove();
    rootChart.svg.selectAll(`g#grid-hover-view_${id}`).remove();
    const hoverViewGroup = rootChart.svg
        .insert('g', `g#gridFactory_${id}`)
        .attr('id', `grid-hover-view_${id}`);
    const hoverEffectsGroup = rootChart.svg
        .append('g')
        .attr('id', `grid-hover-effects_${id}`);
    hoverViewGroup
        .append('path')
        .attr('id', `hover-area_${id}`)
        .attr('stroke', gridConfig.hoverColor)
        .style('opacity', '0');
    hoverViewGroup
        .append('path')
        .attr('id', `active-area_${id}`)
        .attr('stroke', gridConfig.activeColor)
        .style('opacity', '0');
    const pointOfData = hoverViewGroup
        .selectAll(`#point-of-data_${id}`)
        .data(data)
        .enter()
        .append('g')
        .attr('id', `point-of-data_${id}`);
    const selector = `path#active-area_${id}`;
    drawArea(activeIndex, step, false);
    d3.select(selector).style('opacity', 0);
    if (gridConfig.isUsePointerEvent && gridConfig.showActiveArea && activeIndex >= 0) {
        d3.select(selector).style('opacity', 1);
    }
    if (gridConfig.showHoverPoint) {
        pointOfData
            .append('circle')
            .datum((d) => d)
            .attr('r', 7)
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('fill', (d, i) => {
            return colors[i][0].color;
        })
            .style('opacity', '0');
    }
    //#endregion
    //#region 共用方法
    /** 滑鼠事件取得當前 key 軸 index */
    function getIndex(event) {
        const pointer = d3.pointer(event);
        let index = 0;
        const step = isVertical
            ? gridState.xGridlineBottom.step()
            : gridState.yGridlineLeft.step();
        if (dataLength > 1) {
            if (isVertical) {
                index = Math.round((pointer[0] - gridState.gridMargin.left) / step);
            }
            else {
                index = Math.round((pointer[1] - gridState.gridMargin.top) / step);
            }
        }
        // 若存在左右邊界，校正位置
        if (isPaddingOuter) {
            if (index > 0 && index < dataLength + 1) {
                index -= 1;
            }
            else if (index > dataLength) {
                index = dataLength - 1;
            }
        }
        return isVertical ? index : dataLength - index - 1;
    }
    /** 檢查當前 index 是否要顯示區間，並回傳資料 */
    function checkIndexAndData(index) {
        const shouldShow = gridConfig.showHoverArea &&
            (activeIndex !== index || !gridConfig.showActiveArea);
        d3.select(`#hover-area_${id}`).style('opacity', shouldShow ? '1' : '0');
        d3.selectAll(`#point-of-data_${id} circle`).style('opacity', shouldShow ? '1' : '0');
        return data.map((item) => {
            return {
                label: item.label,
                data: [item.data[index]],
                colors: item.colors,
            };
        });
    }
    /** 畫出區域 */
    function drawArea(index, step, isUsePointerEvent = true) {
        let position = dataLength < 2
            ? 0.5 * step
            : (isVertical ? index : dataLength - index - 1) * step;
        position += isVertical
            ? gridState.gridMargin.left
            : gridState.gridMargin.top;
        position = isPaddingOuter ? position + step : position;
        // 畫出 hover 區域
        const selector = isUsePointerEvent ? `#hover-area_${id}` : `path#active-area_${id}`;
        d3.select(selector)
            .attr('d', () => {
            let d = '';
            if (isVertical) {
                d =
                    'M' +
                        position +
                        ',' +
                        (gridState.gridSize.height + gridState.gridMargin.top);
                d += ' ' + position + ',' + gridState.gridMargin.top;
            }
            else {
                d =
                    'M' +
                        (gridState.gridSize.width + gridState.gridMargin.left) +
                        ',' +
                        position;
                d += ' ' + gridState.gridMargin.left + ',' + position;
            }
            return d;
        })
            .attr('stroke-width', () => {
            let width = gridConfig.hoverStrokeWidth < 0 ? step : gridConfig.hoverStrokeWidth;
            if (!isPaddingOuter &&
                (index == 0 || index == dataLength - 1)) {
                width /= 2;
            }
            return `${width}px`;
        })
            .style('transform', () => {
            let translate = 0;
            const stepWidth = gridConfig.hoverStrokeWidth < 0 ? step : gridConfig.hoverStrokeWidth;
            if (!isPaddingOuter) {
                if (index == 0) {
                    translate = gridConfig.hoverStrokeWidth < 0 ? stepWidth / 4 : stepWidth / 2;
                }
                else if (index == dataLength - 1) {
                    translate = gridConfig.hoverStrokeWidth < 0 ? -stepWidth / 4 : -stepWidth / 2;
                }
            }
            return `translate${isVertical ? 'X' : 'Y'}(${translate}px)`;
        })
            .style('opacity', 1);
        if (!isUsePointerEvent && gridConfig.showActiveArea) {
            setTimeout(() => {
                d3.select(`g#gridFactory_${id}`)
                    .select(isVertical ? 'g#x' : 'g#y')
                    .selectAll('g.tick')
                    .filter((d, i) => i == index)
                    .select('text')
                    .style('fill', gridConfig.activeTextColor);
            }, 0);
        }
        return position;
    }
    //#endregion
    // 事件處理
    hoverEffectsGroup
        .append('svg:rect')
        .attr('class', 'hover-bounding')
        .attr('id', id)
        .attr('width', gridState.gridSize.width)
        .attr('height', gridState.gridSize.height)
        .attr('x', gridState.gridMargin.left)
        .attr('y', gridState.gridMargin.top)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('pointerout', (event) => {
        d3.select(`#hover-area_${id}`).style('opacity', '0');
        d3.selectAll(`#point-of-data_${id} circle`).style('opacity', '0');
        lastPostion = -1;
        pointeroutCallback(event);
    })
        .on('pointerover', (event) => {
        const index = getIndex(event);
        checkIndexAndData(index);
    })
        .on('pointermove', (event) => {
        // const elements = document.elementsFromPoint(event.x, event.y);
        const index = getIndex(event);
        const position = drawArea(index, step);
        const hoverData = checkIndexAndData(index);
        lastIndex = index;
        const dataPointTransformArray = [];
        // hover key 軸上的點
        d3.selectAll(`#point-of-data_${id}`).attr('transform', function (d, i) {
            // 變換顯示線條時改變tooltip
            if (lastPostion != position) {
                lastPostion = position;
            }
            let x = isVertical
                ? position
                : gridState.xGridlineBottom(d.data[d.data.length - index - 1].value);
            let y = isVertical
                ? gridState.y(d.data[index].value) +
                    gridState.gridMargin.top
                : position;
            x = isNaN(x) ? 0 : x;
            y = isNaN(y) ? 0 : y;
            const transform = `translate(${x},${y})`;
            // console.log(y)
            dataPointTransformArray.push({ x: x, y: y });
            return transform;
        });
        //#region 計算最近的資料點
        const pointer = d3.pointer(event);
        const x = pointer[0];
        const y = pointer[1];
        let minDistance = Infinity;
        nearestIndex = -1;
        for (const [i, dataPointTransform] of dataPointTransformArray.entries()) {
            const dx = dataPointTransform.x - x;
            const dy = dataPointTransform.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < minDistance) {
                minDistance = distance;
                nearestIndex = i;
            }
        }
        //#endregion
        hoverCallback(index, hoverData, nearestIndex, event);
    })
        .on('click', function (event) {
        const index = getIndex(event);
        d3.select(`g#gridFactory_${id}`)
            .select(isVertical ? 'g#x' : 'g#y')
            .selectAll('g.tick')
            .filter((d, i) => i == activeIndex)
            .select('text')
            .style('fill', ColorType.AxisLabel);
        activeIndex = index;
        drawArea(index, step, false);
        if (!gridConfig.showActiveArea) {
            const selector = `path#active-area_${id}`;
            d3.select(selector).style('opacity', 0);
        }
        const clickData = checkIndexAndData(index);
        clickCallback(index, clickData, nearestIndex, event);
    });
}
/** 取得漂亮的最小值與最大值，且可平分為 n 個刻度 */
function getPrettyMinMax(min, max, stepsCount) {
    if (stepsCount < 2)
        return [min, max];
    const range = Math.abs(max - min);
    const rawStep = range / stepsCount; // 原始刻度一格單位長度
    const ticks = [];
    for (let i = 0; i <= stepsCount; i++) {
        ticks.push(rawStep * i + min);
    }
    // 取出ticks中最接近0的index
    const nearZeroIndex = ticks.reduce((minIndex, item, index, src) => Math.abs(item) < Math.abs(src[minIndex]) ? index : minIndex, 0);
    // 計算正負比例，ex. ticks = [-3,2,7,12]; 正負比例為 1:2;
    let negativeRatio = nearZeroIndex + (nearZeroIndex == 0 && ticks[0] < 0 ? 1 : 0); // nearZeroIndex 為 0 且 ticks[0] < 0 需 + 1
    let positiveRatio = ticks.length - negativeRatio - 1;
    if (positiveRatio == 0 && ticks[ticks.length - 1] > 0) {
        positiveRatio += 1;
        negativeRatio -= 1;
    }
    const negativeStep = negativeRatio > 0 ? Math.abs(min / negativeRatio) : 0;
    const positiveStep = positiveRatio > 0 ? Math.abs(max / positiveRatio) : 0;
    const nAndPStep = Math.max(negativeStep, positiveStep); // 正負計算後的刻度一格單位長度
    const modifiedStep = Math.ceil(nAndPStep / 5) * 5; // step改成漂亮的數字(5的倍數)
    const modifiedMin = -modifiedStep * negativeRatio;
    const modifiedMax = modifiedStep * positiveRatio;
    return [modifiedMin, modifiedMax];
}

const DefaultGridlineConfig = {
    gridRow: {
        stroke: ColorType.Grid,
        'stroke-width': 1,
        'stroke-dasharray': 'unset',
        'stroke-linecap': 'butt'
    },
    gridCol: {
        stroke: ColorType.Grid,
        'stroke-width': 1,
        'stroke-dasharray': 'unset',
        'stroke-linecap': 'butt'
    },
    xAxis: {
        stroke: ColorType.Grid,
        'stroke-width': 1,
        'stroke-dasharray': 'unset',
        'stroke-linecap': 'butt'
    },
    yAxis: {
        stroke: ColorType.Grid,
        'stroke-width': 1,
        'stroke-dasharray': 'unset',
        'stroke-linecap': 'butt'
    },
    showBorder: true,
    tickInterval: 1
};

/** 格線組件，需繪製在 GridFactory 上 */
class GridlineFactory extends BasicFactory {
    gridFactory;
    gridState;
    gridConfig;
    gridlineConfig = deepCopy(DefaultGridlineConfig);
    constructor(gridFactory) {
        super();
        this.gridFactory = gridFactory;
        this.gridState = gridFactory.getState();
        this.gridConfig = gridFactory.getConfig();
    }
    /** 設定要被繪製在哪個 GridFactory 上 */
    setGridFactory(gridFactory) {
        this.gridFactory = gridFactory;
        return this;
    }
    setConfig(gridlineConfig) {
        Object.assign(this.gridlineConfig, gridlineConfig);
        return this;
    }
    /** 設定橫向格線的樣式 */
    setGridRow(gridlineSetting) {
        Object.assign(this.gridlineConfig.gridRow, gridlineSetting);
        return this;
    }
    /** 設定縱向格線的樣式 */
    setGridCol(gridlineSetting) {
        Object.assign(this.gridlineConfig.gridCol, gridlineSetting);
        return this;
    }
    /** 設定X軸線的樣式 */
    setXAxis(gridlineSetting) {
        Object.assign(this.gridlineConfig.xAxis, gridlineSetting);
        return this;
    }
    /** 設定Y軸線的樣式 */
    setYAxis(gridlineSetting) {
        Object.assign(this.gridlineConfig.yAxis, gridlineSetting);
        return this;
    }
    getSelector() {
        return ``;
    }
    getConfig() {
        return this.gridlineConfig;
    }
    draw(useAnimation = true) {
        this.gridState = this.gridFactory.getState();
        this.gridConfig = this.gridFactory.getConfig();
        const isVertical = this.gridConfig.direction == Direction.vertical;
        const isBetween = this.gridConfig.keyGridlineAlignment == KeyGridlineAlignment.between;
        //#region X
        const xConfig = d3
            .axisBottom(this.gridState.xGridlineBottom)
            .tickSize(-this.gridState.gridSize.height)
            .tickFormat((d) => {
            return (d + (isVertical ? this.gridConfig.keyUnit : this.gridConfig.valueUnit));
        });
        const gridXGroup = this.gridState.xGroup
            .attr('transform', `translate(0, ${this.gridState.gridSize.height})`)
            .attr('pointer-events', 'none')
            .call((selection) => selection.transition().duration(useAnimation ? 500 : 0))
            .call(xConfig);
        if (this.gridConfig.isShowAxisLabel) {
            gridXGroup
                .selectAll('.tick text')
                .attr('transform', (d, i) => {
                const rotateHeight = (this.gridState.xTextRectArray[i].width *
                    Math.sin(this.gridState.labelRotateAngle)) /
                    2; // 旋轉後的高
                const rotateWidth = (this.gridState.xTextRectArray[i].width *
                    Math.cos(this.gridState.labelRotateAngle)) /
                    2; // 旋轉後的寬
                const translateX = this.gridState.isVerticalLabel
                    ? `${-rotateWidth}`
                    : '0';
                const translateY = this.gridConfig.gridGap.bottom +
                    (this.gridState.isVerticalLabel ? rotateHeight : 0);
                const translate = `translate(${translateX}, ${translateY})`;
                const rotate = this.gridState.isVerticalLabel
                    ? `rotate(-${(this.gridState.labelRotateAngle * 180) / Math.PI})`
                    : '';
                return `${translate} ${rotate}`;
            })
                .attr('font-size', this.gridConfig.xlabelFontConfig['font-size'])
                .attr('font-weight', this.gridConfig.xlabelFontConfig['font-weight'])
                .attr('font-family', this.gridConfig.xlabelFontConfig['font-family'])
                .attr('line-height', 1)
                .style('user-select', 'none')
                .style('fill', this.gridConfig.xlabelFontConfig.color);
        }
        else {
            gridXGroup.selectAll('.tick text').remove();
        }
        gridXGroup
            .selectAll('.tick line')
            .attr('stroke', this.gridlineConfig.gridCol.stroke)
            .attr('stroke-width', this.gridlineConfig.gridCol['stroke-width'])
            .attr('stroke-linecap', this.gridlineConfig.gridCol['stroke-linecap'])
            .attr('transform', `translate(${isBetween
            ? this.gridState.xGridlineBottom.bandwidth()
            : 0},0)`);
        gridXGroup.select('path.domain').attr('stroke', 'none');
        // 上方 X 軸
        if (this.gridState.axisValues.length > 1) {
            const xTopConfig = d3
                .axisTop(this.gridState.xGridlineTop)
                .tickSize(-this.gridState.gridSize.height)
                .tickFormat((d) => {
                return (d +
                    (isVertical ? this.gridConfig.keyUnit : this.gridConfig.valueUnit));
            });
            if (this.gridConfig.direction == Direction.vertical) {
                this.gridState.xTopGroup.selectAll('*').remove();
            }
            else {
                const gridXTopGroup = this.gridState.xTopGroup
                    .attr('transform', `translate(0, 0)`)
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(useAnimation ? 500 : 0)
                    .call(xTopConfig);
                if (this.gridConfig.isShowAxisLabel) {
                    gridXTopGroup
                        .selectAll('.tick text')
                        .attr('transform', `translate(0, ${this.gridConfig.gridGap.top})`)
                        .attr('font-size', this.gridConfig.xlabelFontConfig['font-size'])
                        .attr('font-weight', this.gridConfig.xlabelFontConfig['font-weight'])
                        .attr('font-family', this.gridConfig.xlabelFontConfig['font-family'])
                        .style('user-select', 'none')
                        .style('fill', this.gridConfig.xlabelFontConfig.color);
                }
                else {
                    gridXTopGroup.selectAll('.tick text').remove();
                }
                gridXTopGroup
                    .selectAll('.tick line')
                    .attr('stroke', this.gridlineConfig.gridCol.stroke)
                    .attr('stroke-width', this.gridlineConfig.gridCol['stroke-width'])
                    .attr('transform', `translate(${isBetween
                    ? this.gridState.xGridlineTop.bandwidth()
                    : 0},0)`);
                gridXTopGroup.select('path.domain').attr('stroke', 'none');
            }
        }
        //#endregion
        //#region Y
        const yConfig = d3
            .axisLeft(this.gridState.yGridlineLeft)
            .tickSize(-this.gridState.gridSize.width)
            .tickFormat((d) => {
            return (d + (isVertical ? this.gridConfig.valueUnit : this.gridConfig.keyUnit));
        });
        const gridYGroup = this.gridState.yGroup
            .attr('pointer-events', 'none')
            .call((selection) => selection.transition().duration(useAnimation ? 500 : 0))
            .call(yConfig);
        if (this.gridConfig.isShowAxisLabel) {
            gridYGroup
                .selectAll('.tick text')
                .attr('transform', `translate(${-this.gridConfig.gridGap.left}, 0)`)
                .attr('font-size', this.gridConfig.ylabelFontConfig['font-size'])
                .attr('font-weight', this.gridConfig.ylabelFontConfig['font-weight'])
                .attr('font-family', this.gridConfig.ylabelFontConfig['font-family'])
                .attr('line-height', 1)
                .style('user-select', 'none')
                .style('fill', this.gridConfig.ylabelFontConfig.color);
        }
        else {
            gridYGroup.selectAll('.tick text').remove();
        }
        gridYGroup
            .selectAll('.tick line')
            .attr('stroke', this.gridlineConfig.gridRow.stroke)
            .attr('stroke-width', this.gridlineConfig.gridRow['stroke-width'])
            .attr('stroke-linecap', this.gridlineConfig.gridRow['stroke-linecap'])
            .attr('transform', `translate(0, ${isBetween
            ? this.gridState.yGridlineLeft.bandwidth()
            : 0})`);
        gridYGroup.select('path.domain').attr('stroke', 'none');
        // 右方 Y 軸
        if (this.gridState.axisValues.length > 1) {
            const yRightConfig = d3
                .axisRight(this.gridState.yGridlineRight)
                .tickSize(-this.gridState.gridSize.width)
                .ticks(10)
                .tickFormat((d) => {
                return (d +
                    (isVertical ? this.gridConfig.valueUnit : this.gridConfig.keyUnit));
            });
            if (this.gridConfig.direction == Direction.horizontal) {
                this.gridState.yRightGroup.selectAll('*').remove();
            }
            else {
                const gridYRightGroup = this.gridState.yRightGroup
                    .attr('transform', `translate(${this.gridState.gridSize.width}, 0)`)
                    .attr('pointer-events', 'none')
                    .transition()
                    .duration(useAnimation ? 500 : 0)
                    .call(yRightConfig);
                if (this.gridConfig.isShowAxisLabel) {
                    gridYRightGroup
                        .selectAll('.tick text')
                        .attr('transform', `translate(${this.gridConfig.gridGap.right}, 0)`)
                        .attr('font-size', this.gridConfig.ylabelFontConfig['font-size'])
                        .attr('font-weight', this.gridConfig.ylabelFontConfig['font-weight'])
                        .attr('font-family', this.gridConfig.ylabelFontConfig['font-family'])
                        .style('user-select', 'none')
                        .style('fill', this.gridConfig.ylabelFontConfig.color);
                }
                else {
                    gridYRightGroup.selectAll('.tick text').remove();
                }
                gridYRightGroup
                    .selectAll('.tick line')
                    .attr('stroke', this.gridlineConfig.gridRow.stroke)
                    .attr('stroke-width', this.gridlineConfig.gridRow['stroke-width'])
                    .attr('transform', `translate(0, ${isBetween
                    ? this.gridState.yGridlineRight.bandwidth()
                    : 0})`);
                gridYRightGroup.select('path.domain').attr('stroke', 'none');
            }
        }
        //#endregion
        //#region 左右兩邊與上下兩邊 axis 特別處理
        setTimeout(() => {
            const xBBox = gridXGroup.select('path.domain').node().getBBox();
            const xLeftAxis = gridXGroup.select('line.xLeftAxis').empty()
                ? gridXGroup.append('line').attr('class', 'xLeftAxis')
                : gridXGroup.select('line.xLeftAxis');
            xLeftAxis
                .attr('x1', xBBox.x)
                .attr('y1', xBBox.y)
                .attr('x2', xBBox.x)
                .attr('y2', xBBox.y + xBBox.height)
                .attr('stroke', this.gridlineConfig.xAxis.stroke)
                .attr('stroke-width', this.gridlineConfig.xAxis['stroke-width'])
                .attr('stroke-linecap', this.gridlineConfig.xAxis['stroke-linecap']);
            const xRightAxis = gridXGroup.select('line.xRightAxis').empty()
                ? gridXGroup.append('line').attr('class', 'xRightAxis')
                : gridXGroup.select('line.xRightAxis');
            xRightAxis
                .attr('x1', xBBox.x + xBBox.width)
                .attr('y1', xBBox.y)
                .attr('x2', xBBox.x + xBBox.width)
                .attr('y2', xBBox.y + xBBox.height)
                .attr('stroke', this.gridlineConfig.xAxis.stroke)
                .attr('stroke-width', this.gridlineConfig.showBorder
                ? this.gridlineConfig.xAxis['stroke-width']
                : '0')
                .attr('stroke-linecap', this.gridlineConfig.xAxis['stroke-linecap']);
            const yBBox = gridYGroup.select('path.domain').node().getBBox();
            const yTopAxis = gridYGroup.select('line.yTopAxis').empty()
                ? gridYGroup.append('line').attr('class', 'yTopAxis')
                : gridYGroup.select('line.yTopAxis');
            yTopAxis
                .attr('x1', yBBox.x)
                .attr('y1', yBBox.y)
                .attr('x2', yBBox.x + yBBox.width)
                .attr('y2', yBBox.y)
                .attr('stroke', this.gridlineConfig.yAxis.stroke)
                .attr('stroke-width', this.gridlineConfig.showBorder
                ? this.gridlineConfig.yAxis['stroke-width']
                : '0')
                .attr('stroke-linecap', this.gridlineConfig.yAxis['stroke-linecap']);
            const yBottomAxis = gridYGroup.select('line.yBottomAxis').empty()
                ? gridYGroup.append('line').attr('class', 'yBottomAxis')
                : gridYGroup.select('line.yBottomAxis');
            yBottomAxis
                .attr('x1', yBBox.x)
                .attr('y1', yBBox.y + yBBox.height)
                .attr('x2', yBBox.x + yBBox.width)
                .attr('y2', yBBox.y + yBBox.height)
                .attr('stroke', this.gridlineConfig.yAxis.stroke)
                .attr('stroke-width', this.gridlineConfig.yAxis['stroke-width'])
                .attr('stroke-linecap', this.gridlineConfig.yAxis['stroke-linecap']);
            // 設定每n筆資料顯示一筆 key
            const keyGroup = isVertical ? gridXGroup : gridYGroup;
            const keyTick = keyGroup.selectAll('.tick');
            keyTick.each((d, i, nodes) => {
                const el = nodes[i]; // 取得當前 DOM 元素
                d3.select(el).style('opacity', (i + 1) % this.gridlineConfig.tickInterval === 0 ? 1 : 0);
            });
        }, 0);
        //#endregion
        this.isFirstUpdate = false;
    }
    clear(useAnimation = false) {
        this.gridState.xGroup
            .selectAll('*')
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove();
        this.gridState.yGroup
            .selectAll('*')
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove();
        this.gridState.yRightGroup
            .selectAll('*')
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove();
    }
}

var PositionXType;
(function (PositionXType) {
    PositionXType["left"] = "left";
    PositionXType["center"] = "center";
    PositionXType["right"] = "right";
})(PositionXType || (PositionXType = {}));
var PositionYType;
(function (PositionYType) {
    PositionYType["top"] = "top";
    PositionYType["center"] = "center";
    PositionYType["bottom"] = "bottom";
})(PositionYType || (PositionYType = {}));

const DefaultTooltipConfig = {
    title: '',
    element: document.body,
    rect: new DOMRect(),
    colorsArray: [[{ color: 'black', opacity: 1 }]],
    data: [],
    positionStrategy: {
        x: PositionXType.center,
        y: PositionYType.top,
    },
    activeIndex: 0
};

class TooltipFactory extends BasicFactory {
    tooltip;
    tooltipConfig = deepCopy(DefaultTooltipConfig);
    /** 設定 tooltip 標題 */
    setTitle(title) {
        this.tooltipConfig.title = title;
        return this;
    }
    /** 設定顯示要黏住哪個元素 */
    setElement(element) {
        this.tooltipConfig.element = element;
        this.tooltipConfig.rect = element.getBoundingClientRect();
        return this;
    }
    /** 設定資料顯示顏色陣列 */
    setColor(colorsArray) {
        this.tooltipConfig.colorsArray = colorsArray;
        return this;
    }
    /** 設定顯示策略 */
    setPositionStrategy(positionStrategy) {
        this.tooltipConfig.positionStrategy = positionStrategy;
        return this;
    }
    clear() {
        this.tooltip.remove();
    }
}

/** 計算並返回 position */
function calculatePosition(origin, overlay, strategy = {
    x: PositionXType.center,
    y: PositionYType.top,
}, marginOfOrigin = { x: 8, y: 8 }, paddingOfBody = { x: 8, y: 8 }) {
    let position = { x: 0, y: 0 };
    if (!overlay)
        return position;
    const originRect = origin.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    position.x = calculatePositionX(strategy, originRect, overlayRect, bodyRect, marginOfOrigin, paddingOfBody);
    position.y = calculatePositionY(strategy, originRect, overlayRect, bodyRect, marginOfOrigin, paddingOfBody);
    return position;
}
function calculatePositionX(strategy, originRect, overlayRect, bodyRect, marginOfOrigin, paddingOfBody) {
    let value = 0;
    switch (strategy.x) {
        case PositionXType.left:
            value = originRect.x - overlayRect.width - marginOfOrigin.x;
            break;
        case PositionXType.center:
            value = originRect.x + originRect.width / 2 - overlayRect.width / 2;
            break;
        case PositionXType.right:
            value = originRect.x + originRect.width + marginOfOrigin.x;
    }
    // 切到邊緣時更換顯示位置，center只有偏移超出範圍，left or right 會更改定位模式(left to right 或 right to left)
    if (value < bodyRect.left + paddingOfBody.x) {
        value =
            strategy.x == PositionXType.center
                ? bodyRect.left + paddingOfBody.x
                : originRect.x + originRect.width + marginOfOrigin.x;
    }
    else if (value + overlayRect.width > window.innerWidth) {
        value =
            strategy.x == PositionXType.center
                ? window.innerWidth - overlayRect.width - paddingOfBody.x
                : originRect.x - overlayRect.width - marginOfOrigin.x;
    }
    // const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    return value + window.scrollX;
}
function calculatePositionY(strategy, originRect, overlayRect, bodyRect, marginOfOrigin, paddingOfBody) {
    let value = 0;
    switch (strategy.y) {
        case PositionYType.top:
            value = originRect.y - overlayRect.height - marginOfOrigin.y;
            break;
        case PositionYType.center:
            value = originRect.y + originRect.height / 2 - overlayRect.height / 2;
            break;
        case PositionYType.bottom:
            value = originRect.y + originRect.height + marginOfOrigin.y;
    }
    // 切到邊緣時更換顯示位置，center只有偏移超出範圍，top or bottom 會更改定位模式(top to bottom 或 bottom to top)
    if (value < bodyRect.top + paddingOfBody.y) {
        value =
            strategy.y == PositionYType.center
                ? bodyRect.top + paddingOfBody.y
                : originRect.y + originRect.height + marginOfOrigin.y;
    }
    else if (value + overlayRect.height > window.innerHeight) {
        value =
            strategy.y == PositionYType.center
                ? window.innerHeight - overlayRect.height - paddingOfBody.y
                : originRect.y - overlayRect.height - marginOfOrigin.y;
    }
    // const scrollbarHeight = window.innerHeight - document.documentElement.clientHeight;
    return value + window.scrollY;
}

class BasicTooltipFactory extends TooltipFactory {
    setData(d) {
        this.tooltipConfig.data = d;
        return this;
    }
    setConfig(tooltipConfig) {
        Object.assign(this.tooltipConfig, tooltipConfig);
        return this;
    }
    getSelector() {
        return ``;
    }
    getConfig() {
        return this.tooltipConfig;
    }
    draw() {
        const that = this;
        this.tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('display', 'flex')
            .style('flex-direction', 'column')
            .style('gap', '4px')
            .style('background', '#686868')
            .style('width', 'fit-content')
            .style('padding', '8px')
            .style('border-radius', '4px')
            .style('color', '#bebebe')
            .style('position', 'absolute')
            .style('top', `0px`)
            .style('left', `0px`)
            .style('pointer-events', 'none')
            .style('z-index', 9999)
            .style('opacity', 0)
            .call((selection) => selection.transition().duration(300).style('opacity', 1));
        for (const [i, data] of that.tooltipConfig.data.entries()) {
            const content = this.tooltip
                .append('div')
                .attr('class', 'd3-content')
                .style('display', 'flex')
                .style('align-items', 'center')
                .style('gap', '8px');
            content
                .append('div')
                .attr('class', 'd3-data-color')
                .style('width', '6px')
                .style('height', '18px')
                .style('border-radius', '9999px')
                .style('background', getCssColor(that.tooltipConfig.colorsArray[i], Direction.vertical));
            const text = content
                .append('span')
                .attr('class', 'd3-data-text')
                .style('font-size', '14px')
                .style('user-select', 'none')
                .text(`${data.key}: ${data.value}`);
            if (that.tooltipConfig.activeIndex == i) {
                text.style('color', 'white');
            }
        }
        const position = calculatePosition(that.tooltipConfig.element, this.tooltip.node(), that.tooltipConfig.positionStrategy);
        this.tooltip
            .style('top', 0)
            .style('left', 0)
            .style('transform', `translate(${position.x}px, ${position.y}px)`);
    }
}

const DefaultDotConfig = {
    radius: 5,
    showTooltip: true,
    showDotIndexes: [],
    showValueLabel: false,
    valueLabelFontSetting: DefaultAxisLabel
};

/** 圓點組件，需繪製在 LineFactory 上 */
class DotFactory extends BasicFactory {
    lineFactory;
    tooltipFactory;
    dotConfig = deepCopy(DefaultDotConfig);
    dataColorArray = [];
    showDotIndexes; // 紀錄是否被設定過 showDotIndexes，若沒有則預設為DataSetWithDataArrays長度的true陣列
    gridConfig;
    pointerover$ = new Subject();
    pointerout$ = new Subject();
    constructor(lineFactory, tooltipFactory = new BasicTooltipFactory()) {
        super();
        this.lineFactory = lineFactory;
        this.tooltipFactory = tooltipFactory;
        this.setLineFactory(lineFactory);
        this.gridConfig = this.lineFactory.getGridConfig();
    }
    /** 游標 hover 事件 */
    onPointerover() {
        return this.pointerover$.asObservable();
    }
    /** 游標離開事件 */
    onPointerout() {
        return this.pointerout$.asObservable();
    }
    setConfig(dotConfig) {
        Object.assign(this.dotConfig, dotConfig);
        return this;
    }
    /** 設定圓點半徑 */
    setRadius(radius) {
        this.dotConfig.radius = radius;
        return this;
    }
    /** 設定是否顯示預設 tooltip */
    setShowTooltip(showTooltip) {
        this.dotConfig.showTooltip = showTooltip;
        return this;
    }
    /** 設定要顯示的點的索引值 */
    setShowDotIndexes(showDotIndexes) {
        this.showDotIndexes = showDotIndexes;
        this.dotConfig.showDotIndexes = showDotIndexes;
        return this;
    }
    /** 設定要顯示的 tooltip 種類 */
    setTooltipFactory(tooltipFactory) {
        this.tooltipFactory = tooltipFactory;
        return this;
    }
    /** 設定要繪製在哪個 LineFactory 上 */
    setLineFactory(lineFactory) {
        this.lineFactory = lineFactory;
        const dataSetWithDataArrays = this.lineFactory.getDataSetWithDataArrays();
        this.dataColorArray = getColorTypeArray(dataSetWithDataArrays);
        this.dotConfig.showDotIndexes = this.showDotIndexes || dataSetWithDataArrays[0]?.data.map(() => true);
        return this;
    }
    /** 設定是否顯示數值標籤 */
    setShowValueLabel(showValueLabel) {
        this.dotConfig.showValueLabel = showValueLabel;
        return this;
    }
    /** 設定數值標籤文字樣式 */
    setValueLabelFont(valueLabelFontSetting) {
        Object.assign(this.dotConfig.valueLabelFontSetting, valueLabelFontSetting);
        return this;
    }
    getSelector() {
        return `g#dot_${this.factoryId}`;
    }
    getConfig() {
        return this.dotConfig;
    }
    draw(useAnimation = false) {
        const that = this;
        const isVertical = that.gridConfig.direction == Direction.vertical;
        this.lineFactory.getLineGroup().each(function (dSets, i) {
            if (d3.select(`#dotFactory_${that.factoryId}_${i}`).empty()) {
                d3.select(this)
                    .append('g')
                    .attr('id', () => `dotFactory_${that.factoryId}_${i}`);
                d3.select(this)
                    .append('g')
                    .attr('id', () => `dot_valueLabel_group_${that.factoryId}_${i}`);
            }
            const dArray = dSets.data;
            const color = getSelectionColor(d3.select(this), that.dataColorArray[i], `dot_${that.factoryId}`, i);
            const setValueLabel = (selection, j) => {
                if (!that.dotConfig.showValueLabel)
                    return;
                if (that.dotConfig.showDotIndexes[j] && dArray[j].value !== null) {
                    const parent = d3.select(`#dot_valueLabel_group_${that.factoryId}_${i}`);
                    const id = `${that.factoryId}_${i}_${j}`;
                    let textSelection = parent.select(`#dot_valueLabel_${id}`);
                    if (textSelection.empty()) {
                        textSelection = parent.append('text').attr('id', `dot_valueLabel_${id}`);
                    }
                    const dataValueNumber = Number(dArray[j].value);
                    const labelRect = getTextRect(dataValueNumber.toString(), that.dotConfig.valueLabelFontSetting['font-family'], that.dotConfig.valueLabelFontSetting['font-size'], that.dotConfig.valueLabelFontSetting['font-weight']);
                    const gap = 8;
                    const deltaX = isVertical ? -labelRect.width / 2 : dataValueNumber >= 0 ? gap : -labelRect.width;
                    const deltaY = isVertical ? (dataValueNumber >= 0 ? -gap : labelRect.height) : labelRect.height / 2 - gap;
                    textSelection
                        .transition()
                        .duration(useAnimation ? 500 : 0)
                        .attr('x', () => that.lineFactory.getXPosition(dArray[j]) + deltaX)
                        .attr('y', () => that.lineFactory.getYPosition(dArray[j]) + deltaY)
                        .attr('fill', that.dotConfig.valueLabelFontSetting.color)
                        .attr('font-family', that.dotConfig.valueLabelFontSetting['font-family'])
                        .attr('font-size', that.dotConfig.valueLabelFontSetting['font-size'])
                        .attr('font-weight', that.dotConfig.valueLabelFontSetting['font-weight'])
                        .text(dataValueNumber);
                }
            };
            const setAttributes = (selection, j) => {
                if (that.dotConfig.showDotIndexes[j] && dArray[j].value !== null) {
                    selection
                        .transition()
                        .duration(useAnimation ? 500 : 0)
                        .attr('cx', (d) => that.lineFactory.getXPosition(d))
                        .attr('cy', (d) => that.lineFactory.getYPosition(d))
                        .attr('r', that.dotConfig.radius)
                        .attr('fill', color);
                }
            };
            const setEvents = (selection) => {
                selection
                    .on('pointerover', function (event, d) {
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .ease(d3.easeCubicInOut)
                        .attr('r', that.dotConfig.radius * 1.5);
                    const element = event.currentTarget;
                    that.pointerover$.next(d);
                    if (!that.dotConfig.showTooltip)
                        return;
                    that.tooltipFactory.setElement(element).setColor([that.dataColorArray[i]]).setData([d]).draw();
                })
                    .on('pointermove', function (event) {
                    d3.select(this).dispatch('grid-hover', event);
                })
                    .on('pointerout', function (event, d) {
                    d3.select(this).transition().duration(300).attr('r', that.dotConfig.radius);
                    that.pointerout$.next(d);
                    if (!that.dotConfig.showTooltip)
                        return;
                    that.tooltipFactory.clear();
                });
            };
            const dataLength = dArray.length;
            d3.select(`#dotFactory_${that.factoryId}_${i}`)
                .selectAll('circle')
                .data(dArray)
                .join(enter => enter
                .append('circle')
                .attr('id', (d, j) => `dot_${that.factoryId}_${i}_${j}`)
                .call(selection => selection.each((d, i, node) => {
                setAttributes(d3.select(node[i]), i);
                setValueLabel(d3.select(node[i]), i);
            }))
                .call(setEvents)
                .style('opacity', 0)
                .call(enter => enter
                .transition('delayDot')
                .delay((d, i) => (useAnimation ? (i * 500) / dataLength : 0))
                .duration(useAnimation ? 800 : 0)
                .style('opacity', 1)), update => update.call(update => {
                update
                    .transition()
                    .duration(useAnimation ? 500 : 0)
                    .call(selection => selection.each((d, i, node) => {
                    if (d.value !== null) {
                        setAttributes(d3.select(node[i]), i);
                        setValueLabel(d3.select(node[i]), i);
                    }
                    else {
                        selection.remove();
                    }
                }));
                update.call(setEvents);
            }), exit => exit.call(exit => exit.transition().duration(500).style('opacity', 0)).remove());
        });
    }
    clear(useAnimation = false) {
        this.lineFactory
            .getLineGroup()
            ?.selectAll('circle')
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove();
    }
}

const DefaultLineConfig = {
    axisIndex: 0,
    strokeWidth: 2,
    curveType: 0,
    enterAnimationType: 0
};

/** 折線組件，需繪製在 GridFactory 上 */
class LineFactory extends BasicFactory {
    gridFactory;
    gridState;
    gridConfig;
    dataSetWithDataArrays = [];
    dataColorArray = [];
    lineArrayGroup;
    lineGroup;
    lineConfig = deepCopy(DefaultLineConfig);
    constructor(gridFactory) {
        super();
        this.gridFactory = gridFactory;
        this.gridState = gridFactory.getState();
        this.gridConfig = gridFactory.getConfig();
        this.lineArrayGroup = (this.gridState.gridGroup.select(`g#lineFactory_${this.factoryId}`).node()
            ? this.gridState.gridGroup.select(`g#lineFactory_${this.factoryId}`)
            : this.gridState.gridGroup.append('g').attr('id', `lineFactory_${this.factoryId}`));
    }
    /** 設定要被繪製在哪個 GridFactory 上 */
    setGridFactory(gridFactory) {
        this.gridFactory = gridFactory;
        return this;
    }
    /** 設定折線資料 */
    setDataSets(dataSetWithDataArrays, axisIndex = 0) {
        this.dataSetWithDataArrays = dataSetWithDataArrays;
        this.lineConfig.axisIndex = axisIndex;
        this.dataColorArray = getColorTypeArray(this.dataSetWithDataArrays);
        return this;
    }
    setConfig(lineConfig) {
        Object.assign(this.lineConfig, lineConfig);
        return this;
    }
    /** 設定折線粗細 */
    setStrokeWidth(width) {
        this.lineConfig.strokeWidth = width;
        return this;
    }
    /** 設定曲線模式 */
    setCurveType(curveType) {
        this.lineConfig.curveType = curveType;
        return this;
    }
    /** 設定折線繪製時的動畫 */
    setEnterAnimation(enterAnimationType) {
        this.lineConfig.enterAnimationType = enterAnimationType;
        return this;
    }
    /** 取得線段中資料點的 x 座標 */
    getXPosition(d) {
        const isVertical = this.gridConfig.direction == Direction.vertical;
        const dataX = (isVertical ? d.key : d.value);
        if (this.lineConfig.axisIndex == 0) {
            if (isVertical) {
                return this.gridState.xGridlineBottom(dataX) || 0;
            }
            else {
                return this.gridState.x(dataX) || 0;
            }
        }
        else {
            if (isVertical) {
                return this.gridState.xGridlineBottom(dataX) || 0;
            }
            else {
                return this.gridState.xTop(dataX) || 0;
            }
        }
    }
    /** 取的線段中資料點的 y 座標 */
    getYPosition(d) {
        const isVertical = this.gridConfig.direction == Direction.vertical;
        const dataY = (isVertical ? d.value : d.key);
        if (this.lineConfig.axisIndex == 0) {
            if (isVertical) {
                return this.gridState.y(dataY) || 0;
            }
            else {
                return this.gridState.yGridlineLeft(dataY) || 0;
            }
        }
        else {
            if (isVertical) {
                return this.gridState.yRight(dataY) || 0;
            }
            else {
                return this.gridState.yGridlineLeft(dataY) || 0;
            }
        }
    }
    getLineGroup() {
        return this.lineGroup;
    }
    getSelector() {
        return `g#lineFactory_${this.factoryId}`;
    }
    getConfig() {
        return this.lineConfig;
    }
    /** 取得 GridConfig */
    getGridConfig() {
        return this.gridConfig;
    }
    /** 取得 GridState */
    getState() {
        return this.gridState;
    }
    /** 取得折線資料 */
    getDataSetWithDataArrays() {
        return this.dataSetWithDataArrays;
    }
    draw(useAnimation = false) {
        this.gridState = this.gridFactory.getState();
        this.gridConfig = this.gridFactory.getConfig();
        // 資料缺失時補上null
        this.dataSetWithDataArrays.forEach(dataset => {
            // 將 dataset 的 data 轉為 Map 來方便檢查是否存在某 key
            const dataMap = new Map(dataset.data.map(item => [item.key, item]));
            // 生成新的 data 陣列，按照 allKeys 的順序補全缺失的 key
            dataset.data = this.gridState.keyScaleLabels.map(key => {
                if (dataMap.has(key)) {
                    // 如果 key 存在，返回對應的 DataItem
                    return dataMap.get(key);
                }
                else {
                    // 如果 key 缺失，插入 { key: 缺失的 key, value: null }
                    return { key, value: null };
                }
            });
        });
        const line = d3
            .line()
            .x(d => this.getXPosition(d))
            .y(d => this.getYPosition(d))
            .defined((d, i) => d.value !== null);
        const translate = this.gridConfig.direction == Direction.vertical
            ? `translateX(${this.gridState.xGridlineBottom.bandwidth() / 2}px)`
            : `translateY(${this.gridState.yGridlineLeft.bandwidth() / 2}px)`;
        this.lineArrayGroup
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('transform', translate);
        this.lineGroup = this.lineArrayGroup
            .selectAll('g.lineGroup')
            .data(this.dataSetWithDataArrays, d => d.label)
            .join(enter => enter
            .append('g')
            .attr('class', `lineGroup`)
            .attr('id', (d, i) => `lineGroup_${this.factoryId}_${i}`), update => update, exit => exit
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove());
        const enterAnimation = this.getAnimation;
        const that = this;
        this.lineGroup.each(function (dsets, i) {
            const setAttributes = (selection) => {
                selection
                    .attr('d', line)
                    .attr('fill', 'none')
                    .attr('stroke', (d, j) => getSelectionColor(d3.select(this), that.dataColorArray[i], `line_${that.factoryId}`, j))
                    .attr('stroke-width', that.lineConfig.strokeWidth);
            };
            d3.select(this)
                .selectAll('path')
                .data([dsets.data])
                .join(enter => enter
                .append('path')
                .attr('id', `line_${that.factoryId}_${i}`)
                .call(setAttributes)
                .call(enterAnimation.bind(that)), update => update
                .transition()
                .duration(useAnimation ? 500 : 0)
                .call(setAttributes), exit => exit.remove());
        });
        this.isFirstUpdate = false;
    }
    clear(useAnimation = false) {
        this.lineArrayGroup
            .selectAll('path')
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove();
    }
    /** 判斷使用哪種動畫 */
    getAnimation(selection) {
        switch (this.lineConfig.enterAnimationType) {
            case LineAnimationType.startToEnd:
                return this.animateStartToEnd(selection);
            case LineAnimationType.fadeIn:
                return this.animateFadeIn(selection);
            case LineAnimationType.none:
            default:
                return selection;
        }
    }
    /** line 動畫 從頭畫到尾 */
    animateStartToEnd(selection) {
        return selection
            .attr('stroke-dasharray', function () {
            return `${this.getTotalLength()} ${this.getTotalLength()}`;
        })
            .attr('stroke-dashoffset', function () {
            return this.getTotalLength();
        })
            .call(selection => {
            selection
                .transition('animateStartToEnd')
                .duration(500)
                .attr('stroke-dashoffset', 0)
                .on('end', function () {
                d3.select(this).attr('stroke-dasharray', 'none');
            });
        });
    }
    /** line 動畫 淡入 */
    animateFadeIn(selection) {
        return selection.attr('opacity', 0).call(selection => selection.transition().duration(500).attr('opacity', 1));
    }
}
/** LineFactory 的動畫種類 */
var LineAnimationType;
(function (LineAnimationType) {
    LineAnimationType[LineAnimationType["none"] = 0] = "none";
    LineAnimationType[LineAnimationType["startToEnd"] = 1] = "startToEnd";
    LineAnimationType[LineAnimationType["fadeIn"] = 2] = "fadeIn";
})(LineAnimationType || (LineAnimationType = {}));

/** 基礎折線圖 */
class LineChart extends RootChart {
    gridFactory;
    gridlineFactory;
    lineFactory;
    dotFactory;
    lineDataSetWithDataArray = [];
    isUseGridlineFactory = true;
    isUseLineFactory = true;
    isUseDotFactory = true;
    constructor(selector) {
        super(selector);
        this.gridFactory = new GridFactory(this);
        this.setFactory();
    }
    setFactory() {
        this.gridlineFactory = this.gridlineFactory
            ? this.gridlineFactory.setGridFactory(this.gridFactory)
            : new GridlineFactory(this.gridFactory);
        this.lineFactory = this.lineFactory
            ? this.lineFactory.setGridFactory(this.gridFactory)
            : new LineFactory(this.gridFactory);
        this.lineFactory.setDataSets(this.lineDataSetWithDataArray);
        this.dotFactory = this.dotFactory
            ? this.dotFactory.setLineFactory(this.lineFactory)
            : new DotFactory(this.lineFactory);
    }
    /** 設定資料 */
    setDataSets(dataSets) {
        this.lineDataSetWithDataArray = dataSets;
        const gridDataSetting = this.lineDataSetWithDataArray.map((item) => {
            return { dataSetWithDataArray: item, isStack: false, axisIndex: 0 };
        });
        this.gridFactory.setDataSetWithDataArrays(gridDataSetting);
        return this;
    }
    /** 設定要使用的 GridFactory */
    setGridFactory(gridFactory) {
        this.gridFactory = gridFactory;
        return this;
    }
    /** 設定要使用的 GridlineFactory */
    setGridlineFactory(gridlineFactory) {
        this.gridlineFactory = gridlineFactory;
        return this;
    }
    /** 設定要使用的 LineFactory */
    setLineFactory(lineFactory) {
        this.lineFactory = lineFactory;
        return this;
    }
    getGridFactory() {
        return this.gridFactory;
    }
    getGridlineFactory() {
        return this.gridlineFactory;
    }
    getLineFactory() {
        return this.lineFactory;
    }
    getDotFactory() {
        return this.dotFactory;
    }
    useGridlineFactory(isUseGridlineFactory) {
        this.isUseGridlineFactory = isUseGridlineFactory;
        return this;
    }
    useLineFactory(isUseLineFactory) {
        this.isUseLineFactory = isUseLineFactory;
        return this;
    }
    useDotFactory(isUseDotFactory) {
        this.isUseDotFactory = isUseDotFactory;
        return this;
    }
    drawChart(useAnimation = false) {
        this.gridFactory.draw(useAnimation);
        this.setFactory();
        setTimeout(() => {
            this.isUseGridlineFactory
                ? this.gridlineFactory.draw(useAnimation)
                : this.gridlineFactory.clear(useAnimation);
            this.isUseLineFactory
                ? this.lineFactory.draw(useAnimation)
                : this.lineFactory.clear(useAnimation);
            this.isUseDotFactory
                ? this.dotFactory.draw(useAnimation)
                : this.dotFactory.clear(useAnimation);
        }, 0);
    }
}

var CurveType;
(function (CurveType) {
    CurveType[CurveType["linear"] = 0] = "linear";
    CurveType[CurveType["smooth"] = 1] = "smooth";
    CurveType[CurveType["pulse"] = 2] = "pulse";
})(CurveType || (CurveType = {}));

const DefaultAreaConfig = {
    axisIndex: 0,
    curveType: 0,
    enterAnimationType: 0
};

/** 折線組件，需繪製在 GridFactory 上 */
class AreaFactory extends BasicFactory {
    gridFactory;
    gridState;
    gridConfig;
    dataSetWithDataArrays = [];
    dataColorArray = [];
    areaArrayGroup;
    areaGroup;
    areaConfig = deepCopy(DefaultAreaConfig);
    constructor(gridFactory) {
        super();
        this.gridFactory = gridFactory;
        this.gridState = gridFactory.getState();
        this.gridConfig = gridFactory.getConfig();
        this.areaArrayGroup = (this.gridState.gridGroup.select(`g#areaFactory_${this.factoryId}`).node()
            ? this.gridState.gridGroup.select(`g#areaFactory_${this.factoryId}`)
            : this.gridState.gridGroup.append('g').attr('id', `areaFactory_${this.factoryId}`));
    }
    /** 設定要被繪製在哪個 GridFactory 上 */
    setGridFactory(gridFactory) {
        this.gridFactory = gridFactory;
        return this;
    }
    /** 設定折線資料 */
    setDataSets(dataSetWithDataArrays, axisIndex = 0) {
        this.dataSetWithDataArrays = dataSetWithDataArrays;
        this.areaConfig.axisIndex = axisIndex;
        this.dataColorArray = getColorTypeArray(this.dataSetWithDataArrays);
        return this;
    }
    setConfig(areaConfig) {
        Object.assign(this.areaConfig, areaConfig);
        return this;
    }
    /** 設定曲線模式 */
    setCurveType(curveType) {
        this.areaConfig.curveType = curveType;
        return this;
    }
    /** 設定折線繪製時的動畫 */
    setEnterAnimation(enterAnimationType) {
        this.areaConfig.enterAnimationType = enterAnimationType;
        return this;
    }
    /** 取得線段中資料點的 x 座標 */
    getXPosition(d) {
        const isVertical = this.gridConfig.direction == Direction.vertical;
        const dataX = (isVertical ? d.key : d.value);
        if (this.areaConfig.axisIndex == 0) {
            if (isVertical) {
                return this.gridState.xGridlineBottom(dataX) || 0;
            }
            else {
                return this.gridState.x(dataX) || 0;
            }
        }
        else {
            if (isVertical) {
                return this.gridState.xGridlineBottom(dataX) || 0;
            }
            else {
                return this.gridState.xTop(dataX) || 0;
            }
        }
    }
    /** 取的線段中資料點的 y 座標 */
    getYPosition(d) {
        const isVertical = this.gridConfig.direction == Direction.vertical;
        const dataY = (isVertical ? d.value : d.key);
        if (this.areaConfig.axisIndex == 0) {
            if (isVertical) {
                return this.gridState.y(dataY) || 0;
            }
            else {
                return this.gridState.yGridlineLeft(dataY) || 0;
            }
        }
        else {
            if (isVertical) {
                return this.gridState.yRight(dataY) || 0;
            }
            else {
                return this.gridState.yGridlineLeft(dataY) || 0;
            }
        }
    }
    getLineGroup() {
        return this.areaGroup;
    }
    getSelector() {
        return `g#areaFactory_${this.factoryId}`;
    }
    getConfig() {
        return this.areaConfig;
    }
    /** 取得折線資料 */
    getDataSetWithDataArrays() {
        return this.dataSetWithDataArrays;
    }
    draw(useAnimation = false) {
        this.gridState = this.gridFactory.getState();
        this.gridConfig = this.gridFactory.getConfig();
        // 資料缺失時補上null
        this.dataSetWithDataArrays.forEach(dataset => {
            // 將 dataset 的 data 轉為 Map 來方便檢查是否存在某 key
            const dataMap = new Map(dataset.data.map(item => [item.key, item]));
            // 生成新的 data 陣列，按照 allKeys 的順序補全缺失的 key
            dataset.data = this.gridState.keyScaleLabels.map(key => {
                if (dataMap.has(key)) {
                    // 如果 key 存在，返回對應的 DataItem
                    return dataMap.get(key);
                }
                else {
                    // 如果 key 缺失，插入 { key: 缺失的 key, value: null }
                    return { key, value: null };
                }
            });
        });
        const curve = (() => {
            switch (this.areaConfig.curveType) {
                case CurveType.linear:
                    return d3.curveLinear;
                case CurveType.smooth:
                    return this.gridConfig.direction == Direction.vertical ? d3.curveBumpX : d3.curveBumpY;
                case CurveType.pulse:
                    return d3.curveStep;
            }
        })();
        const area = d3
            .area()
            .x(d => this.getXPosition(d))
            .y0(d => this.getYPosition({ key: d.key, value: 0 }))
            .y1(d => this.getYPosition(d))
            .curve(curve)
            .defined((d, i) => d.value !== null);
        const translate = this.gridConfig.direction == Direction.vertical
            ? `translateX(${this.gridState.xGridlineBottom.bandwidth() / 2}px)`
            : `translateY(${this.gridState.yGridlineLeft.bandwidth() / 2}px)`;
        this.areaArrayGroup
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('transform', translate);
        this.areaGroup = this.areaArrayGroup
            .selectAll('g.areaGroup')
            .data(this.dataSetWithDataArrays, d => d.label)
            .join(enter => enter
            .append('g')
            .attr('class', `areaGroup`)
            .attr('id', (d, i) => `areaGroup_${this.factoryId}_${i}`), update => update, exit => exit
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove());
        const enterAnimation = this.getAnimation;
        const that = this;
        this.areaGroup.each(function (dsets, i) {
            const setAttributes = (selection) => {
                selection
                    .attr('d', area)
                    .attr('fill', () => getSelectionColor(d3.select(this), that.dataColorArray[i], `area_${that.factoryId}`, i, that.dataSetWithDataArrays[i].gradientDirection));
            };
            d3.select(this)
                .selectAll('path')
                .data([dsets.data])
                .join(enter => enter.append('path').attr('id', `area_${that.factoryId}_${i}`).call(setAttributes), update => update
                .transition()
                .duration(useAnimation ? 500 : 0)
                .call(setAttributes), exit => exit.remove());
        });
        this.isFirstUpdate = false;
    }
    clear(useAnimation = false) {
        this.areaArrayGroup
            .selectAll('path')
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove();
    }
    /** 判斷使用哪種動畫 */
    getAnimation(selection) {
        switch (this.areaConfig.enterAnimationType) {
            case AreaAnimationType.startToEnd:
                return this.animateStartToEnd(selection);
            case AreaAnimationType.fadeIn:
                return this.animateFadeIn(selection);
            case AreaAnimationType.none:
            default:
                return selection;
        }
    }
    /** line 動畫 從頭畫到尾 */
    animateStartToEnd(selection) {
        return selection
            .attr('stroke-dasharray', function () {
            return `${this.getTotalLength()} ${this.getTotalLength()}`;
        })
            .attr('stroke-dashoffset', function () {
            return this.getTotalLength();
        })
            .call(selection => {
            selection
                .transition('animateStartToEnd')
                .duration(500)
                .attr('stroke-dashoffset', 0)
                .on('end', function () {
                d3.select(this).attr('stroke-dasharray', 'none');
            });
        });
    }
    /** line 動畫 淡入 */
    animateFadeIn(selection) {
        return selection.attr('opacity', 0).call(selection => selection.transition().duration(500).attr('opacity', 1));
    }
}
/** AreaFactory 的動畫種類 */
var AreaAnimationType;
(function (AreaAnimationType) {
    AreaAnimationType[AreaAnimationType["none"] = 0] = "none";
    AreaAnimationType[AreaAnimationType["startToEnd"] = 1] = "startToEnd";
    AreaAnimationType[AreaAnimationType["fadeIn"] = 2] = "fadeIn";
})(AreaAnimationType || (AreaAnimationType = {}));

/** 基礎區域圖 */
class AreaChart extends RootChart {
    gridFactory;
    gridlineFactory;
    lineFactory;
    dotFactory;
    areaFactory;
    lineDataSetWithDataArray = [];
    areaDataSetWithDataArray = [];
    isUseGridlineFactory = true;
    isUseLineFactory = true;
    isUseDotFactory = true;
    isUseAreaFactory = true;
    constructor(selector) {
        super(selector);
        this.gridFactory = new GridFactory(this);
        this.setFactory();
    }
    setFactory() {
        this.gridlineFactory = this.gridlineFactory
            ? this.gridlineFactory.setGridFactory(this.gridFactory)
            : new GridlineFactory(this.gridFactory);
        this.areaFactory = this.areaFactory
            ? this.areaFactory.setGridFactory(this.gridFactory)
            : new AreaFactory(this.gridFactory);
        this.areaFactory.setDataSets(this.areaDataSetWithDataArray);
        this.lineFactory = this.lineFactory
            ? this.lineFactory.setGridFactory(this.gridFactory)
            : new LineFactory(this.gridFactory);
        this.lineFactory.setDataSets(this.lineDataSetWithDataArray);
        this.dotFactory = this.dotFactory
            ? this.dotFactory.setLineFactory(this.lineFactory)
            : new DotFactory(this.lineFactory);
    }
    /** 設定折線資料 */
    setLineDataSets(dataSets) {
        this.lineDataSetWithDataArray = dataSets;
        const gridDataSetting = this.lineDataSetWithDataArray.map(item => {
            return { dataSetWithDataArray: item, isStack: false, axisIndex: 0 };
        });
        this.gridFactory.setDataSetWithDataArrays(gridDataSetting);
        return this;
    }
    /** 設定區域資料 */
    setAreaDataSets(dataSets) {
        this.areaDataSetWithDataArray = dataSets;
        const gridDataSetting = this.lineDataSetWithDataArray.map(item => {
            return { dataSetWithDataArray: item, isStack: false, axisIndex: 0 };
        });
        this.gridFactory.setDataSetWithDataArrays(gridDataSetting);
        return this;
    }
    /** 設定要使用的 GridFactory */
    setGridFactory(gridFactory) {
        this.gridFactory = gridFactory;
        return this;
    }
    /** 設定要使用的 GridlineFactory */
    setGridlineFactory(gridlineFactory) {
        this.gridlineFactory = gridlineFactory;
        return this;
    }
    /** 設定要使用的 LineFactory */
    setLineFactory(lineFactory) {
        this.lineFactory = lineFactory;
        return this;
    }
    /** 設定要使用的 AreaFactory */
    setAreaFactory(areaFactory) {
        this.areaFactory = areaFactory;
        return this;
    }
    getGridFactory() {
        return this.gridFactory;
    }
    getGridlineFactory() {
        return this.gridlineFactory;
    }
    getLineFactory() {
        return this.lineFactory;
    }
    getDotFactory() {
        return this.dotFactory;
    }
    getAreaFactory() {
        return this.areaFactory;
    }
    useGridlineFactory(isUseGridlineFactory) {
        this.isUseGridlineFactory = isUseGridlineFactory;
        return this;
    }
    useLineFactory(isUseLineFactory) {
        this.isUseLineFactory = isUseLineFactory;
        return this;
    }
    useDotFactory(isUseDotFactory) {
        this.isUseDotFactory = isUseDotFactory;
        return this;
    }
    useAreaFactory(isUseAreaFactory) {
        this.isUseAreaFactory = isUseAreaFactory;
        return this;
    }
    drawChart(useAnimation = false) {
        this.gridFactory.draw(useAnimation);
        this.setFactory();
        setTimeout(() => {
            this.isUseGridlineFactory ? this.gridlineFactory.draw(useAnimation) : this.gridlineFactory.clear(useAnimation);
            this.isUseAreaFactory ? this.areaFactory.draw(useAnimation) : this.areaFactory.clear(useAnimation);
            this.isUseLineFactory ? this.lineFactory.draw(useAnimation) : this.lineFactory.clear(useAnimation);
            this.isUseDotFactory ? this.dotFactory.draw(useAnimation) : this.dotFactory.clear(useAnimation);
        }, 0);
    }
}

const DefaultBarConfig = {
    axisIndex: 0,
    showTooltip: true,
    showValueLabel: false,
    isValueLabelOutside: true,
    valueLabelFontSetting: DefaultAxisLabel,
    enterAnimationType: 0,
    isStack: false,
    bandwidth: 1,
    borderRadius: 8,
};

/** 長條組件，需繪製在 GridFactory 上 */
class BarFactory extends BasicFactory {
    tooltipFactory;
    gridFactory;
    gridState;
    gridConfig;
    dataSetWithDataArrays = [];
    dataColorArray = [];
    barArrayGroup;
    barGroup;
    barConfig = deepCopy(DefaultBarConfig);
    pointerover$ = new Subject();
    pointerout$ = new Subject();
    constructor(gridFactory, tooltipFactory = new BasicTooltipFactory()) {
        super();
        this.tooltipFactory = tooltipFactory;
        this.gridFactory = gridFactory;
        this.gridState = gridFactory.getState();
        this.gridConfig = gridFactory.getConfig();
        this.barArrayGroup = (this.gridState.gridGroup.select(`g#barFactory_${this.factoryId}`).node()
            ? this.gridState.gridGroup.select(`g#barFactory_${this.factoryId}`)
            : this.gridState.gridGroup.append('g').attr('id', `barFactory_${this.factoryId}`));
        this.tooltipFactory.setPositionStrategy({ x: 'right', y: 'center' });
    }
    /** 設定要被繪製在哪個 GridFactory 上 */
    setGridFactory(gridFactory) {
        this.gridFactory = gridFactory;
        return this;
    }
    /** 設定長條資料 */
    setDataSets(dataSetWithDataArrays, axisIndex = 0) {
        this.dataSetWithDataArrays = dataSetWithDataArrays;
        this.barConfig.axisIndex = axisIndex;
        this.dataColorArray = getColorTypeArray(this.dataSetWithDataArrays);
        return this;
    }
    setConfig(barConfig) {
        Object.assign(this.barConfig, barConfig);
        return this;
    }
    /** 設定長條繪製時的動畫 */
    setEnterAnimation(enterAnimationType) {
        this.barConfig.enterAnimationType = enterAnimationType;
        return this;
    }
    /** 設定是否堆疊，若為否則平行呈現 */
    setStack(isStack) {
        this.barConfig.isStack = isStack;
        return this;
    }
    /** 設定是否顯示數值標籤 */
    setShowValueLabel(showValueLabel) {
        this.barConfig.showValueLabel = showValueLabel;
        return this;
    }
    /** 設定數值標籤文字樣式 */
    setValueLabelFont(valueLabelFontSetting) {
        Object.assign(this.barConfig.valueLabelFontSetting, valueLabelFontSetting);
        return this;
    }
    /** 設定數值標籤顯示的位置 */
    setIsValueLabelOutside(isValueLabelOutside) {
        this.barConfig.isValueLabelOutside = isValueLabelOutside;
        return this;
    }
    /** 取的線段中資料點的 x 座標 */
    getXPosition(d) {
        const isVertical = this.gridConfig.direction == Direction.vertical;
        const dataX = (isVertical ? d.key : d.value);
        if (this.barConfig.axisIndex == 0) {
            if (isVertical) {
                return this.gridState.xGridlineBottom(dataX) || 0;
            }
            else {
                return this.gridState.x(dataX) || 0;
            }
        }
        else {
            return this.gridState.xTop(dataX) || 0;
        }
    }
    /** 取的線段中資料點的 y 座標 */
    getYPosition(d) {
        const isVertical = this.gridConfig.direction == Direction.vertical;
        const dataY = ((isVertical ? d.value : d.key) || 0);
        if (this.barConfig.axisIndex == 0) {
            if (isVertical) {
                return this.gridState.y(dataY) || 0;
            }
            else {
                return this.gridState.yGridlineLeft(dataY) || 0;
            }
        }
        else {
            return this.gridState.yRight(dataY) || 0;
        }
    }
    getSelector() {
        return `g#barFactory_${this.factoryId}`;
    }
    getConfig() {
        return this.barConfig;
    }
    /** 監聽 Pointerover 事件 */
    onPointerover() {
        return this.pointerover$.asObservable();
    }
    /** 監聽 Pointerout 事件 */
    onPointerout() {
        return this.pointerout$.asObservable();
    }
    draw(useAnimation = false) {
        this.gridState = this.gridFactory.getState();
        this.gridConfig = this.gridFactory.getConfig();
        const categories = this.dataSetWithDataArrays.length > 0 ? this.dataSetWithDataArrays[0].data.map(d => d.key) : [];
        const keys = this.dataSetWithDataArrays.map(DataSetWithDataArray => DataSetWithDataArray.label);
        const stack = d3.stack().keys(keys).offset(d3.stackOffsetDiverging);
        const stackData = categories.map((category, i) => {
            let obj = { stackKeyName: category };
            this.dataSetWithDataArrays.forEach(d => {
                if (d.data[i]) {
                    obj[d.label] = d.data[i].value;
                }
            });
            return obj;
        });
        const gap = 4;
        let positiveSumArray = [], negetiveSumArray = [];
        for (const singleData of stackData) {
            let positiveSum = 0, negetiveSum = 0;
            for (const key of Object.keys(singleData)) {
                if (key == 'stackKeyName')
                    continue;
                if (singleData[key] > 0) {
                    positiveSum += singleData[key];
                }
                else {
                    negetiveSum += singleData[key];
                }
            }
            positiveSumArray.push(positiveSum);
            negetiveSumArray.push(negetiveSum);
        }
        // console.log(stackData);
        // console.log(stack(stackData));
        const groupData = this.barConfig.isStack
            ? stack(stackData)
            : this.dataSetWithDataArrays.map(item => item.data);
        this.barGroup = this.barArrayGroup
            .selectAll(`g`)
            .data(groupData)
            .join(enter => enter.append('g').attr('id', (d, i) => `barGroup_${this.factoryId}_${i}`), update => update, exit => exit
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove());
        const that = this;
        this.barGroup.each(function (dataArray, i) {
            const isVertical = that.gridConfig.direction == Direction.vertical;
            //#region function
            // 圓角遮罩
            const roundedMask = (selection, index, data, dataValue, posX, posY, barWidth, barHeight) => {
                const parent = d3.select(this);
                const id = `${that.factoryId}_${i}_${index}`;
                let clipPathRect = parent
                    .select(`#bar_clipPath_rounded_${id}`)
                    .select(`#rounded_${id}`)
                    .select('rect');
                if (clipPathRect.empty()) {
                    clipPathRect = parent
                        .append('defs')
                        .attr('id', `bar_clipPath_rounded_${id}`)
                        .append('clipPath')
                        .attr('id', `rounded_${id}`)
                        .append('rect');
                }
                const dataValueNumber = Number(dataValue);
                clipPathRect
                    .transition()
                    .duration(useAnimation ? 500 : 0)
                    .attr('x', () => {
                    return posX(data) - (!isVertical && dataValueNumber >= 0 ? barHeight(data) * 0.5 : 0);
                })
                    .attr('y', () => (isVertical ? posY(data) - (dataValueNumber < 0 ? barHeight(data) * 0.5 : 0) : posY(data)))
                    .attr('width', () => (isVertical ? barWidth : barHeight(data) * 1.5))
                    .attr('height', () => (isVertical ? barHeight(data) * 1.5 : barWidth))
                    .attr('rx', that.barConfig.borderRadius)
                    .attr('ry', that.barConfig.borderRadius);
                selection.attr('clip-path', () => `url(#rounded_${id})`);
            };
            // 平行呈現 d3.Selection<any, any, any, any>
            const setParallelBar = (selection) => {
                //#region ParallelBar attributes
                const gridBand = isVertical
                    ? that.gridState.xGridlineBottom.bandwidth() * that.barConfig.bandwidth
                    : that.gridState.yGridlineLeft.bandwidth() * that.barConfig.bandwidth;
                const barWidth = (gridBand - gap * (groupData.length - 1)) / groupData.length;
                const barHeight = function (d) {
                    return isVertical
                        ? Math.abs(that.getYPosition(d) - that.getYPosition({ key: d.key, value: 0 }))
                        : Math.abs(that.getXPosition(d) - that.getXPosition({ key: d.key, value: 0 }));
                };
                const posX = function (d) {
                    return isVertical
                        ? that.getXPosition(d) + i * (barWidth + gap)
                        : that.getXPosition({
                            key: d.key,
                            value: Math.max(0, Number(d.value))
                        }) - barHeight(d);
                };
                const posY = function (d) {
                    return isVertical
                        ? that.getYPosition({
                            key: d.key,
                            value: Math.max(0, Number(d.value))
                        })
                        : that.getYPosition(d) + i * (barWidth + gap);
                };
                //#endregion
                selection
                    .attr('fill', getSelectionColor(d3.select(this), that.dataColorArray[i], `bar_${that.gridState.id}`, i, that.dataSetWithDataArrays[i].gradientDirection))
                    .attr('x', (d) => posX(d))
                    .attr('y', (d) => posY(d))
                    .attr('width', (d) => (isVertical ? barWidth : barHeight(d)))
                    .attr('height', (d) => (isVertical ? barHeight(d) : barWidth))
                    .call((selection) => {
                    selection.each(function (data, index) {
                        roundedMask(d3.select(this), index, data, data.value, posX, posY, barWidth, barHeight);
                        if (that.barConfig.showValueLabel) {
                            setValueLabel(index, data, data.value, posX, posY, barWidth, barHeight);
                        }
                    });
                });
            };
            const setValueLabel = (index, data, dataValue, posX, posY, barWidth, barHeight) => {
                const parent = d3.select(this);
                const id = `${that.factoryId}_${i}_${index}`;
                let textSelection = parent.select(`#bar_valueLabel_${id}`);
                if (textSelection.empty()) {
                    textSelection = parent.append('text').attr('id', `bar_valueLabel_${id}`);
                }
                const dataValueNumber = Number(dataValue);
                const labelRect = getTextRect(dataValueNumber.toString(), that.barConfig.valueLabelFontSetting['font-family'], that.barConfig.valueLabelFontSetting['font-size'], that.barConfig.valueLabelFontSetting['font-weight']);
                const gap = 8;
                const deltaX = isVertical
                    ? barWidth / 2 - labelRect.width / 2
                    : dataValueNumber >= 0
                        ? barHeight(data) + (that.barConfig.isValueLabelOutside ? gap : -labelRect.width - gap)
                        : that.barConfig.isValueLabelOutside ? -labelRect.width - gap : gap;
                // const deltaY = barWidth / 2 + labelRect.height / 2 - gap;
                const deltaY = isVertical
                    ? dataValueNumber >= 0
                        ? (that.barConfig.isValueLabelOutside ? -gap : labelRect.height)
                        : barHeight(data) + (that.barConfig.isValueLabelOutside ? labelRect.height : -gap)
                    : barWidth / 2 + labelRect.height / 2 - gap;
                textSelection
                    .transition()
                    .duration(useAnimation ? 500 : 0)
                    .attr('x', () => posX(data) + deltaX)
                    .attr('y', () => posY(data) + deltaY)
                    .attr('fill', that.barConfig.valueLabelFontSetting.color)
                    .attr('font-family', that.barConfig.valueLabelFontSetting['font-family'])
                    .attr('font-size', that.barConfig.valueLabelFontSetting['font-size'])
                    .attr('font-weight', that.barConfig.valueLabelFontSetting['font-weight'])
                    .text(dataValueNumber);
            };
            // 堆疊呈現
            const setStackBar = (selection) => {
                //#region StackBar attributes
                const barWidth = isVertical
                    ? that.gridState.xGridlineBottom.bandwidth()
                    : that.gridState.yGridlineLeft.bandwidth();
                const barHeight = function (d) {
                    return isVertical
                        ? Math.abs(that.getYPosition({ key: d.data.stackKeyName, value: d[0] }) -
                            that.getYPosition({ key: d.data.stackKeyName, value: d[1] }))
                        : Math.abs(that.getXPosition({ key: d.data.stackKeyName, value: d[0] }) -
                            that.getXPosition({ key: d.data.stackKeyName, value: d[1] }));
                };
                const posX = function (d) {
                    return isVertical
                        ? that.gridState.xGridlineBottom(d.data.stackKeyName) || 0
                        : that.getXPosition({ key: d.data.stackKeyName, value: d[1] }) - barHeight(d);
                };
                const posY = function (d) {
                    return isVertical
                        ? that.getYPosition({ key: d.data.stackKeyName, value: d[1] })
                        : that.gridState.yGridlineLeft(d.data.stackKeyName) || 0;
                };
                //#endregion
                selection
                    .attr('fill', getSelectionColor(d3.select(this), that.dataColorArray[i], `bar_${that.gridState.id}`, i, that.dataSetWithDataArrays[i].gradientDirection))
                    .attr('x', (d) => posX(d))
                    .attr('y', (d) => posY(d))
                    .attr('width', (d) => (isVertical ? barWidth : barHeight(d)))
                    .attr('height', (d) => (isVertical ? barHeight(d) : barWidth))
                    .call((selection) => {
                    selection.each(function (data, index) {
                        const key = dataArray.key;
                        if ((data[0] < 0 && data[0] == negetiveSumArray[index]) || data[1] == positiveSumArray[index]) {
                            roundedMask(d3.select(this), index, data, data.data[key], posX, posY, barWidth, barHeight);
                            if (that.barConfig.showValueLabel) {
                                setValueLabel(index, data, data.data[key], posX, posY, barWidth, barHeight);
                            }
                        }
                    });
                });
            };
            // 單行提示框
            const singleTooltip = (selection) => {
                selection
                    .on('pointerover', function (event, d) {
                    that.tooltipFactory.setPositionStrategy({
                        x: 'center',
                        y: Number(d.value) > 0 ? 'top' : 'bottom'
                    });
                    const element = event.currentTarget;
                    const j = that.dataSetWithDataArrays[i].data.findIndex(item => item.key == d.key);
                    // 取得所有 barGroup 中相同 index 的 bar
                    let elements = [];
                    for (let index = 0; index < that.dataSetWithDataArrays.length; index++) {
                        const el = d3.select(`rect#bar_${that.gridState.id}_${index}_${j}`).node();
                        elements.push(el);
                    }
                    const pointeroverData = {
                        key: d.key,
                        activeIndex: i,
                        data: that.dataSetWithDataArrays.map(item => item.data[j]),
                        elements: elements,
                        event: event
                    };
                    that.pointerover$.next(pointeroverData);
                    if (!that.barConfig.showTooltip)
                        return;
                    that.tooltipFactory.setElement(element).setColor([that.dataColorArray[i]]).setData([d]).draw();
                })
                    .on('pointermove', function (event) {
                    d3.select(this).dispatch('grid-hover', event);
                })
                    .on('pointerout', function (event, d) {
                    that.pointerout$.next(event);
                    if (!that.barConfig.showTooltip)
                        return;
                    that.tooltipFactory.clear();
                });
            };
            // 多行提示框
            const multiTooltip = (selection) => {
                selection
                    .on('pointerover', function (event, d) {
                    d3.select(this)
                        .transition()
                        .duration(useAnimation ? 500 : 0)
                        .ease(d3.easeCubicInOut)
                        .attr('r', 1.5);
                    const element = event.currentTarget;
                    const tooltipDataArray = [];
                    for (const key of Object.keys(d.data)) {
                        if (key !== 'stackKeyName') {
                            tooltipDataArray.push({ key: key, value: d.data[key] });
                        }
                    }
                    that.tooltipFactory.setConfig({ activeIndex: i });
                    const pointeroverData = {
                        key: d.data['stackKeyName'],
                        activeIndex: i,
                        data: tooltipDataArray,
                        elements: [element],
                        event: event
                    };
                    that.pointerover$.next(pointeroverData);
                    if (!that.barConfig.showTooltip)
                        return;
                    that.tooltipFactory.setElement(element).setColor(that.dataColorArray).setData(tooltipDataArray).draw();
                })
                    .on('pointermove', function (event) {
                    d3.select(this).dispatch('grid-hover', event);
                })
                    .on('pointerout', function (event, d) {
                    d3.select(this)
                        .transition()
                        .duration(useAnimation ? 500 : 0)
                        .attr('r', 1);
                    that.pointerout$.next(event);
                    if (!that.barConfig.showTooltip)
                        return;
                    that.tooltipFactory.clear();
                });
            };
            //#endregion
            d3.select(this)
                .selectAll('rect.bar')
                .data(dataArray, (d) => d.key)
                .join(enter => enter
                .append('rect')
                .attr('class', 'bar')
                .attr('id', (d, j) => `bar_${that.gridState.id}_${i}_${j}`)
                .call(that.barConfig.isStack ? setStackBar : setParallelBar)
                .call(that.barConfig.isStack ? multiTooltip : singleTooltip),
            // .call(enterAnimation.bind(that))
            update => update
                .transition()
                .duration(useAnimation ? 500 : 0)
                .call(that.barConfig.isStack ? setStackBar : setParallelBar), exit => exit.remove());
        });
        this.isFirstUpdate = false;
    }
    clear(useAnimation = false) {
        this.barArrayGroup
            .selectAll('rect')
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove();
        this.barArrayGroup
            .selectAll('defs')
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove();
    }
    /** 判斷使用哪種動畫 */
    getAnimation(selection) {
        switch (this.barConfig.enterAnimationType) {
            case BarAnimationType.startToEnd:
                return this.animateStartToEnd(selection);
            case BarAnimationType.fadeIn:
                return this.animateFadeIn(selection);
            case BarAnimationType.none:
            default:
                return selection;
        }
    }
    /** line 動畫 從頭畫到尾 */
    animateStartToEnd(selection) {
        return selection
            .attr('stroke-dasharray', function () {
            return `${this.getTotalLength()} ${this.getTotalLength()}`;
        })
            .attr('stroke-dashoffset', function () {
            return this.getTotalLength();
        })
            .call(selection => {
            selection
                .transition('animateStartToEnd')
                .duration(500)
                .attr('stroke-dashoffset', 0)
                .on('end', function () {
                d3.select(this).attr('stroke-dasharray', 'none');
            });
        });
    }
    /** line 動畫 淡入 */
    animateFadeIn(selection) {
        return selection.attr('opacity', 0).call(selection => selection.transition().duration(1000).attr('opacity', 1));
    }
}
/** BarFactory 的動畫種類 */
var BarAnimationType;
(function (BarAnimationType) {
    BarAnimationType[BarAnimationType["none"] = 0] = "none";
    BarAnimationType[BarAnimationType["startToEnd"] = 1] = "startToEnd";
    BarAnimationType[BarAnimationType["fadeIn"] = 2] = "fadeIn";
})(BarAnimationType || (BarAnimationType = {}));

/** 基礎長條圖 */
class BarChart extends RootChart {
    gridFactory;
    gridlineFactory;
    barFactory;
    barDataSetWithDataArray = [];
    isUseGridlineFactory = true;
    isUseBarFactory = true;
    constructor(selector) {
        super(selector);
        this.gridFactory = new GridFactory(this);
        this.gridFactory.setBandwidth(0.5);
        this.setFactory();
    }
    setFactory() {
        this.gridlineFactory = this.gridlineFactory
            ? this.gridlineFactory.setGridFactory(this.gridFactory)
            : new GridlineFactory(this.gridFactory);
        this.barFactory = this.barFactory
            ? this.barFactory.setGridFactory(this.gridFactory)
            : new BarFactory(this.gridFactory);
    }
    /** 設定資料 */
    setDataSets(dataSets, isStack = false) {
        this.barDataSetWithDataArray = dataSets;
        const gridDataSetting = this.barDataSetWithDataArray.map((item) => {
            return { dataSetWithDataArray: item, isStack: isStack };
        });
        this.gridFactory.setDataSetWithDataArrays(gridDataSetting);
        this.barFactory.setDataSets(this.barDataSetWithDataArray);
        this.barFactory.setStack(isStack);
        return this;
    }
    /** 設定要使用的 GridFactory */
    setGridFactory(gridFactory) {
        this.gridFactory = gridFactory;
        return this;
    }
    /** 設定要使用的 GridlineFactory */
    setGridlineFactory(gridlineFactory) {
        this.gridlineFactory = gridlineFactory;
        return this;
    }
    /** 設定要使用的 BarFactory */
    setBarFactory(barFactory) {
        this.barFactory = barFactory;
        return this;
    }
    getGridFactory() {
        return this.gridFactory;
    }
    getGridlineFactory() {
        return this.gridlineFactory;
    }
    getBarFactory() {
        return this.barFactory;
    }
    drawChart(useAnimation = false) {
        this.gridFactory.draw(useAnimation);
        this.setFactory();
        setTimeout(() => {
            this.isUseGridlineFactory
                ? this.gridlineFactory.draw(useAnimation)
                : this.gridlineFactory.clear(useAnimation);
            this.isUseBarFactory
                ? this.barFactory.draw(useAnimation)
                : this.barFactory.clear(useAnimation);
        }, 0);
    }
}

class BarLineChart extends RootChart {
    gridFactory;
    gridlineFactory;
    lineFactory;
    dotFactory;
    barFactory;
    lineDataSetWithDataArray = [];
    barDataSetWithDataArray = [];
    lineAxisIndex = 0;
    barAxisIndex = 0;
    isUseGridlineFactory = true;
    isUseBarFactory = true;
    isUseLineFactory = true;
    isUseDotFactory = true;
    constructor(selector) {
        super(selector);
        this.gridFactory = new GridFactory(this);
        this.gridFactory.setBandwidth(0.5);
        this.setFactory();
    }
    setFactory() {
        this.gridlineFactory = this.gridlineFactory
            ? this.gridlineFactory.setGridFactory(this.gridFactory)
            : new GridlineFactory(this.gridFactory);
        this.barFactory = this.barFactory
            ? this.barFactory.setGridFactory(this.gridFactory)
            : new BarFactory(this.gridFactory);
        this.barFactory.setDataSets(this.barDataSetWithDataArray, this.barAxisIndex);
        this.lineFactory = this.lineFactory
            ? this.lineFactory.setGridFactory(this.gridFactory)
            : new LineFactory(this.gridFactory);
        this.lineFactory.setDataSets(this.lineDataSetWithDataArray, this.lineAxisIndex);
        this.dotFactory = this.dotFactory
            ? this.dotFactory.setLineFactory(this.lineFactory)
            : new DotFactory(this.lineFactory);
    }
    /** 設定折線資料
     * @param dataSets DataSetWithDataArray[]
     * @param axisIndex ? 第幾條 key 軸，預設為 1
     */
    setLineDataSets(dataSets, axisIndex = 1) {
        this.lineDataSetWithDataArray = dataSets;
        this.lineAxisIndex = axisIndex;
        this.setGridDataSets();
        return this;
    }
    /** 設定長條資料
     * @param dataSets DataSetWithDataArray[]
     * @param axisIndex ? 第幾條 key 軸，預設為 0
     */
    setBarDataSets(dataSets, axisIndex = 0) {
        this.barDataSetWithDataArray = dataSets;
        this.barAxisIndex = axisIndex;
        this.setGridDataSets();
        return this;
    }
    setGridDataSets() {
        const gridBarDataSetting = this.barDataSetWithDataArray.map((item) => {
            return {
                dataSetWithDataArray: item,
                isStack: true,
                axisIndex: this.barAxisIndex,
            };
        });
        const gridLineDataSetting = this.lineDataSetWithDataArray.map((item) => {
            return {
                dataSetWithDataArray: item,
                isStack: false,
                axisIndex: this.lineAxisIndex,
            };
        });
        this.gridFactory.setDataSetWithDataArrays([
            ...gridBarDataSetting,
            ...gridLineDataSetting,
        ]);
    }
    /** 設定要使用的 GridFactory */
    setGridFactory(gridFactory) {
        this.gridFactory = gridFactory;
        return this;
    }
    /** 設定要使用的 GridlineFactory */
    setGridlineFactory(gridlineFactory) {
        this.gridlineFactory = gridlineFactory;
        return this;
    }
    /** 設定要使用的 LineFactory */
    setLineFactory(lineFactory) {
        this.lineFactory = lineFactory;
        return this;
    }
    /** 設定要使用的 BarFactory */
    setBarFactory(barFactory) {
        this.barFactory = barFactory;
        return this;
    }
    getGridFactory() {
        return this.gridFactory;
    }
    getGridlineFactory() {
        return this.gridlineFactory;
    }
    getLineFactory() {
        return this.lineFactory;
    }
    getDotFactory() {
        return this.dotFactory;
    }
    getBarFactory() {
        return this.barFactory;
    }
    useGridlineFactory(isUseGridlineFactory) {
        this.isUseGridlineFactory = isUseGridlineFactory;
        return this;
    }
    useBarFactory(isUseBarFactory) {
        this.isUseBarFactory = isUseBarFactory;
        return this;
    }
    useLineFactory(isUseLineFactory) {
        this.isUseLineFactory = isUseLineFactory;
        return this;
    }
    useDotFactory(isUseDotFactory) {
        this.isUseDotFactory = isUseDotFactory;
        return this;
    }
    drawChart(useAnimation = false) {
        this.gridFactory.draw(useAnimation);
        this.setFactory();
        setTimeout(() => {
            this.isUseGridlineFactory
                ? this.gridlineFactory.draw(useAnimation)
                : this.gridlineFactory.clear(useAnimation);
            this.isUseBarFactory
                ? this.barFactory.draw(useAnimation)
                : this.barFactory.clear(useAnimation);
            this.isUseLineFactory
                ? this.lineFactory.draw(useAnimation)
                : this.lineFactory.clear(useAnimation);
            this.isUseDotFactory
                ? this.dotFactory.draw(useAnimation)
                : this.dotFactory.clear(useAnimation);
        }, 0);
    }
}

const DefaultPieConfig = {
    donutWidthRatio: 1
};

var LabelDispalyMode;
(function (LabelDispalyMode) {
    /** LabelOnly */
    LabelDispalyMode["LabelOnly"] = "labelOnly";
    /** ValueOnly */
    LabelDispalyMode["ValueOnly"] = "valueOnly";
    /** LabelValue */
    LabelDispalyMode["LabelValue"] = "labelValue";
})(LabelDispalyMode || (LabelDispalyMode = {}));
const DefaultRadialConfig = {
    labelOffset: 0,
    labelFontConfig: DefaultLabel,
    labelDispalyMode: LabelDispalyMode.LabelValue
};

/** 雷達組件 */
class PieFactory extends BasicFactory {
    tooltipFactory;
    pieGroup;
    radialState;
    radialConfig;
    dataSetWithData = [];
    pieConfig = deepCopy(DefaultPieConfig);
    pointerover$ = new Subject();
    pointerout$ = new Subject();
    constructor(radialFactory, tooltipFactory = new BasicTooltipFactory()) {
        super();
        this.tooltipFactory = tooltipFactory;
        this.radialState = radialFactory.getState();
        this.radialConfig = radialFactory.getConfig();
        this.pieGroup = d3.select(`g#pieFactory_${this.factoryId}`).node()
            ? d3.select(`g#pieFactory_${this.factoryId}`)
            : d3
                .select(radialFactory.getSelector())
                .append('g')
                .attr('id', `pieFactory_${this.factoryId}`);
        this.tooltipFactory.setPositionStrategy({ x: 'right', y: 'center' });
    }
    setConfig(pieConfig) {
        Object.assign(this.pieConfig, pieConfig);
        return this;
    }
    setRadialFactory(radialFactory) {
        this.radialState = radialFactory.getState();
        this.radialConfig = radialFactory.getConfig();
        return this;
    }
    setData(data) {
        this.dataSetWithData = data;
        return this;
    }
    getConfig() {
        return this.pieConfig;
    }
    getSelector() {
        return `g#pieFactory_${this.factoryId}`;
    }
    /** 監聽 Pointerover 事件 */
    onPointerover() {
        return this.pointerover$.asObservable();
    }
    /** 監聽 Pointerout 事件 */
    onPointerout() {
        return this.pointerout$.asObservable();
    }
    draw(useAnimation = false) {
        const pie = d3.pie().sort(null);
        const ratio = Math.min(Math.max(this.pieConfig.donutWidthRatio ?? 1, 0), 1);
        const arc = d3
            .arc()
            .outerRadius(this.radialState.radius)
            .innerRadius(this.radialState.radius * (1 - ratio));
        const labelArc = d3
            .arc()
            .outerRadius(this.radialState.radius)
            .innerRadius(this.radialState.radius);
        const offset = this.radialConfig.labelOffset;
        const data = this.dataSetWithData.map((d) => Number(d.data.value));
        const pieData = pie(data);
        // ----------- Pie slices -------------
        const slices = this.pieGroup
            .selectAll('path.pie-slice')
            .data(pieData);
        slices
            .join((enter) => enter
            .append('path')
            .attr('class', 'pie-slice')
            .attr('d', arc)
            .attr('fill', (d, i) => {
            const colors = this.dataSetWithData?.[i]?.colors;
            return colors?.[0] ?? DefaultDataColorArray[i % 10][0].color;
        })
            .style('opacity', 0), (update) => update, (exit) => exit.transition().duration(300).style('opacity', 0).remove())
            .transition()
            .duration(useAnimation ? 500 : 0)
            .attr('d', arc)
            .style('opacity', 1);
        // ----------- Labels -------------
        const labels = this.pieGroup
            .selectAll('text.label')
            .data(pieData);
        labels
            .join((enter) => enter.append('text').attr('class', 'label').style('opacity', 0), (update) => update, (exit) => exit.transition().duration(300).style('opacity', 0).remove())
            .text((d, i) => {
            const value = d.data.toString();
            const prefix = this.radialConfig.labelDispalyMode === LabelDispalyMode.LabelValue
                ? this.dataSetWithData[i].label + ':'
                : '';
            return `${prefix} ${value} ${this.dataSetWithData[i].unitText || ''}`;
        })
            .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
            .attr('dx', (d) => {
            const angleRad = (d.startAngle + d.endAngle) / 2;
            return Math.cos(angleRad - Math.PI / 2) * offset;
        })
            .attr('dy', (d) => {
            const angleRad = (d.startAngle + d.endAngle) / 2;
            const adjustedSin = Math.sin(angleRad - Math.PI / 2);
            return (adjustedSin * (offset + this.radialState.labelSize.height / 2) +
                this.radialState.labelSize.height / 12);
        })
            .style('text-anchor', (d) => {
            const angleDeg = ((d.startAngle + d.endAngle) / 2) * (180 / Math.PI);
            if ((angleDeg >= -5 && angleDeg <= 5) ||
                (angleDeg >= 175 && angleDeg <= 185)) {
                return 'middle';
            }
            return angleDeg < 180 ? 'start' : 'end';
        })
            .style('font-size', this.radialConfig.labelFontConfig['font-size'])
            .style('font-family', this.radialConfig.labelFontConfig['font-family'])
            .style('font-weight', this.radialConfig.labelFontConfig['font-weight'])
            .style('fill', this.radialConfig.labelFontConfig['color'])
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 1);
        this.isFirstUpdate = false;
    }
    clear(useAnimation = false) {
        this.pieGroup
            .selectAll('path.pie-slice')
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove();
        this.pieGroup
            .selectAll('text.label')
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove();
    }
}

const DefaultRadialState = {
    radius: 20,
    labelSize: { height: 0, width: 0 }
};

/** 輻射定位組件，輻射中心型圖表必須使用 */
class RadialFactory extends BasicFactory {
    chart;
    radialGroup;
    dataSetWithData = [];
    radialConfig = deepCopy(DefaultRadialConfig);
    radialState = deepCopy(DefaultRadialState);
    pointerover$ = new Subject();
    pointerout$ = new Subject();
    constructor(chart) {
        super();
        this.chart = chart;
        this.radialGroup = this.chart.svg
            .select(`g#radialFactory_${this.factoryId}`)
            .node()
            ? this.chart.svg.select(`g#radialFactory_${this.chart.id}`)
            : this.chart.svg
                .append('g')
                .attr('id', `radialFactory_${this.factoryId}`);
        this.radialGroup.attr('transform', `translate(${this.chart.size.width / 2},${this.chart.size.height / 2 + 5})` // 暫時補正5點，之後調整
        );
    }
    setConfig(radialConfig) {
        Object.assign(this.radialConfig, radialConfig);
        return this;
    }
    setData(data) {
        this.dataSetWithData = data;
        return this;
    }
    getConfig() {
        return this.radialConfig;
    }
    getState() {
        return this.radialState;
    }
    getSelector() {
        return `g#radialFactory_${this.factoryId}`;
    }
    /** 監聽 Pointerover 事件 */
    onPointerover() {
        return this.pointerover$.asObservable();
    }
    /** 監聽 Pointerout 事件 */
    onPointerout() {
        return this.pointerout$.asObservable();
    }
    draw(useAnimation = false) {
        // Sample data
        const fontSize = this.radialConfig.labelFontConfig['font-size'];
        const textHeight = getTextRect('q0p', undefined, fontSize).height / 1.5; // 文字高度
        let maxWidthItem = null;
        let maxWidth = 0;
        for (const item of this.dataSetWithData) {
            const text = (item.data.value || '').toString() + (item.unitText || '');
            const { width } = getTextRect(text, undefined, fontSize); // 只取寬度
            if (width > maxWidth) {
                maxWidth = width;
                maxWidthItem = item;
            }
        }
        // Define the radius of the pie chart
        this.radialState.radius = Math.min(this.chart.size.width / 2 - maxWidth - this.radialConfig.labelOffset, this.chart.size.height / 2 - textHeight - this.radialConfig.labelOffset);
        this.radialState.labelSize = { height: textHeight, width: maxWidth };
        this.isFirstUpdate = false;
    }
    clear(useAnimation = false) { }
}

/** 基礎折線圖 */
class PieChart extends RootChart {
    radialFactory;
    pieFactory;
    pieDataSetWithData = [];
    constructor(selector) {
        super(selector);
        this.radialFactory = new RadialFactory(this);
        this.setFactory();
    }
    setFactory() {
        this.pieFactory = this.pieFactory
            ? this.pieFactory.setRadialFactory(this.radialFactory)
            : new PieFactory(this.radialFactory);
    }
    /** 設定資料 */
    setDataSets(dataSets) {
        this.pieDataSetWithData = dataSets;
        this.radialFactory.setData(dataSets);
        this.pieFactory.setData(dataSets);
        return this;
    }
    getRadialFactory() {
        return this.radialFactory;
    }
    getPieFactory() {
        return this.pieFactory;
    }
    drawChart(useAnimation) {
        this.radialFactory.draw();
        setTimeout(() => {
            this.pieFactory.draw();
        }, 0);
    }
}

const DefaultLegendConfig = {
    'font-size': '14px',
    'font-weight': '400',
    'font-family': '"PingFang TC","Segoe UI", "Roboto", "微軟正黑體", "sans-serif"',
    'text-color': '#333',
    'group-gap': '16px',
    'padding': '16px',
    'flex-direction': 'row',
    'align-items': 'center',
    'justify-content': 'center',
};

class LegendFactory extends BasicFactory {
    input;
    dataSets = [];
    legendGroup;
    legendConfig = deepCopy(DefaultLegendConfig);
    legendId = getRandomId();
    colorArray = [];
    constructor(input) {
        super();
        this.input = input;
        if (typeof this.input !== 'string') {
            this.legendGroup = this.input.svg.select('g.d3-legendGroup');
        }
        else {
            this.legendGroup = d3
                .select(this.input)
                .append('div')
                .attr('class', 'd3-legendGroup')
                .attr('id', `legendGroup_${this.legendId}`)
                .style('display', 'flex')
                .style('flex-direction', this.legendConfig['flex-direction'])
                .style('align-items', this.legendConfig['align-items'])
                .style('justify-content', this.legendConfig['justify-content'])
                .style('gap', this.legendConfig['group-gap'])
                .style('padding', this.legendConfig.padding);
        }
    }
    setDataSets(dataSetsArray) {
        this.dataSets = dataSetsArray.flat();
        this.colorArray = [];
        for (const dataSets of dataSetsArray) {
            const color = getColorTypeArray(dataSets);
            const colorSubArray = color.slice(0, dataSets.length);
            this.colorArray.push(...colorSubArray);
        }
        return this;
    }
    setConfig(legendConfig) {
        Object.assign(this.legendConfig, legendConfig);
        return this;
    }
    getSelector() {
        return `#legendGroup_${this.legendId}`;
    }
    getConfig() {
        return this.legendConfig;
    }
    draw(useAnimation = false) {
        this.legendGroup
            .style('display', 'flex')
            .style('flex-direction', this.legendConfig['flex-direction'])
            .style('align-items', this.legendConfig['align-items'])
            .style('justify-content', this.legendConfig['justify-content'])
            .style('gap', this.legendConfig['group-gap'])
            .style('padding', this.legendConfig.padding);
        const that = this;
        const appendIcon = function (selection) {
            selection.each(function (d, i) {
                d3.select(this)
                    .append('div')
                    .attr('class', 'd3-legend-icon')
                    .attr('id', `legend_icon_${that.legendId}_${i}`)
                    .style('width', '20px')
                    .style('height', '6px')
                    .style('border-radius', '9999px')
                    .style('background', getCssColor(that.colorArray[i]));
            });
        };
        const appendText = function (selection) {
            selection.each(function (d, i) {
                d3.select(this)
                    .append('span')
                    .attr('class', 'd3-legend-text')
                    .attr('id', `legend_text_${that.legendId}_${i}`)
                    .style('font-size', that.legendConfig['font-size'])
                    .style('font-weight', that.legendConfig['font-weight'])
                    .style('font-family', that.legendConfig['font-family'])
                    .style('color', that.legendConfig['text-color'])
                    .style('user-select', 'none')
                    .text(d.label);
            });
        };
        this.legendGroup
            .selectAll('div.d3-legend')
            .data(this.dataSets)
            .join(enter => enter
            .append('div')
            .attr('class', 'd3-legend')
            .attr('id', (d, i) => `legend_${this.legendId}_${i}`)
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('gap', '4px')
            .call(appendIcon)
            .call(appendText), update => update
            .call(selection => selection.select('.d3-legend-icon').remove()) // Remove old icon
            .call(selection => selection.select('.d3-legend-text').remove()) // Remove old text
            .call(appendIcon) // Re-append updated icon
            .call(appendText), // Re-append updated text,
        // Re-append updated text,
        exit => exit
            .transition()
            .duration(useAnimation ? 500 : 0)
            .style('opacity', 0)
            .remove());
        this.isFirstUpdate = false;
    }
    clear() {
        this.legendGroup.selectAll().transition().duration(500).style('opacity', 0).remove();
    }
}

// 圖表

/**
 * Generated bundle index. Do not edit.
 */

export { AreaAnimationType, AreaChart, AreaFactory, BarAnimationType, BarChart, BarFactory, BarLineChart, BasicFactory, BasicTooltipFactory, ColorType, D3Accessor, DefaultAxisLabel, DefaultBarConfig, DefaultDataColor, DefaultDataColorArray, DefaultDotConfig, DefaultGridConfig, DefaultGridlineConfig, DefaultLabel, DefaultLegendConfig, DefaultLineConfig, DefaultPieConfig, DefaultRadialConfig, DefaultTooltipConfig, Direction, DotFactory, FontFamilyType, GridFactory, GridlineFactory, KeyGridlineAlignment, LabelDispalyMode, LegendFactory, LineAnimationType, LineChart, LineFactory, PieChart, PieFactory, PositionXType, PositionYType, RadialFactory, RootChart, RootSvg, TooltipFactory };
//# sourceMappingURL=cci-ng-chart-tool.mjs.map
