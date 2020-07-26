import { numberFixed, numberLimit } from '../../utils/utils';

const colorFormatError = 'Color format error';

/**
 * @property r [0, 255]
 * @property g [0, 255]
 * @property b [0, 255]
 * @property a [0, 1]
 */
interface CssRgba {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

/**
 * @property h [0, 360]
 * @property s [0, 1]
 * @property v [0, 1]
 * @property a [0, 1]
 */
interface Hsva {
  hue: number;
  saturation: number;
  value: number;
  alpha: number;
}

/**
 * @property h [0, 360]
 * @property s [0, 1]
 * @property l [0, 1]
 * @property a [0, 1]
 */
interface Hsla {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
}

/**
 * @property h [0, 360]
 * @property s [0, 100]
 * @property l [0, 100]
 * @property a [0, 1]
 */
interface CssHsla {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
}

export type ColorFormat = 'hsl' | 'rgb' | 'hex';

export const hexRule = /^#?((([\dA-Fa-f]{6})([\dA-Fa-f]{2})?)|([\dA-Fa-f]{3}))$/;
export const rgbRule = /^rgb\((\d{1,3}%?,){2}\d{1,3}%?\)$/;
export const rgbaRule = /^rgba\((\d{1,3}%?,){2}\d{1,3}%?,(\d+(\.\d{1,2})?)\)$/;
export const hslRule = /^hsl\(\d{1,3}(,\d{1,3}%){2}\)$/;
export const hslaRule = /^hsla\(\d{1,3}(,\d{1,3}%){2},(\d+(\.\d{1,2})?)\)$/;

function hexSimplify(hex: string): string {
  if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
    return `${hex[0]}${hex[2]}${hex[4]}`;
  }
  return hex;
}

