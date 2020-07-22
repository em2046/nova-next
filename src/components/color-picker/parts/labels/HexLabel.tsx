import { reactive, ref, Ref, SetupContext, VNodeProps } from 'vue';
import { vueJsxCompat } from '../../../../vue-jsx-compat';
import {
  Direction,
  down,
  FunctionKeys,
  getInputValue,
  setInputValue,
  up,
} from '../../../../utils/dom';
import { Color } from '../../color';
import { numberLimit } from '../../../../utils/utils';

interface TuningParams {
  red: number;
  green: number;
  blue: number;
  max: number;
  length: number;
}

interface HexLabelProps {
  color: Color;
  onColorInput?: (color: Color) => void;
  onColorBlur?: (color: Color) => void;
}

function calcTuned(
  functionKeys: FunctionKeys,
  originNumber: number,
  direction: Direction,
  tuningParams: TuningParams
): string {
  const { alt, shift, ctrl } = functionKeys;

  let step = 0;
  if (alt) {
    step += tuningParams.blue;
  }
  if (shift) {
    step += tuningParams.green;
  }
  if (ctrl) {
    step += tuningParams.red;
  }
  if (!(alt || ctrl || shift)) {
    step = tuningParams.blue;
  }

  let tunedNumber = originNumber;
  if (direction === up) {
    tunedNumber = originNumber + step;
  } else if (direction === down) {
    tunedNumber = originNumber - step;
  }
  tunedNumber = numberLimit(tunedNumber, 0, tuningParams.max);

  return tunedNumber.toString(16).padStart(tuningParams.length, '0');
}

const HexLabelImpl = {
  name: 'HexLabel',
  props: {
    color: {
      type: Object,
      required: true,
    },
  },
  setup(props: HexLabelProps, context: SetupContext) {
    const emit = context.emit;

    const hexRef: Ref<HTMLElement | null> = ref(null);

    const state = reactive({
      hexShort: false,
    });

    function updateColor(eventName: string, hex: string): void {
      if (Color.hexRule.test(hex)) {
        state.hexShort = hex.replace('#', '').length === 3;

        const color = Color.fromHex(hex);
        const sameColor = Color.sameColor(props.color as Color, color);
        if (sameColor) {
          return;
        }

        emit(eventName, color);
      }
    }

    function onHexInput(e: Event): void {
      const target = e.target as HTMLInputElement;
      const value = getInputValue(target);
      updateColor('colorInput', value);
    }

    function onHexBlur(e: Event): void {
      const target = e.target as HTMLInputElement;
      const inputValue = getInputValue(target);
      const hex = Color.hexNormalize(inputValue);
      const hashHex = `#${hex}`;

      if (inputValue !== hashHex) {
        setInputValue(target, hashHex);
      }

      updateColor('colorBlur', hex);
    }

    function tuning(functionKeys: FunctionKeys, direction: Direction): void {
      if (!hexRef.value) {
        return;
      }

      const hexInput = hexRef.value as HTMLInputElement;
      const hexValue = getInputValue(hexInput);

      if (!Color.hexRule.test(hexValue)) {
        return;
      }

      const pureHex = hexValue.replace('#', '');
      const hexNumber = parseInt(pureHex, 16);
      let tunedPureHex;

      if (pureHex.length === 3) {
        const params = {
          blue: 0x001,
          green: 0x010,
          red: 0x100,
          max: 0xfff,
          length: 3,
        };
        tunedPureHex = calcTuned(functionKeys, hexNumber, direction, params);
      } else if (pureHex.length === 6) {
        const params = {
          blue: 0x000001,
          green: 0x000100,
          red: 0x010000,
          max: 0xffffff,
          length: 6,
        };
        tunedPureHex = calcTuned(functionKeys, hexNumber, direction, params);
      }

      if (!tunedPureHex) {
        return;
      }

      const newHex = `#${tunedPureHex}`;
      setInputValue(hexInput, newHex);
      updateColor('colorInput', newHex);
    }

    function onHexKeydown(e: KeyboardEvent): void {
      const options = {
        alt: e.altKey,
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
      };

      switch (e.key) {
        case 'ArrowUp':
        case 'Up':
          tuning(options, up);
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 'Down':
          tuning(options, down);
          e.preventDefault();
          break;
      }
    }

    return (): JSX.Element => {
      return (
        <div class="nova-color-picker-output">
          <div class="nova-color-picker-hex">
            <input
              type="text"
              value={props.color.toCssHexString(state.hexShort)}
              ref={hexRef}
              onInput={onHexInput}
              onBlur={onHexBlur}
              onKeydown={onHexKeydown}
            />
            <div class="nova-color-picker-input-border" />
          </div>
        </div>
      );
    };
  },
};
export const HexLabel = (HexLabelImpl as unknown) as {
  new (): {
    $props: VNodeProps & HexLabelProps;
  };
};
