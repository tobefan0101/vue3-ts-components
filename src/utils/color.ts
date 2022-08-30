const isHex8 = (val: string) => /^#[a-fA-F\d+]{8}$/.test(val)
const isHex6 = (val: string) => /^#[a-fA-F\d+]{6}$/.test(val)
export const isHex = (val: string) => {
    return isHex8(val) || isHex6(val)
}
export const hex3to6 = (hex: string) => {
    if (!hex.includes('#')) {
        hex = '#' + hex
    }
    const argb = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex)
    if (argb && argb.length > 0) {
        return '#' + argb[1] + argb[1] + argb[2] + argb[2] + argb[3] + argb[3]
    }
    return hex
}
export const hex6to8 = (val: string) => {
    if (isHex6(val)) {
        val = val[0] + 'FF' + val.slice(1)
    }
    return val
}
// 将八位颜色转换为透明度+颜色
export const decodeColor = (val: string) => {
    if (!val) {
        return {
            alpha: 0,
            color: '#ffffff'
        }
    }
    val = hex6to8(val)
    const alpha = Math.round((parseInt(val.slice(1, 3), 16) / 255) * 100)
    const color = '#' + val?.slice(3)
    return {
        alpha,
        color
    }
}
// 将透明度+颜色合并成八位颜色
export const encodeColor = (param: { alpha: number; color: string }) => {
    let alpha = Math.round((param.alpha / 100) * 255).toString(16)
    if (alpha.length < 2) {
        alpha = '0' + alpha
    }
    return '#' + alpha + param.color.slice(1)
}
// rgb转hex
export const rgbToHex = (rgb: number[]) => {
    return rgb.reduce((a: string, b: number) => {
        let t = b.toString(16)
        if (t.length < 2) {
            t = '0' + t
        }
        return a + t
    }, '#')
}
// hex转rgb
export const hexToRgb = (hex: string) => {
    hex = hex3to6(hex)
    const argb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (argb && argb.length > 0) {
        const r = parseInt(argb[1], 16)
        const g = parseInt(argb[2], 16)
        const b = parseInt(argb[3], 16)
        return [r, g, b]
    }
    return [255, 255, 255]
}
// RGB 转 HSB
export const rgbToHsb = (rgb: number[]) => {
    const r = rgb[0] / 255
    const g = rgb[1] / 255
    const b = rgb[2] / 255
    const v = Math.max(r, g, b),
        n = v - Math.min(r, g, b)
    const h =
        n === 0
            ? 0
            : n && v === r
                ? (g - b) / n
                : v === g
                    ? 2 + (b - r) / n
                    : 4 + (r - g) / n
    return [
        Math.round(60 * (h < 0 ? h + 6 : h)),
        Math.round(v && (n / v) * 100),
        Math.round(v * 100)
    ]
}
// HSB 转 RGB
export const hsbToRgb = (hsb: number[]) => {
    const h = hsb[0]
    const s = hsb[1] / 100
    const b = hsb[2] / 100
    const k = (n: number) => (n + h / 60) % 6
    const f = (n: number) =>
        b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))
    return [
        Math.round(255 * f(5)),
        Math.round(255 * f(3)),
        Math.round(255 * f(1))
    ]
}
// RGB 转 HSL
export const rgbToHsl = (rgb: number[]) => {
    const r = rgb[0] / 255
    const g = rgb[1] / 255
    const b = rgb[2] / 255
    const l = Math.max(r, g, b)
    const s = l - Math.min(r, g, b)
    const h = s
        ? l === r
            ? (g - b) / s
            : l === g
                ? 2 + (b - r) / s
                : 4 + (r - g) / s
        : 0
    return [
        Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h),
        Math.round(
            100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)
        ),
        Math.round((100 * (2 * l - s)) / 2)
    ]
}
// HSL 转 RGB
export const hslToRgb = (hsl: number[]) => {
    const h = hsl[0]
    const s = hsl[1] / 100
    const l = hsl[2] / 100
    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return [
        Math.round(255 * f(0)),
        Math.round(255 * f(8)),
        Math.round(255 * f(4))
    ]
}
// 八位颜色转换为rgba
export const hex8toRgb = (val: string) => {
    if (!val) return
    val = hex6to8(val)
    const alphaStr = val.slice(1, 3)
    const alpha = parseInt(alphaStr, 16) / 255
    const rgb = hexToRgb(val.slice(3))
    return (
        'rgba(' +
        rgb[0] +
        ',' +
        rgb[1] +
        ',' +
        rgb[2] +
        ',' +
        alpha.toFixed(2) +
        ')'
    )
}