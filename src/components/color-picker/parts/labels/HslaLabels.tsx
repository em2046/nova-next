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

type hslChannel = 'hue' | 'saturation' | 'lightness';

interface HslaLabelsProps {
  alpha: boolean;
  color: Color;
  environment: Environment;
  onColorInput?: (color: Color) => void;
  onColorBlur?: (color: Color) => void;
}

const HslaLabelsImpl = {
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
    environment: {
      type: Object,
      required: true,
    },
  },
  setup(props: HslaLabelsProps, context: SetupContext) {
    const emit = context.emit;

    const hsla = props.color.toCssHsla();
    const state = reactive({
      hue: hsla.hue,
      saturation: hsla.saturation,
      lightness: hsla.lightness,
      alpha: hsla.alpha,
    });

    function updateColor(eventName: string): void {
      const hue = intNormalize(state.hue, 360);
      const saturation = intNormalize(state.saturation, 100);
      const lightness = intNormalize(state.lightness, 100);
      const alpha = alphaNormalize(state.alpha);

      const color = Color.fromCssHsla(hue, saturation, lightness, alpha);
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

    function onHslaBlur(): void {
      updateColor('colorBlur');
    }

    watch(
      () => props.color,
      () => {
        const hsla = props.color.toCssHsla();

        state.hue = hsla.hue;
        state.saturation = hsla.saturation;
        state.lightness = hsla.lightness;
        state.alpha = hsla.alpha;
      }
    );

    return (): JSX.Element => {
      const language = props.environment.languageRef.value.colorPicker;

      const hNode = createChannel({
        label: 'H',
        title: language.hue,
        value: state.hue,
        onInput: (e) => {
          onHslInput(e.target as HTMLInputElement, 'hue');
        },
        onUpdate: (params: UpdateParams) => {
          onHslInput(params.target, 'hue');
        },
        onBlur: onHslaBlur,
      });

      const sNode = createChannel({
        label: 'S',
        title: language.saturation,
        value: state.saturation,
        onInput: (e) => {
          onHslInput(e.target as HTMLInputElement, 'saturation');
        },
        onUpdate: (params: UpdateParams) => {
          onHslInput(params.target, 'saturation');
        },
        onBlur: onHslaBlur,
      });

      const lNode = createChannel({
        label: 'L',
        title: language.lightness,
        value: state.lightness,
        onInput: (e) => {
          onHslInput(e.target as HTMLInputElement, 'lightness');
        },
        onUpdate: (params: UpdateParams) => {
          onHslInput(params.target, 'lightness');
        },
        onBlur: onHslaBlur,
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
};

export const HslaLabels = (HslaLabelsImpl as unknown) as {
  new (): {
    $props: VNodeProps & HslaLabelsProps;
  };
};
