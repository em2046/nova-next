import { defineComponent, h, reactive, VNode, watch } from 'vue';
import Color from '../../color';
import DomUtils from '../../../../utils/dom-utils';
import {
  alphaNormalize,
  alphaRule,
  ChannelParams,
  intNormalize,
  UpdateParams,
} from './label-utils';
import NumberInput from './NumberInput';

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

    const rgba = props.color.toCss();
    const state = reactive({
      r: rgba.r,
      g: rgba.g,
      b: rgba.b,
      a: rgba.a,
    });

    function updateColor(eventName: string): void {
      const r = intNormalize(state.r, 255);
      const g = intNormalize(state.g, 255);
      const b = intNormalize(state.b, 255);
      const a = alphaNormalize(state.a);

      const color = Color.fromCss(r, g, b, a);
      emit(eventName, color);
    }

    function onRgbInput(input: HTMLInputElement, channel: rgbChannel): void {
      const value = DomUtils.getInputValue(input);

      if (value === '') {
        return;
      }

      if (/^\d+$/.test(value)) {
        state[channel] = value;
        updateColor('colorInput');
      }
    }

    function onAlphaInput(input: HTMLInputElement): void {
      const value = DomUtils.getInputValue(input);

      if (value === '') {
        return;
      }

      if (alphaRule.test(value)) {
        state['a'] = value;
        updateColor('colorInput');
      }
    }

    function onRgbaBlur(): void {
      updateColor('colorBlur');
    }

    function createChannel(options: ChannelParams): VNode {
      const { label, value, onInput, onUpdate } = options;

      return h('label', { class: 'nova-color-picker-label' }, [
        h('div', { class: 'nova-color-picker-label-text' }, label),
        h(
          'div',
          { class: 'nova-color-picker-number' },
          h(NumberInput, {
            value: value.toString(),
            onInput,
            onUpdate,
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
        const rgba = props.color.toCss();

        state.r = rgba.r;
        state.g = rgba.g;
        state.b = rgba.b;
        state.a = rgba.a;
      }
    );

    return (): VNode | null => {
      const rNode = createChannel({
        label: 'R',
        value: state.r,
        onInput: (e) => {
          onRgbInput(e.target as HTMLInputElement, 'r');
        },
        onUpdate: (params: UpdateParams) => {
          onRgbInput(params.target, 'r');
        },
      });

      const gNode = createChannel({
        label: 'G',
        value: state.g,
        onInput: (e) => {
          onRgbInput(e.target as HTMLInputElement, 'g');
        },
        onUpdate: (params: UpdateParams) => {
          onRgbInput(params.target, 'g');
        },
      });

      const bNode = createChannel({
        label: 'B',
        value: state.b,
        onInput: (e) => {
          onRgbInput(e.target as HTMLInputElement, 'b');
        },
        onUpdate: (params: UpdateParams) => {
          onRgbInput(params.target, 'b');
        },
      });

      const aNode = createChannel({
        label: 'A',
        value: state.a,
        onInput: (e) => {
          onAlphaInput(e.target as HTMLInputElement);
        },
        onUpdate: (params: UpdateParams) => {
          onAlphaInput(params.target);
        },
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
