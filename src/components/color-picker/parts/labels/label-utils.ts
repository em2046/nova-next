import { Ref } from 'vue';
import DomUtils from '../../../../utils/dom-utils';
import Utils from '../../../../utils/utils';

function intNormalize(value: string, max: number): number {
  value = value.replace(/[^\d]/g, '');
  let number = parseInt(value, 10);

  if (Number.isNaN(number)) {
    number = 0;
  }

  number = Utils.numberLimit(number, 0, max);
  return number;
}

export function getIntValue(
  domRef: Ref<HTMLElement | null>,
  max = Infinity
): number | null {
  if (!domRef.value) {
    return null;
  }

  const input = domRef.value as HTMLInputElement;

  const value = DomUtils.getInputValue(input);
  const number = intNormalize(value, max);
  DomUtils.setInputValue(input, number);

  return number;
}

function alphaNormalize(value: string): number {
  value = value.replace(/[^\d.]/g, '');
  let number = Utils.numberFixed(parseFloat(value));

  if (Number.isNaN(number)) {
    number = 1;
  }

  number = Utils.numberLimit(number, 0, 1);
  return number;
}

export function getAlphaValue(domRef: Ref<HTMLElement | null>): number | null {
  if (!domRef.value) {
    return null;
  }

  const input = domRef.value as HTMLInputElement;
  const value = DomUtils.getInputValue(input);
  const number = alphaNormalize(value);

  if (number.toString() !== value) {
    DomUtils.setInputValue(input, number);
  }

  return number;
}
