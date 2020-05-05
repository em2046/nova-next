interface CssRgba {
  r: number;
  g: number;
  b: number;
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

  toCss(): CssRgba {
    const r = Math.round(this.r * 255);
    const g = Math.round(this.g * 255);
    const b = Math.round(this.b * 255);
    const a = parseFloat(this.a.toFixed(2));

    return { r, g, b, a };
  }

  toHex(): string {
    const { r, g, b, a } = this.toCss();
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
}
