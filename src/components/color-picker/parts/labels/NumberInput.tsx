import { defineComponent, ref, Ref } from 'vue';
import DomUtils, {
  Direction,
  down,
  FunctionKeys,
  up,
} from '../../../../utils/dom-utils';
import Utils from '../../../../utils/utils';
import { vueJsxCompat } from '../../../../vue-jsx-compat';

export default defineComponent({
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  setup(props, context) {
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

    return (): unknown => {
      return (
        <input
          type="text"
          value={props.value}
          ref={inputRef}
          onKeydown={onKeydown}
        />
      );
    };
  },
});
