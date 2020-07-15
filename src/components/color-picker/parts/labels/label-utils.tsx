import { vueJsxCompat } from '../../../../vue-jsx-compat';
import Utils from '../../../../utils/utils';
import { NumberInput } from './NumberInput';

export const alphaRule = /^((0)|(1)|(\d+(\.\d{1,2})?))$/;

interface Params {
  value: number;
  title: string;
  onInput: (e: Event) => void;
  onBlur: (e: Event) => void;
  onUpdate: (params: UpdateParams) => void;
}

export interface ChannelParams extends Params {
  label: string;
}

export interface AlphaParams extends Params {
  alpha: boolean;
}

export interface UpdateParams {
  target: HTMLInputElement;
  value: string;
}

export function intNormalize(value: number, max: number): number {
  const text = value.toString().replace(/[^\d]/g, '');
  let intNumber = parseInt(text, 10);

  if (Number.isNaN(intNumber)) {
    intNumber = 0;
  }

  intNumber = Utils.numberLimit(intNumber, 0, max);
  return intNumber;
}

export function alphaNormalize(value: number): number {
  const text = value.toString().replace(/[^\d.]/g, '');
  let floatNumber = Utils.numberFixed(parseFloat(text));

  if (Number.isNaN(floatNumber)) {
    floatNumber = 1;
  }

  floatNumber = Utils.numberLimit(floatNumber, 0, 1);
  return floatNumber;
}

export function createChannel(params: ChannelParams): JSX.Element {
  const { label, title, value, onInput, onUpdate, onBlur } = params;

  return (
    <label class="nova-color-picker-label">
      <div class="nova-color-picker-label-text" title={title}>
        {label}
      </div>

      <NumberInput
        value={value.toString()}
        onInput={onInput}
        onUpdate={onUpdate}
        onBlur={onBlur}
      />
    </label>
  );
}

export function createAlpha(params: AlphaParams): JSX.Element | null {
  const { alpha, title, value, onInput, onUpdate, onBlur } = params;

  if (!alpha) {
    return null;
  }

  return createChannel({
    label: 'A',
    title,
    value: value,
    onInput: onInput,
    onUpdate: onUpdate,
    onBlur: onBlur,
  });
}
