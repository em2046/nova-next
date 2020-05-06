interface CssRgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface CssLikeHsva {
  h: number;
  s: number;
  v: number;
  a: number;
}

export default class Rgba {
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
   * from CSS RGBA
   * @param r [0, 255]
   * @param g [0, 255]
   * @param b [0, 255]
   * @param a [0, 1]
   */
  static fromCss(r = 0, g = 0, b = 0, a = 1): Rgba {
    return new Rgba(r / 255, g / 255, b / 255, a);
  }

  /**
   * from HSVA
   * @param h [0, 360)
   * @param s [0, 1]
   * @param v [0, 1]
   * @param a [0, 1]
   */
  static fromHsva(h = 0, s = 0, v = 0, a = 1): Rgba {
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

    return new Rgba(r, g, b, a);
  }

  /**
   * from CSS like HSVA
   * @param h [0, 360)
   * @param s [0, 100]
   * @param v [0, 100]
   * @param a [0, 1]
   */
  static fromCssLikeHsva(h = 0, s = 0, v = 0, a = 1): Rgba {
    return Rgba.fromHsva(h, s / 100, v / 100, a);
  }

  static fromHex(hashHex: string): Rgba {
    let hex = hashHex.replace('#', '');

    if (hex.length === 3) {
      hex = hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
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

  toCss(): CssRgba {
    const r = Math.round(this.r * 255);
    const g = Math.round(this.g * 255);
    const b = Math.round(this.b * 255);
    const a = parseFloat(this.a.toFixed(2));

    return { r, g, b, a };
  }

  toHex(): string {
    const { r, g, b } = this.toCss();
    const a = this.a;

    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');
    const hexA = Math.round(a * 255)
      .toString(16)
      .padStart(2, '0');

    if (hexA === 'ff') {
      return `${hexR}${hexG}${hexB}`;
    }

    return `${hexR}${hexG}${hexB}${hexA}`;
  }

  toHsva(): CssLikeHsva {
    const r = this.r;
    const g = this.g;
    const b = this.b;
    const a = this.a;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

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
}
