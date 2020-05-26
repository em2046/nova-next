import { defineComponent, reactive, watch } from 'vue';
import { vueJsxCompat } from '../../../../vue-jsx-compat';
import DomUtils from '../../../../utils/dom-utils';
import Color from '../../color';
import {
  alphaNormalize,
  alphaRule,
  createAlpha,
  createChannel,
  intNormalize,
  UpdateParams,
} from './label-utils';

type hslChannel = 'h' | 's' | 'l';

export default defineComponent({
  name: 'HslaLabels',
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
      const sameColor = Color.sameColor(props.color as Color, color);
      if (sameColor) {
        return;
      }

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

    watch(
      () => props.color,
      () => {
        const hsla = props.color.toCssHsla();

        state.h = hsla.h;
        state.s = hsla.s;
        state.l = hsla.l;
        state.a = hsla.a;
      }
    );

    return (): JSX.Element => {
      const hNode = createChannel({
        label: 'H',
        value: state.h,
        onInput: (e) => {
          onHslInput(e.target as HTMLInputElement, 'h');
        },
        onUpdate: (params: UpdateParams) => {
          onHslInput(params.target, 'h');
        },
        onBlur: onHslaBlur,
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
        onBlur: onHslaBlur,
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
        onBlur: onHslaBlur,
      });

      const aNode = createAlpha({
        alpha: !!props.alpha,
        value: state.a,
        onInput: (e) => {
          onAlphaInput(e.target as HTMLInputElement);
        },
        onUpdate: (params: UpdateParams) => {
          onAlphaInput(params.target);
        },
        onBlur: onHslaBlur,
      });

      return (
        <div class="nova-color-picker-labels">
          {hNode}
          {sNode}
          {lNode}
          {aNode}
        </div>
      );
    };
  },
});
