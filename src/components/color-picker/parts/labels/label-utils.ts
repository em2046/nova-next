import Utils from '../../../../utils/utils';

export function intNormalize(value: number, max: number): number {
  const text = value.toString().replace(/[^\d]/g, '');
  let number = parseInt(text, 10);

  if (Number.isNaN(number)) {
    number = 0;
  }

  number = Utils.numberLimit(number, 0, max);
  return number;
}

export function alphaNormalize(value: number): number {
  const text = value.toString().replace(/[^\d.]/g, '');
  let number = Utils.numberFixed(parseFloat(text));

  if (Number.isNaN(number)) {
    number = 1;
  }

  number = Utils.numberLimit(number, 0, 1);
  return number;
}
