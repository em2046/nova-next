import x11Colors from '../assets/x11-colors';
import Color from '../color';

function valueToPercent(value: number, max: number): number {
  return Math.round((value / max) * 100);
}

function percentToValue(percent: number, max: number): number {
  return Math.round((percent / 100) * max);
}

function almostSameHex(a: string, b: string): boolean {
  const error = Math.ceil(255 / 100);

  const aR = parseInt(a.slice(0, 2), 16);
  const aG = parseInt(a.slice(2, 4), 16);
  const aB = parseInt(a.slice(4, 6), 16);

  const bR = parseInt(b.slice(0, 2), 16);
  const bG = parseInt(b.slice(2, 4), 16);
  const bB = parseInt(b.slice(4, 6), 16);

  return (
    Math.abs(aR - bR) <= error &&
    Math.abs(aG - bG) <= error &&
    Math.abs(aB - bB) <= error
  );
}

function almostSameValue(a: number, b: number, max: number): boolean {
  const error = Math.ceil(max / 100);
  return Math.abs(a - b) <= error;
}

function hexNormalize(hex: string): string {
  return hex.slice(1).toLowerCase();
}

describe('color', () => {
  test('rgb to hex', () => {
    x11Colors.forEach((x11Color) => {
      const r = percentToValue(parseInt(x11Color.red), 255);
      const g = percentToValue(parseInt(x11Color.green), 255);
      const b = percentToValue(parseInt(x11Color.blue), 255);
      const hex = Color.fromCss(r, g, b).toHex();
      const sameHex = almostSameHex(hex, hexNormalize(x11Color.hex));
      expect(sameHex).toBeTruthy();
    });
  });

  test('hex to rgb', () => {
    x11Colors.forEach((x11Color) => {
      const { r, g, b } = Color.fromHex(x11Color.hex).toCss();
      expect(valueToPercent(r, 255).toString()).toEqual(x11Color.red);
      expect(valueToPercent(g, 255).toString()).toEqual(x11Color.green);
      expect(valueToPercent(b, 255).toString()).toEqual(x11Color.blue);
    });
  });

  test('hsl to hex', () => {
    x11Colors.forEach((x11Color) => {
      const h = parseInt(x11Color.hue);
      const s = parseInt(x11Color.hslSaturation);
      const l = parseInt(x11Color.light);
      const hex = Color.fromCssHsla(h, s, l).toHex();
      const sameHex = almostSameHex(hex, hexNormalize(x11Color.hex));
      expect(sameHex).toBeTruthy();
    });
  });

  test('hex to hsl', () => {
    x11Colors.forEach((x11Color) => {
      const { h, s, l } = Color.fromHex(hexNormalize(x11Color.hex)).toCssHsla();
      const sameH = almostSameValue(h, parseInt(x11Color.hue), 360);
      const sameS = almostSameValue(s, parseInt(x11Color.hslSaturation), 100);
      const sameL = almostSameValue(l, parseInt(x11Color.light), 100);
      expect(sameH).toBeTruthy();
      expect(sameS).toBeTruthy();
      expect(sameL).toBeTruthy();
    });
  });

  test('hsv to hex', () => {
    x11Colors.forEach((x11Color) => {
      const h = parseInt(x11Color.hue);
      const s = parseInt(x11Color.hsvSaturation);
      const v = parseInt(x11Color.value);
      const hex = Color.fromCssLikeHsva(h, s, v).toHex();
      const sameHex = almostSameHex(hex, hexNormalize(x11Color.hex));
      expect(sameHex).toBeTruthy();
    });
  });
});
