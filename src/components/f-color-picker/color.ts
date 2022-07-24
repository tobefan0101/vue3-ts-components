// 色带
export const colorList = [[255, 0, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [255, 0, 255], [255, 0, 0]];
export const colorPercent = [0, 16.66, 33.33, 50, 66.66, 83.33, 100];
export const hex3to6 = (hex: string) => {
    if (!hex.includes('#')) {
        hex = '#' + hex;
    }
    const argb = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (argb && argb.length > 0) {
        return '#' + argb[1] + argb[1] + argb[2] + argb[2] + argb[3] + argb[3];
    }
    return hex;
}
// 将八位颜色转换为透明度+颜色
export const decodeColor = (val: string) => {
    const alpha = Math.round(parseInt(val.slice(1, 3), 16) / 255 * 100);
    const color = '#' + val?.slice(3)
    return {
        alpha,
        color
    }
}
// 将透明度+颜色合并成八位颜色
export const encodeColor = (param: {
    alpha: number,
    color: string
}) => {
    let alpha = Math.round(param.alpha / 100 * 255).toString(16);
    if (alpha.length < 2) {
        alpha = '0' + alpha;
    }
    return '#' + alpha + param.color.slice(1);
}
// rgb转hex
export const rgbToHex = (rgb: number[]) => {
    return rgb.reduce((a: string, b: number) => {
        let t = (b).toString(16);
        if (t.length < 2) {
            t = '0' + t;
        }
        return a + t;
    }, '#')
}
// hex转rgb
export const hexToRgb = (hex: string) => {
    hex = hex3to6(hex);
    const argb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (argb && argb.length > 0) {
        const r = parseInt(argb[1], 16);
        const g = parseInt(argb[2], 16);
        const b = parseInt(argb[3], 16);
        return [r, g, b];
    }
    return [255, 255, 255];
}
// RGB 转 HSB
export const rgbToHsb = (rgb: number[]) => {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const v = Math.max(r, g, b),
        n = v - Math.min(r, g, b);
    const h =
        n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
    return [Math.round(60 * (h < 0 ? h + 6 : h)), Math.round(v && (n / v) * 100), Math.round(v * 100)];
};
// HSB 转 RGB
export const hsbToRgb = (hsb: number[]) => {
    const h = hsb[0];
    const s = hsb[1] / 100;
    const b = hsb[2] / 100;
    const k = (n: number) => (n + h / 60) % 6;
    const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [Math.round(255 * f(5)), Math.round(255 * f(3)), Math.round(255 * f(1))];
};
// RGB 转 HSL
export const rgbToHsl = (rgb: number[]) => {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
            ? (g - b) / s
            : l === g
                ? 2 + (b - r) / s
                : 4 + (r - g) / s
        : 0;
    return [
        Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h),
        Math.round(100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)),
        Math.round((100 * (2 * l - s)) / 2),
    ];
}
// HSL 转 RGB
export const hslToRgb = (hsl: number[]) => {
    const h = hsl[0];
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
}

// 八位颜色转换为rgba
export const hex8toRgb = (val: string) => {
    const alphaStr = val.slice(1, 3);
    const alpha = parseInt(alphaStr, 16) / 255;
    const rgb = hexToRgb(val.slice(3));
    return 'rgba(' + rgb[0] + ',' + rgb[0] + ',' + rgb[0] + ',' + alpha.toFixed(2) + ')';
}

// 根据两个色值及位置百分比获取颜色
export const getColorBetween2Rgb = (startRgb: number[], endRgb: number[], p: number): number[] => {
    let rgb = [];
    const r = (endRgb[0] - startRgb[0]);
    const g = (endRgb[1] - startRgb[1]);
    const b = (endRgb[2] - startRgb[2]);
    rgb = [
        Math.ceil(startRgb[0] + (p * r)),
        Math.ceil(startRgb[1] + (p * g)),
        Math.ceil(startRgb[2] + (p * b))
    ];
    return rgb;
}

/**
 * 获取颜色选择器最终的颜色
 * xPercent 当前选择点相对于容器宽度的比例
 * yPercent 当前选择点相对于容器高度的比例
 * renderColor 当前选择容器的主色
 */
export const getFinalPickColor = (xPercent: number, yPercent: number, renderColor: number[]) => {
    const white = [255, 255, 255];
    const black = [0, 0, 0];
    // 首先根据百分比获取x轴的颜色，即白色到主色
    const xColor = getColorBetween2Rgb(white, renderColor, xPercent);
    // 再根据百分比获取x轴颜色到黑色的颜色
    return getColorBetween2Rgb(xColor, black, yPercent);
}

/**
 * 根据最终选中颜色获取颜色选择器的主色
 * xPercent 当前选择点相对于容器宽度的比例
 * yPercent 当前选择点相对于容器高度的比例
 * finalRgb 最终颜色
 */
export const getMainColorByFinalPickerColor = (xPercent: number, yPercent: number, finalRgb: number[]) => {
    const white = [255, 255, 255];
    const black = [0, 0, 0];
    // 反向推导，首先根据最终颜色与黑色获得x轴的颜色
    const xColor = [
        black[0] - finalRgb[0] * (1 / yPercent),
        black[1] - finalRgb[1] * (1 / yPercent),
        black[2] - finalRgb[2] * (1 / yPercent),
    ];
    const res = [
        white[0] + (xColor[0] * (1 / xPercent)),
        white[1] + (xColor[1] * (1 / xPercent)),
        white[2] + (xColor[2] * (1 / xPercent)),
    ]
    console.log(res, '333')
    return res.map(n => Math.abs(n) > 255 ? 255 : Math.abs(n))
}
/**
 * 根据渲染主色获取色带选择的rangeNum
 * @param mainRgb
 */
export const gerRangeNumByFinalPickerColor = (mainRgb: number[]) => {
    let min = 255, minIndex = 0, maxIndex = 0;
    mainRgb.forEach((n, i) => {
        if (n < min) {
            min = n;
            minIndex = i;
        }
        if (n === 255) {
            maxIndex = i;
        }
    })
    let colorPercentIndex = 0; // 颜色百分数数组的索引
    let calcVal = 0; // 用于计算的属性
    let calcDirection = 1; // 计算方向(1)，正向： 0 -> 255  反向(0)： 255 -> 0
    switch (maxIndex) {
        case 0:
            if(minIndex === 1) {
                colorPercentIndex = 5
                calcVal = mainRgb[2];
                calcDirection = 0;

            }else {
                colorPercentIndex = 0;
                calcVal = mainRgb[1];
                calcDirection = 1;
            }
            break;
        case 1:
            if(minIndex === 0) {
                colorPercentIndex = 2
                calcVal = mainRgb[2];
                calcDirection = 1
            }else {
                colorPercentIndex = 1;
                calcVal = mainRgb[1];
                calcDirection = 1
            }
            break;
        case 2:
            if(minIndex === 0) {
                colorPercentIndex = 3
                calcVal = mainRgb[1];
                calcDirection = 0
            }else {
                colorPercentIndex = 4;
                calcVal = mainRgb[0];
                calcDirection = 1
            }
            break;
    }
    const percent = calcDirection === 1 ? calcVal / 255 : (255-calcVal) / 255;
    return Math.round(percent * 16.67 + colorPercent[colorPercentIndex]);
}