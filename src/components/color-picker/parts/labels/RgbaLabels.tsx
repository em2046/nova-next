import { defineComponent, reactive, watch } from 'vue';
import Color from '../../color';
import DomUtils from '../../../../utils/dom-utils';
import {
  alphaNormalize,
  alphaRule,
  createAlpha,
  createChannel,
  intNormalize,
  UpdateParams,
} from './label-utils';
import { vueJsxCompat } from '../../../../vue-jsx-compat';

type rgbChannel = 'r' | 'g' | 'b';

export default defineComponent({
  name: 'RgbaLabels',
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

    const rgba = props.color.toCssRgba();
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

      const color = Color.fromCssRgba(r, g, b, a);
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

    watch(
      () => props.color,
      () => {
        const rgba = props.color.toCssRgba();

        state.r = rgba.r;
        state.g = rgba.g;
        state.b = rgba.b;
        state.a = rgba.a;
      }
    );

    return (): JSX.Element => {
      const rNode = createChannel({
        label: 'R',
        value: state.r,
        onInput: (e) => {
          onRgbInput(e.target as HTMLInputElement, 'r');
        },
        onUpdate: (params: UpdateParams) => {
          onRgbInput(params.target, 'r');
        },
        onBlur: onRgbaBlur,
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
        onBlur: onRgbaBlur,
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
        onBlur: onRgbaBlur,
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
        onBlur: onRgbaBlur,
      });

      return (
        <div class="nova-color-picker-labels">
          {rNode}
          {gNode}
          {bNode}
          {aNode}
        </div>
      );
    };
  },
});
