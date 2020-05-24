import Color from '../color';
import x11Colors from '../assets/x11-colors';
import hslData from '../assets/css-wg/hsl';
import mdnColors from '../assets/mdn-colors';

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
  const error = max / 100;
  return Math.abs(a - b) <= error;
}

function hexNormalize(hex: string): string {
  return hex.slice(1).toLowerCase();
}

function almostSameHsl(a: string, b: string): boolean {
  const useless = /[^\d.,]/g;
  const [aH, aS, aL, aA = '1'] = a.replace(useless, '').split(',');
  const [bH, bS, bL, bA = '1'] = b.replace(useless, '').split(',');

  const sameH = almostSameValue(parseInt(aH), parseInt(bH), 360);
  const sameS = almostSameValue(parseInt(aS), parseInt(bS), 100);
  const sameL = almostSameValue(parseInt(aL), parseInt(bL), 100);
  const sameA = almostSameValue(parseFloat(aA), parseFloat(bA), 1);

  return sameH && sameS && sameL && sameA;
}

function almostSameRgb(a: string, b: string): boolean {
  const useless = /[^\d.,]/g;
  const [aR, aG, aB, aA = '1'] = a.replace(useless, '').split(',');
  const [bR, bG, bB, bA = '1'] = b.replace(useless, '').split(',');

  const sameR = almostSameValue(parseInt(aR), parseInt(bR), 255);
  const sameG = almostSameValue(parseInt(aG), parseInt(bG), 255);
  const sameB = almostSameValue(parseInt(aB), parseInt(bB), 255);
  const sameA = almostSameValue(parseFloat(aA), parseFloat(bA), 1);

  return sameR && sameG && sameB && sameA;
}

describe('x11-colors', () => {
  test('rgb to hex', () => {
    x11Colors.forEach((x11Color) => {
      const r = percentToValue(parseInt(x11Color.red), 255);
      const g = percentToValue(parseInt(x11Color.green), 255);
      const b = percentToValue(parseInt(x11Color.blue), 255);
      const hex = Color.fromCssRgba(r, g, b).toHex();
      const sameHex = almostSameHex(hex, hexNormalize(x11Color.hex));
      expect(sameHex).toBeTruthy();
    });
  });

  test('hex to rgb', () => {
    x11Colors.forEach((x11Color) => {
      const { r, g, b } = Color.fromHex(x11Color.hex).toCssRgba();
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
      const { h, s, l } = Color.fromHex(x11Color.hex).toCssHsla();
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

  test('hex to hsv', () => {
    x11Colors.forEach((x11Color) => {
      const { h, s, v } = Color.fromHex(x11Color.hex).toHsva();
      const hue = parseInt(x11Color.hue);
      const saturation = parseInt(x11Color.hsvSaturation);
      const value = parseInt(x11Color.value);
      const sameH = almostSameValue(h, hue, 360);
      const sameS = almostSameValue(Math.round(s * 100), saturation, 100);
      const sameV = almostSameValue(Math.round(v * 100), value, 100);
      expect(sameH).toBeTruthy();
      expect(sameS).toBeTruthy();
      expect(sameV).toBeTruthy();
    });
  });
});

describe('css-wg-colors', () => {
  test('hsl', () => {
    function validateHsl(data: string[][], hue: number): void {
      const saturationKeys = data[0].slice(1);
      data.slice(1).forEach((lightList) => {
        const light = lightList[0];
        lightList.slice(1).forEach((color, index) => {
          const originHsl = `hsl(${hue}, ${saturationKeys[index]}, ${light})`;
          const outputHex = Color.fromCssHslString(originHsl).toHex();
          const sameHex = almostSameHex(outputHex, hexNormalize(color));
          expect(sameHex).toBeTruthy();
        });
      });

      data.slice(2, -1).forEach((lightList) => {
        const light = lightList[0];
        lightList.slice(1, -1).forEach((color, index) => {
          const originHsl = `hsl(${hue}, ${saturationKeys[index]}, ${light})`;
          const outputHsl = Color.fromHex(color).toCssHslaString();
          const sameHsl = almostSameHsl(originHsl, outputHsl);
          expect(sameHsl).toBeTruthy();
        });
      });
    }

    hslData.forEach((data, index) => {
      validateHsl(data, 30 * index);
    });
  });
});

describe('mdn-colors', () => {
  test('parse', () => {
    mdnColors.forEach((mdnColor) => {
      if (mdnColor.error) {
        expect(() => {
          Color.parse(mdnColor.css);
        }).toThrowError();
        return;
      }

      if (!mdnColor.rgb) {
        return;
      }

      const color = Color.parse(mdnColor.css);
      const sameRgb = almostSameRgb(color.toCssRgbaString(), mdnColor.rgb);
      expect(sameRgb).toBeTruthy();
    });
  });
});
