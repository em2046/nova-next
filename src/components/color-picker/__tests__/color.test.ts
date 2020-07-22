import { Color } from '../color';
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

  const aRed = parseInt(a.slice(0, 2), 16);
  const aGreen = parseInt(a.slice(2, 4), 16);
  const aBlue = parseInt(a.slice(4, 6), 16);

  const bRed = parseInt(b.slice(0, 2), 16);
  const bGreen = parseInt(b.slice(2, 4), 16);
  const bBlue = parseInt(b.slice(4, 6), 16);

  return (
    Math.abs(aRed - bRed) <= error &&
    Math.abs(aGreen - bGreen) <= error &&
    Math.abs(aBlue - bBlue) <= error
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
  const [aHue, aSaturation, aLightness, aAlpha = '1'] = a
    .replace(useless, '')
    .split(',');
  const [bHue, bSaturation, bLightness, bAlpha = '1'] = b
    .replace(useless, '')
    .split(',');

  const sameHue = almostSameValue(parseInt(aHue), parseInt(bHue), 360);
  const sameSaturation = almostSameValue(
    parseInt(aSaturation),
    parseInt(bSaturation),
    100
  );
  const sameLightness = almostSameValue(
    parseInt(aLightness),
    parseInt(bLightness),
    100
  );
  const sameAlpha = almostSameValue(parseFloat(aAlpha), parseFloat(bAlpha), 1);

  return sameHue && sameSaturation && sameLightness && sameAlpha;
}

function almostSameRgb(a: string, b: string): boolean {
  const useless = /[^\d.,]/g;
  const [aRed, aGreen, aBlue, aAlpha = '1'] = a.replace(useless, '').split(',');
  const [bRed, bGreen, bBlue, bAlpha = '1'] = b.replace(useless, '').split(',');

  const sameRed = almostSameValue(parseInt(aRed), parseInt(bRed), 255);
  const sameGreen = almostSameValue(parseInt(aGreen), parseInt(bGreen), 255);
  const sameBlue = almostSameValue(parseInt(aBlue), parseInt(bBlue), 255);
  const sameAlpha = almostSameValue(parseFloat(aAlpha), parseFloat(bAlpha), 1);

  return sameRed && sameGreen && sameBlue && sameAlpha;
}

describe('x11-colors', () => {
  test('rgb to hex', () => {
    x11Colors.forEach((x11Color) => {
      const red = percentToValue(parseInt(x11Color.red), 255);
      const green = percentToValue(parseInt(x11Color.green), 255);
      const blue = percentToValue(parseInt(x11Color.blue), 255);
      const hex = Color.fromCssRgba(red, green, blue).toHex();
      const sameHex = almostSameHex(hex, hexNormalize(x11Color.hex));
      expect(sameHex).toBeTruthy();
    });
  });

  test('hex to rgb', () => {
    x11Colors.forEach((x11Color) => {
      const { red, green, blue } = Color.fromHex(x11Color.hex).toCssRgba();
      expect(valueToPercent(red, 255).toString()).toEqual(x11Color.red);
      expect(valueToPercent(green, 255).toString()).toEqual(x11Color.green);
      expect(valueToPercent(blue, 255).toString()).toEqual(x11Color.blue);
    });
  });

  test('hsl to hex', () => {
    x11Colors.forEach((x11Color) => {
      const hue = parseInt(x11Color.hue);
      const saturation = parseInt(x11Color.hslSaturation);
      const lightness = parseInt(x11Color.light);
      const hex = Color.fromCssHsla(hue, saturation, lightness).toHex();
      const sameHex = almostSameHex(hex, hexNormalize(x11Color.hex));
      expect(sameHex).toBeTruthy();
    });
  });

  test('hex to hsl', () => {
    x11Colors.forEach((x11Color) => {
      const { hue, saturation, lightness } = Color.fromHex(
        x11Color.hex
      ).toCssHsla();
      const sameH = almostSameValue(hue, parseInt(x11Color.hue), 360);
      const sameS = almostSameValue(
        saturation,
        parseInt(x11Color.hslSaturation),
        100
      );
      const sameL = almostSameValue(lightness, parseInt(x11Color.light), 100);
      expect(sameH).toBeTruthy();
      expect(sameS).toBeTruthy();
      expect(sameL).toBeTruthy();
    });
  });

  test('hsv to hex', () => {
    x11Colors.forEach((x11Color) => {
      const hue = parseInt(x11Color.hue);
      const saturation = parseInt(x11Color.hsvSaturation);
      const value = parseInt(x11Color.value);
      const hex = Color.fromCssLikeHsva(hue, saturation, value).toHex();
      const sameHex = almostSameHex(hex, hexNormalize(x11Color.hex));
      expect(sameHex).toBeTruthy();
    });
  });

  test('hex to hsv', () => {
    x11Colors.forEach((x11Color) => {
      const { hue, saturation, value } = Color.fromHex(x11Color.hex).toHsva();
      const originHue = parseInt(x11Color.hue);
      const originSaturation = parseInt(x11Color.hsvSaturation);
      const originValue = parseInt(x11Color.value);
      const sameHue = almostSameValue(hue, originHue, 360);
      const sameSaturation = almostSameValue(
        Math.round(saturation * 100),
        originSaturation,
        100
      );
      const sameValue = almostSameValue(
        Math.round(value * 100),
        originValue,
        100
      );
      expect(sameHue).toBeTruthy();
      expect(sameSaturation).toBeTruthy();
      expect(sameValue).toBeTruthy();
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