function rgbToHue(
  max: number,
  min: number,
  red: number,
  green: number,
  blue: number
): number {
  let hue = 0;
  if (max === min) {
    hue = 0;
  } else if (max === red && green >= blue) {
    hue = 60 * ((green - blue) / (max - min));
  } else if (max === red && green < blue) {
    hue = 60 * ((green - blue) / (max - min)) + 360;
  } else if (max === green) {
    hue = 60 * ((blue - red) / (max - min)) + 120;
  } else if (max === blue) {
    hue = 60 * ((red - green) / (max - min)) + 240;
  }
  return Math.round(hue);
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

function cssColorNormalize(text: string): string {
  return text.replace(/[^\drgb,hsl%a.()]/g, '');
}

function sameValue(a: number, b: number): boolean {
  if (a === b) {
    return true;
  }

  return Math.abs(a - b) < Number.EPSILON;
}

/**
 * From CSS RGBA
 * @param red [0, 255]
 * @param green [0, 255]
 * @param blue [0, 255]
 * @param alpha [0, 1]
 */
export function fromCssRgba(red = 0, green = 0, blue = 0, alpha = 1): Color {
  return new Color(red / 255, green / 255, blue / 255, alpha);
}

export function fromCssRgbString(text: string): Color {
  text = cssColorNormalize(text);

  if (!rgbRule.test(text)) {
    throw new Error(colorFormatError);
  }

  text = text.slice(4, -1);
  const [red, green, blue] = getRgbFromText(text);

  return new Color(red, green, blue);
}

export function fromCssRgbaString(text: string): Color {
  text = cssColorNormalize(text);

  if (!rgbaRule.test(text)) {
    throw new Error(colorFormatError);
  }

  text = text.slice(5, -1);
  const [textRed, textGreen, textBlue, textAlpha] = text.split(',');
  const [red, green, blue] = getRgbFromText(
    `${textRed},${textGreen},${textBlue}`
  );
  const alpha = parseFloat(textAlpha);

  return new Color(red, green, blue, alpha);
}

export function fromCssHslString(text: string): Color {
  text = cssColorNormalize(text);

  if (!hslRule.test(text)) {
    throw new Error(colorFormatError);
  }

  text = text.slice(4, -1);
  const [hue, saturation, lightness] = getHslFromText(text);

  return fromCssHsla(hue, saturation, lightness);
}

export function fromCssHslaString(text: string): Color {
  text = cssColorNormalize(text);

  if (!hslaRule.test(text)) {
    throw new Error(colorFormatError);
  }

  text = text.slice(5, -1);
  const [textHue, textSaturation, textLightness, textAlpha] = text.split(',');

  const [hue, saturation, lightness] = getHslFromText(
    `${textHue},${textSaturation},${textLightness}`
  );
  const alpha = parseFloat(textAlpha);

  return fromCssHsla(hue, saturation, lightness, alpha);
}

/**
 * From HSVA
 * @param hue [0, 360]
 * @param saturation [0, 1]
 * @param value [0, 1]
 * @param alpha [0, 1]
 */
export function fromHsva(hue = 0, saturation = 0, value = 0, alpha = 1): Color {
  const hI = Math.floor(hue / 60) % 6;
  const f = hue / 60 - hI;
  const p = value * (1 - saturation);
  const q = value * (1 - f * saturation);
  const t = value * (1 - (1 - f) * saturation);

  let red;
  let green;
  let blue;

  switch (hI) {
    case 0:
      [red, green, blue] = [value, t, p];
      break;
    case 1:
      [red, green, blue] = [q, value, p];
      break;
    case 2:
      [red, green, blue] = [p, value, t];
      break;
    case 3:
      [red, green, blue] = [p, q, value];
      break;
    case 4:
      [red, green, blue] = [t, p, value];
      break;
    case 5:
      [red, green, blue] = [value, p, q];
      break;
  }

  return new Color(red, green, blue, alpha);
}

/**
 * From CSS like HSVA
 * @param hue [0, 360]
 * @param saturation [0, 100]
 * @param value [0, 100]
 * @param alpha [0, 1]
 */
export function fromCssLikeHsva(
  hue = 0,
  saturation = 0,
  value = 0,
  alpha = 1
): Color {
  return fromHsva(hue, saturation / 100, value / 100, alpha);
}

export function fromHsla(
  hue = 0,
  saturation = 0,
  lightness = 0,
  alpha = 1
): Color {
  let q;
  if (lightness < 1 / 2) {
    q = lightness * (1 + saturation);
  } else {
    q = lightness + saturation - lightness * saturation;
  }

  const p = 2 * lightness - q;

  const hK = hue / 360;

  let tRed = hK + 1 / 3;
  let tGreen = hK;
  let tBlue = hK - 1 / 3;

  tRed = HslToRgbChannelLimit(tRed);
  tGreen = HslToRgbChannelLimit(tGreen);
  tBlue = HslToRgbChannelLimit(tBlue);

  const red = HslToRgbChannel(tRed, q, p);
  const green = HslToRgbChannel(tGreen, q, p);
  const blue = HslToRgbChannel(tBlue, q, p);

  return new Color(red, green, blue, alpha);
}

export function fromCssHsla(
  hue = 0,
  saturation = 0,
  lightness = 0,
  alpha = 1
): Color {
  return fromHsla(hue, saturation / 100, lightness / 100, alpha);
}

export function hexNormalize(value: string): string {
  let hex = value.replace(/[^\dA-Fa-f]/g, '');

  if (hex.length > 8) {
    hex = hex.substr(0, 8);
  }

  if (hex.length === 7) {
    hex = hex.substr(0, 6);
  }

  return hex;
}

export function fromHex(hashHex: string): Color {
  let hex = hexNormalize(hashHex);

  if (!hexRule.test(hex)) {
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

  return fromCssRgba(cssRed, cssGreen, cssBlue, cssAlpha);
}

export function parse(text?: string): Color {
  if (!text) {
    return new Color();
  }

  // Hash hex
  if (text[0] === '#') {
    return fromHex(text);
  }

  text = cssColorNormalize(text);

  // RGB
  if (text.indexOf('rgb(') === 0) {
    return fromCssRgbString(text);
  }

  // RGBA
  if (text.indexOf('rgba(') === 0) {
    return fromCssRgbaString(text);
  }

  // HSL
  if (text.indexOf('hsl(') === 0) {
    return fromCssHslString(text);
  }

  // HSLA
  if (text.indexOf('hsla(') === 0) {
    return fromCssHslaString(text);
  }

  return new Color();
}

export function sameColor(a: Color, b: Color): boolean {
  return (
    sameValue(a.red, b.red) &&
    sameValue(a.green, b.green) &&
    sameValue(a.blue, b.blue) &&
    sameValue(a.alpha, b.alpha)
  );
}

/**
 * Immutable color
 * @property r [0, 1]
 * @property g [0, 1]
 * @property b [0, 1]
 * @property a [0, 1]
 */
export class Color {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
  readonly alpha: number;

  /**
   * Create
   * @param red [0, 1]
   * @param green [0, 1]
   * @param blue [0, 1]
   * @param alpha [0, 1]
   */
  constructor(red = 0, green = 0, blue = 0, alpha = 1) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
  }
}

export function toCssRgba(color: Color): CssRgba {
  const red = Math.round(color.red * 255);
  const green = Math.round(color.green * 255);
  const blue = Math.round(color.blue * 255);
  const alpha = numberFixed(color.alpha);

  return { red, green, blue, alpha };
}

/**
 * Return string like rgba(255, 255, 255, 0.5)
 * If alpha is 1, then return string like rgb(255, 255, 255)
 */
export function toCssRgbaString(color: Color): string {
  const { red, green, blue, alpha } = toCssRgba(color);

  if (alpha === 1) {
    return `rgb(${red}, ${green}, ${blue})`;
  }

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

/**
 * Return hex like ff9900
 * @param color
 * @param short Return hex like f90
 */
export function toHex(color: Color, short = false): string {
  const { red, green, blue } = toCssRgba(color);
  const a = color.alpha;

  const hexR = red.toString(16).padStart(2, '0');
  const hexG = green.toString(16).padStart(2, '0');
  const hexB = blue.toString(16).padStart(2, '0');
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
 * @param color
 * @param short Return CSS like #f90
 */
export function toCssHexString(color: Color, short = false): string {
  return `#${toHex(color, short)}`;
}

export function toHsva(color: Color): Hsva {
  const { red, green, blue, alpha } = color;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);

  const hue = rgbToHue(max, min, red, green, blue);

  let saturation;
  if (max === 0) {
    saturation = 0;
  } else {
    saturation = 1 - min / max;
  }

  const value = max;

  return {
    hue,
    saturation,
    value,
    alpha,
  };
}

export function toHsla(color: Color): Hsla {
  const { red, green, blue, alpha } = color;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);

  const lightness = (1 / 2) * (max + min);

  let saturation = 0;
  if (lightness === 0 || max === min) {
    saturation = 0;
  } else if (0 < lightness && lightness <= 1 / 2) {
    saturation = (max - min) / (2 * lightness);
  } else if (lightness > 1 / 2) {
    saturation = (max - min) / (2 - 2 * lightness);
  }
  saturation = numberLimit(saturation, 0, 1);

  const hue = rgbToHue(max, min, red, green, blue);

  return {
    hue,
    saturation,
    lightness,
    alpha,
  };
}

export function toCssHsla(color: Color): CssHsla {
  const hsla = toHsla(color);

  return {
    hue: hsla.hue,
    saturation: Math.round(hsla.saturation * 100),
    lightness: Math.round(hsla.lightness * 100),
    alpha: numberFixed(hsla.alpha),
  };
}

export function toCssHslaString(color: Color): string {
  const { hue, saturation, lightness, alpha } = toCssHsla(color);

  if (alpha === 1) {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}

export function colorToString(
  color: Color,
  format: ColorFormat = 'hex'
): string {
  switch (format) {
    case 'rgb':
      return toCssRgbaString(color);
    case 'hsl':
      return toCssHslaString(color);
    case 'hex':
    default:
      return toCssHexString(color);
  }
}
