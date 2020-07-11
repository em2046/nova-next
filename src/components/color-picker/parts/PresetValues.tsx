import { SetupContext, VNodeProps } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import Color from '../color';

interface PresetValuesProps {
  color: Color;
  preset: string[];
}

const PresetValuesImpl = {
  name: 'PresetValues',
  props: {
    color: {
      type: Object,
      required: true,
    },
    preset: {
      type: Array,
      required: true,
    },
  },
  setup(props: PresetValuesProps, context: SetupContext) {
    const emit = context.emit;

    function selectPreset(hex: string): void {
      const color = Color.parse(hex);
      emit('select', color);
    }

    function createPreset(color: string) {
      const presetHex = Color.parse(color).toCssHexString();
      const panelHex = props.color.toCssHexString();
      const selected = presetHex === panelHex;
      const classList = [
        'nova-color-picker-preset',
        {
          ['nova-color-picker-preset-selected']: selected,
        },
      ];

      function onClick(): void {
        selectPreset(color);
      }

      return (
        <div class={classList} onClick={onClick}>
          <div
            class="nova-color-picker-preset-inner"
            style={{
              backgroundColor: color,
            }}
          />
        </div>
      );
    }

    return (): JSX.Element => {
      return (
        <div class="nova-color-picker-preset-list">
          {props.preset.map((value) => createPreset(value as string))}
        </div>
      );
    };
  },
};

export const PresetValues = (PresetValuesImpl as unknown) as {
  new (): {
    $props: VNodeProps & PresetValuesProps;
  };
};
