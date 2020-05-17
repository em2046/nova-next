import { defineComponent, h, VNode } from 'vue';
import Color from '../color';

export default defineComponent({
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
  setup(props, context) {
    const emit = context.emit;

    function selectPreset(hex: string): void {
      const color = Color.parse(hex);
      emit('select', color);
    }

    function createPreset(color: string): VNode {
      const selected =
        Color.parse(color).toCssHexString() === props.color.toCssHexString();
      const classList = [
        'nova-color-picker-preset',
        {
          ['nova-color-picker-preset-selected']: selected,
        },
      ];

      return h(
        'div',
        {
          class: classList,
          onClick: () => {
            selectPreset(color);
          },
        },
        [
          h('div', {
            class: 'nova-color-picker-preset-inner',
            style: {
              backgroundColor: color,
            },
          }),
        ]
      );
    }

    return (): VNode => {
      return h(
        'div',
        {
          class: 'nova-color-picker-presets',
        },
        props.preset.map((value) => createPreset(value as string))
      );
    };
  },
});
