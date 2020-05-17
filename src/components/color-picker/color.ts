import Utils from '../../utils/utils';

const colorFormatError = 'Color format error';

/**
 * @property r [0, 255]
 * @property g [0, 255]
 * @property b [0, 255]
 * @property a [0, 1]
 */
interface CssRgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * @property h [0, 360]
 * @property s [0, 1]
 * @property v [0, 1]
 * @property a [0, 1]
 */
interface Hsva {
  h: number;
  s: number;
  v: number;
  a: number;
}

/**
 * @property h [0, 360]
 * @property s [0, 1]
 * @property l [0, 1]
 * @property a [0, 1]
 */
interface Hsla {
  h: number;
  s: number;
  l: number;
  a: number;
}

/**
 * @property h [0, 360]
 * @property s [0, 100]
 * @property l [0, 100]
 * @property a [0, 1]
 */
interface CssHsla {
  h: number;
  s: number;
  l: number;
  a: number;
}

function hexSimplify(hex: string): string {
  if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
    return `${hex[0]}${hex[2]}${hex[4]}`;
  }
  return hex;
}

function rgbToHue(
  max: number,
  min: number,
  r: number,
  g: number,
  b: number
): number {
  let h = 0;
  if (max === min) {
    h = 0;
  } else if (max === r && g >= b) {
    h = 60 * ((g - b) / (max - min));
  } else if (max === r && g < b) {
    h = 60 * ((g - b) / (max - min)) + 360;
  } else if (max === g) {
    h = 60 * ((b - r) / (max - min)) + 120;
  } else if (max === b) {
    h = 60 * ((r - g) / (max - min)) + 240;
  }
  return Math.round(h);
}

function HslToRgbChannelLimit(tC: number): number {
  if (tC < 0) {
    tC = tC + 1;
  } else if (tC > 1) {
    tC = tC - 1;
  }
  return tC;
}

function HslToRgbChannel(tC: number, q: number, p: number): number {
  let c;
  if (tC < 1 / 6) {
    c = p + (q - p) * 6 * tC;
  } else if (1 / 6 <= tC && tC < 1 / 2) {
    c = q;
  } else if (1 / 2 <= tC && tC < 2 / 3) {
    c = p + (q - p) * 6 * (2 / 3 - tC);
  } else {
    c = p;
  }
  return c;
}

function getRgbFromText(text: string): number[] {
  const hasPercent = text.indexOf('%') !== -1;
  const percentSize = text.replace(/[^%]/g, '').length;
  if (hasPercent && percentSize !== 3) {
    throw new Error(colorFormatError);
  }

  return text.split(',').map((channel) => {
    if (hasPercent) {
      return parseInt(channel) / 100;
    } else {
      return parseInt(channel) / 255;
    }
  });
}

function getHslFromText(text: string): number[] {
  return text.split(',').map((channel) => {
    return parseInt(channel);
  });
}

/**
 * @property r [0, 1]
 * @property g [0, 1]
 * @property b [0, 1]
 * @property a [0, 1]
 */
export default class Color {
  static hexRule = /^#?((([\dA-Fa-f]{6})([\dA-Fa-f]{2})?)|([\dA-Fa-f]{3}))$/;
  static rgbRule = /^rgb\((\d{1,3}%?,){2}\d{1,3}%?\)$/;
  static rgbaRule = /^rgba\((\d{1,3}%?,){2}\d{1,3}%?,(\d+(\.\d{1,2})?)\)$/;
  static hslRule = /^hsl\(\d{1,3}(,\d{1,3}%){2}\)$/;
  static hslaRule = /^hsla\(\d{1,3}(,\d{1,3}%){2},(\d+(\.\d{1,2})?)\)$/;

  r: number;
  g: number;
  b: number;
  a: number;

