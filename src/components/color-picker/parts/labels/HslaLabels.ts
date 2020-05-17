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

type hslChannel = 'h' | 's' | 'l';

export default defineComponent({
  props: {
    alpha: {
      type: Boolean,
      required: true,
    },
    color: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    const hsla = props.color.toCssHsla();
    const state = reactive({
      h: hsla.h,
      s: hsla.s,
      l: hsla.l,
      a: hsla.a,
    });

    function updateColor(eventName: string): void {
      const h = intNormalize(state.h, 360);
      const s = intNormalize(state.s, 100);
      const l = intNormalize(state.l, 100);
      const a = alphaNormalize(state.a);

      const color = Color.fromCssHsla(h, s, l, a);
      emit(eventName, color);
    }

    function onHslInput(input: HTMLInputElement, channel: hslChannel): void {
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

    function onHslaBlur(): void {
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
            onBlur: onHslaBlur,
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
        const hsla = props.color.toCssHsla();

        state.h = hsla.h;
        state.s = hsla.s;
        state.l = hsla.l;
        state.a = hsla.a;
      }
    );
    return (): VNode | null => {
      const hNode = createChannel({
        label: 'H',
        value: state.h,
        onInput: (e) => {
          onHslInput(e.target as HTMLInputElement, 'h');
        },
        onUpdate: (params: UpdateParams) => {
          onHslInput(params.target, 'h');
        },
      });

      const sNode = createChannel({
        label: 'S',
        value: state.s,
        onInput: (e) => {
          onHslInput(e.target as HTMLInputElement, 's');
        },
        onUpdate: (params: UpdateParams) => {
          onHslInput(params.target, 's');
        },
      });

      const lNode = createChannel({
        label: 'L',
        value: state.l,
        onInput: (e) => {
          onHslInput(e.target as HTMLInputElement, 'l');
        },
        onUpdate: (params: UpdateParams) => {
          onHslInput(params.target, 'l');
        },
      });

      function createAlpha(): VNode | null {
        if (!props.alpha) {
          return null;
        }

        return createChannel({
          label: 'A',
          value: state.a,
          onInput: (e) => {
            onAlphaInput(e.target as HTMLInputElement);
          },
          onUpdate: (params: UpdateParams) => {
            onAlphaInput(params.target);
          },
        });
      }

      const aNode = createAlpha();

      return h('div', { class: 'nova-color-picker-labels' }, [
        hNode,
        sNode,
        lNode,
        aNode,
      ]);
    };
  },
});
