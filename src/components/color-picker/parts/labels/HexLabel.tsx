import { reactive, ref, Ref, SetupContext, VNodeProps } from 'vue';
import { vueJsxCompat } from '../../../../vue-jsx-compat';
import Utils from '../../../../utils/utils';
import DomUtils, {
  Direction,
  down,
  FunctionKeys,
  up,
} from '../../../../utils/dom-utils';
import Color from '../../color';

interface TuningParams {
  red: number;
  green: number;
  blue: number;
  max: number;
  length: number;
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
  tunedNumber = Utils.numberLimit(tunedNumber, 0, tuningParams.max);

  return tunedNumber.toString(16).padStart(tuningParams.length, '0');
}

interface HexLabelProps {
  color: Color;
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
      const value = DomUtils.getInputValue(target);
      updateColor('colorInput', value);
    }

    function onHexBlur(e: Event): void {
      const target = e.target as HTMLInputElement;
      const inputValue = DomUtils.getInputValue(target);
      const hex = Color.hexNormalize(inputValue);
      const hashHex = `#${hex}`;

      if (inputValue !== hashHex) {
        DomUtils.setInputValue(target, hashHex);
      }

      updateColor('colorBlur', hex);
    }

    function tuning(functionKeys: FunctionKeys, direction: Direction): void {
      if (!hexRef.value) {
        return;
      }

      const hexInput = hexRef.value as HTMLInputElement;
      const hexValue = DomUtils.getInputValue(hexInput);

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
      DomUtils.setInputValue(hexInput, newHex);
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
