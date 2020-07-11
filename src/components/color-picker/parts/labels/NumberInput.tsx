import { onMounted, Ref, ref, SetupContext, VNodeProps } from 'vue';
import { vueJsxCompat } from '../../../../vue-jsx-compat';
import Utils from '../../../../utils/utils';
import DomUtils, {
  Direction,
  down,
  FunctionKeys,
  up,
} from '../../../../utils/dom-utils';

interface NumberInputProps {
  value?: string;
  inputRef?: Ref<HTMLElement | null>;
}

const NumberInputImpl = {
  name: 'NumberInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    inputRef: {
      type: Object,
      default: null,
    },
  },
  setup(props: NumberInputProps, context: SetupContext) {
    const emit = context.emit;

    const inputRef: Ref<HTMLElement | null> = ref(null);

    function tuning(functionKeys: FunctionKeys, direction: Direction): void {
      if (!inputRef.value) {
        return;
      }

      const input = inputRef.value as HTMLInputElement;
      const value = DomUtils.getInputValue(input);

      if (!/^-?\d+(\.\d+)?$/.test(value)) {
        return;
      }

      const { alt, shift, ctrl } = functionKeys;
      const originNumber = parseFloat(value);

      let step = 1;
      if (ctrl) {
        step = 100;
      } else if (shift) {
        step = 10;
      } else if (alt) {
        step = 0.1;
      }

      let tunedNumber = originNumber;
      if (direction === up) {
        tunedNumber = originNumber + step;
      } else if (direction === down) {
        tunedNumber = originNumber - step;
      }

      const tunedValue = Utils.numberFixed(tunedNumber, 1).toString();

      if (tunedValue === value) {
        return;
      }

      DomUtils.setInputValue(input, tunedValue);
      emit('update', {
        target: input,
        value: tunedValue,
      });
    }

    function onKeydown(e: KeyboardEvent): void {
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

    onMounted(() => {
      emit('assignRef', inputRef);
    });

    return (): JSX.Element => {
      return (
        <div class="nova-color-picker-input">
          <input
            type="text"
            value={props.value}
            ref={inputRef}
            onKeydown={onKeydown}
          />
          <div class="nova-color-picker-input-border" />
        </div>
      );
    };
  },
};

export const NumberInput = (NumberInputImpl as unknown) as {
  new (): {
    $props: VNodeProps & NumberInputProps;
  };
};
