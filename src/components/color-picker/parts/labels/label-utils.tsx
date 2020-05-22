import Utils from '../../../../utils/utils';
import NumberInput from './NumberInput';
import { vueJsxCompat } from '../../../../vue-jsx-compat';

export const alphaRule = /^((0)|(1)|(\d+(\.\d{1,2})?))$/;

export interface ChannelParams {
  label: string;
  value: number;
  onInput: (e: Event) => void;
  onBlur: (e: Event) => void;
  onUpdate: (params: UpdateParams) => void;
}

export interface UpdateParams {
  target: HTMLInputElement;
  value: string;
}

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

export function createChannel(options: ChannelParams): unknown {
  const { label, value, onInput, onUpdate, onBlur } = options;

  return (
    <label class="nova-color-picker-label">
      <div class="nova-color-picker-label-text">{label}</div>
      <div class="nova-color-picker-number">
        <NumberInput
          value={value.toString()}
          onInput={onInput}
          onUpdate={onUpdate}
          onBlur={onBlur}
        />
      </div>
    </label>
  );
}
