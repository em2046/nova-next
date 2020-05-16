import { defineComponent, h, watch, VNode, reactive } from 'vue';
import Color from '../../color';
import DomUtils from '../../../../utils/dom-utils';
import { alphaNormalize, intNormalize } from './label-utils';
import NumberInput from './NumberInput';

interface ChannelParams {
  label: string;
  value: number;
  onInput: (e: InputEvent) => void;
}

type rgbChannel = 'r' | 'g' | 'b';

export default defineComponent({
  props: {
    color: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    const { r, g, b, a } = props.color.toCss();
    const state = reactive({
      r: r,
      g: g,
      b: b,
      a: a,
    });

    function updateColor(eventName: string): void {
      const r = intNormalize(state.r, 255);
      const g = intNormalize(state.g, 255);
      const b = intNormalize(state.b, 255);
      const a = alphaNormalize(state.a);

      const color = Color.fromCss(r, g, b, a);
      emit(eventName, color);
    }

    function onRgbInput(e: InputEvent, channel: rgbChannel): void {
      const input = e.target as HTMLInputElement;
      const value = DomUtils.getInputValue(input);

      if (value === '') {
        return;
      }

      if (/^\d+$/.test(value)) {
        state[channel] = value;
        updateColor('colorInput');
      }
    }

    function onAlphaInput(e: InputEvent): void {
      const input = e.target as HTMLInputElement;
      const value = DomUtils.getInputValue(input);

      if (value === '') {
        return;
      }

      if (/^((0)|(1)|(\d\.\d{1,2}))$/.test(value)) {
        state['a'] = value;
        updateColor('colorInput');
      }
    }

    function onRgbaBlur(): void {
      updateColor('colorBlur');
    }

    function createChannel(options: ChannelParams): VNode {
      const { label, value, onInput } = options;

      return h('label', { class: 'nova-color-picker-label' }, [
        h('div', { class: 'nova-color-picker-label-text' }, label),
        h(
          'div',
          { class: 'nova-color-picker-number' },
          h(NumberInput, {
            value: value.toString(),
            onInput,
            onBlur: onRgbaBlur,
          })
        ),
      ]);
    }

    watch(
      () => props.color,
      (value, prevValue) => {
        if (value === prevValue) {
          return;
        }
        const { r, g, b, a } = props.color.toCss();

        state.r = r;
        state.g = g;
        state.b = b;
        state.a = a;
      }
    );

    return (): VNode | null => {
      const { r, g, b, a } = state;

      const rNode = createChannel({
        label: 'R',
        value: r,
        onInput: (e) => {
          onRgbInput(e, 'r');
        },
      });

      const gNode = createChannel({
        label: 'G',
        value: g,
        onInput: (e) => {
          onRgbInput(e, 'g');
        },
      });

      const bNode = createChannel({
        label: 'B',
        value: b,
        onInput: (e) => {
          onRgbInput(e, 'b');
        },
      });

      const aNode = createChannel({
        label: 'A',
        value: a,
        onInput: onAlphaInput,
      });

      return h('div', { class: 'nova-color-picker-labels' }, [
        rNode,
        gNode,
        bNode,
        aNode,
      ]);
    };
  },
});