  /**
   * Create
   * @param r [0, 1]
   * @param g [0, 1]
   * @param b [0, 1]
   * @param a [0, 1]
   */
  constructor(r = 0, g = 0, b = 0, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * From CSS RGBA
   * @param r [0, 255]
   * @param g [0, 255]
   * @param b [0, 255]
   * @param a [0, 1]
   */
  static fromCss(r = 0, g = 0, b = 0, a = 1): Color {
    return new Color(r / 255, g / 255, b / 255, a);
  }

  static fromCssRgbString(text: string): Color {
    if (!Color.rgbRule.test(text)) {
      throw new Error(colorFormatError);
    }

    text = text.slice(4, -1);
    const [r, g, b] = getRgbFromText(text);

    return new Color(r, g, b);
  }

  static fromCssRgbaString(text: string): Color {
    if (!Color.rgbaRule.test(text)) {
      throw new Error(colorFormatError);
    }

    text = text.slice(5, -1);
    const [textR, textG, textB, textA] = text.split(',');
    const [r, g, b] = getRgbFromText(`${textR},${textG},${textB}`);
    const a = parseFloat(textA);

    return new Color(r, g, b, a);
  }

  static fromCssHslString(text: string): Color {
    if (!Color.hslRule.test(text)) {
      throw new Error(colorFormatError);
    }

    text = text.slice(4, -1);
    const [h, s, l] = getHslFromText(text);

    return Color.fromCssHsla(h, s, l);
  }

  static fromCssHslaString(text: string): Color {
    if (!Color.hslaRule.test(text)) {
      throw new Error(colorFormatError);
    }

    text = text.slice(5, -1);
    const [textH, textS, textL, textA] = text.split(',');

    const [h, s, l] = getHslFromText(`${textH},${textS},${textL}`);
    const a = parseFloat(textA);

    return Color.fromCssHsla(h, s, l, a);
  }

  /**
   * From HSVA
   * @param h [0, 360]
   * @param s [0, 1]
   * @param v [0, 1]
   * @param a [0, 1]
   */
  static fromHsva(h = 0, s = 0, v = 0, a = 1): Color {
    const hI = Math.floor(h / 60) % 6;
    const f = h / 60 - hI;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r;
    let g;
    let b;

    switch (hI) {
      case 0:
        [r, g, b] = [v, t, p];
        break;
      case 1:
        [r, g, b] = [q, v, p];
        break;
      case 2:
        [r, g, b] = [p, v, t];
        break;
      case 3:
        [r, g, b] = [p, q, v];
        break;
      case 4:
        [r, g, b] = [t, p, v];
        break;
      case 5:
        [r, g, b] = [v, p, q];
        break;
    }

    return new Color(r, g, b, a);
  }

  /**
   * From CSS like HSVA
   * @param h [0, 360]
   * @param s [0, 100]
   * @param v [0, 100]
   * @param a [0, 1]
   */
  static fromCssLikeHsva(h = 0, s = 0, v = 0, a = 1): Color {
    return Color.fromHsva(h, s / 100, v / 100, a);
  }

  static fromHsla(h = 0, s = 0, l = 0, a = 1): Color {
    let q;
    if (l < 1 / 2) {
      q = l * (1 + s);
    } else {
      q = l + s - l * s;
    }

    const p = 2 * l - q;

    const hK = h / 360;

    let tR = hK + 1 / 3;
    let tG = hK;
    let tB = hK - 1 / 3;

    tR = HslToRgbChannelLimit(tR);
    tG = HslToRgbChannelLimit(tG);
    tB = HslToRgbChannelLimit(tB);

    const r = HslToRgbChannel(tR, q, p);
    const g = HslToRgbChannel(tG, q, p);
    const b = HslToRgbChannel(tB, q, p);

    return new Color(r, g, b, a);
  }

  static fromCssHsla(h = 0, s = 0, l = 0, a = 1): Color {
    return Color.fromHsla(h, s / 100, l / 100, a);
  }

  static hexNormalize(value: string): string {
    let hex = value.replace(/[^\dA-Fa-f]/g, '');

    if (hex.length > 8) {
      hex = hex.substr(0, 8);
    }

    if (hex.length === 7) {
      hex = hex.substr(0, 6);
    }

    return hex;
  }

  static fromHex(hashHex: string): Color {
    let hex = Color.hexNormalize(hashHex);

    if (!Color.hexRule.test(hex)) {
      throw new Error(colorFormatError);
    }

    if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const hexRed = hex.substr(0, 2);
    const hexGreen = hex.substr(2, 2);
    const hexBlue = hex.substr(4, 2);

    const cssRed = parseInt(hexRed, 16);
    const cssGreen = parseInt(hexGreen, 16);
    const cssBlue = parseInt(hexBlue, 16);

    let cssAlpha = 1;
    if (hex.length === 8) {
      const hexAlpha = hex.substr(6, 2);
      cssAlpha = parseInt(hexAlpha, 16) / 255;
    }

    return this.fromCss(cssRed, cssGreen, cssBlue, cssAlpha);
  }

  static parse(text: string): Color {
    // Hash hex
    if (text[0] === '#') {
      return Color.fromHex(text);
    }

    text = text.replace(/[^\drgb,hsl%a.()]/g, '');

    // RGB
    if (text.indexOf('rgb(') === 0) {
      return Color.fromCssRgbString(text);
    }

    // RGBA
    if (text.indexOf('rgba(') === 0) {
      return Color.fromCssRgbaString(text);
    }

    // HSL
    if (text.indexOf('hsl(') === 0) {
      return Color.fromCssHslString(text);
    }

    // HSLA
    if (text.indexOf('hsla(') === 0) {
      return Color.fromCssHslaString(text);
    }

    return new Color();
  }

  toCss(): CssRgba {
    const r = Math.round(this.r * 255);
    const g = Math.round(this.g * 255);
    const b = Math.round(this.b * 255);
    const a = Utils.numberFixed(this.a);

    return { r, g, b, a };
  }

  /**
   * Return string like rgba(255, 255, 255, 0.5)
   * If alpha is 1, then return string like rgb(255, 255, 255)
   */
  toCssRgbaString(): string {
    const { r, g, b, a } = this.toCss();

    if (a === 1) {
      return `rgb(${r}, ${g}, ${b})`;
    }

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  /**
   * Return hex like ff9900
   * @param short Return hex like f90
   */
  toHex(short = false): string {
    const { r, g, b } = this.toCss();
    const a = this.a;

    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');
    const hexA = Math.round(a * 255)
      .toString(16)
      .padStart(2, '0');

    if (hexA === 'ff') {
      const hex = `${hexR}${hexG}${hexB}`;
      if (short) {
        return hexSimplify(hex);
      }
      return hex;
    }

    return `${hexR}${hexG}${hexB}${hexA}`;
  }

  /**
   * Return CSS like #ff9900
   * @param short Return CSS like #f90
   */
  toCssHexString(short = false): string {
    return `#${this.toHex(short)}`;
  }

  toHsva(): Hsva {
    const r = this.r;
    const g = this.g;
    const b = this.b;
    const a = this.a;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    const h = rgbToHue(max, min, r, g, b);

    let s;
    if (max === 0) {
      s = 0;
    } else {
      s = 1 - min / max;
    }

    const v = max;

    return {
      h,
      s,
      v,
      a,
    };
  }

  toHsla(): Hsla {
    const r = this.r;
    const g = this.g;
    const b = this.b;
    const a = this.a;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    const l = (1 / 2) * (max + min);

    let s = 0;
    if (l === 0 || max === min) {
      s = 0;
    } else if (0 < l && l <= 1 / 2) {
      s = (max - min) / (2 * l);
    } else if (l > 1 / 2) {
      s = (max - min) / (2 - 2 * l);
    }

    const h = rgbToHue(max, min, r, g, b);

    return {
      h,
      s,
      l,
      a,
    };
  }

  toCssHsla(): CssHsla {
    const hsla = this.toHsla();

    return {
      h: hsla.h,
      s: Math.round(hsla.s * 100),
      l: Math.round(hsla.l * 100),
      a: Utils.numberFixed(hsla.a),
    };
  }

  toCssHslaString(): string {
    const { h, s, l, a } = this.toCssHsla();

    if (a === 1) {
      return `hsl(${h}, ${s}%, ${l}%)`;
    }

    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  }

  toString(format = 'hex'): string {
    switch (format) {
      case 'rgb':
        return this.toCssRgbaString();
      case 'hsl':
        return this.toCssHslaString();
      case 'hex':
      default:
        return this.toCssHexString();
    }
  }
}
