import { reactive, SetupContext, VNodeProps, watch } from 'vue';
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
import { Environment } from '../../../../uses/use-environment';

type rgbChannel = 'red' | 'green' | 'blue';

interface RgbaLabelsProps {
  alpha: boolean;
  color: Color;
  environment: Environment;
}

const RgbaLabelsImpl = {
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
    environment: {
      type: Object,
      required: true,
    },
  },
  setup(props: RgbaLabelsProps, context: SetupContext) {
    const emit = context.emit;

    const rgba = props.color.toCssRgba();
    const state = reactive({
      red: rgba.red,
      green: rgba.green,
      blue: rgba.blue,
      alpha: rgba.alpha,
    });

    function updateColor(eventName: string): void {
      const red = intNormalize(state.red, 255);
      const green = intNormalize(state.green, 255);
      const blue = intNormalize(state.blue, 255);
      const alpha = alphaNormalize(state.alpha);

      const color = Color.fromCssRgba(red, green, blue, alpha);
      const sameColor = Color.sameColor(props.color as Color, color);
      if (sameColor) {
        return;
      }

      emit(eventName, color);
    }

    function onRgbInput(input: HTMLInputElement, channel: rgbChannel): void {
      const value = DomUtils.getInputValue(input);

      if (value === '') {
        return;
      }

      if (/^\d+$/.test(value)) {
        state[channel] = parseFloat(value);
        updateColor('colorInput');
      }
    }

    function onAlphaInput(input: HTMLInputElement): void {
      const value = DomUtils.getInputValue(input);

      if (value === '') {
        return;
      }

      if (alphaRule.test(value)) {
        state['alpha'] = parseFloat(value);
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

        state.red = rgba.red;
        state.green = rgba.green;
        state.blue = rgba.blue;
        state.alpha = rgba.alpha;
      }
    );

    return (): JSX.Element => {
      const language = props.environment.languageRef.value.colorPicker;

      const rNode = createChannel({
        label: 'R',
        title: language.red,
        value: state.red,
        onInput: (e) => {
          onRgbInput(e.target as HTMLInputElement, 'red');
        },
        onUpdate: (params: UpdateParams) => {
          onRgbInput(params.target, 'red');
        },
        onBlur: onRgbaBlur,
      });

      const gNode = createChannel({
        label: 'G',
        title: language.green,
        value: state.green,
        onInput: (e) => {
          onRgbInput(e.target as HTMLInputElement, 'green');
        },
        onUpdate: (params: UpdateParams) => {
          onRgbInput(params.target, 'green');
        },
        onBlur: onRgbaBlur,
      });

      const bNode = createChannel({
        label: 'B',
        title: language.blue,
        value: state.blue,
        onInput: (e) => {
          onRgbInput(e.target as HTMLInputElement, 'blue');
        },
        onUpdate: (params: UpdateParams) => {
          onRgbInput(params.target, 'blue');
        },
        onBlur: onRgbaBlur,
      });

      const aNode = createAlpha({
        alpha: props.alpha,
        title: language.alpha,
        value: state.alpha,
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
};

export const RgbaLabels = (RgbaLabelsImpl as unknown) as {
  new (): {
    $props: VNodeProps & RgbaLabelsProps;
  };
};
