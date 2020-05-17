import { defineComponent, h, reactive, VNode } from 'vue';
import { NovaColorPicker } from '../../../index';

export default defineComponent({
  setup() {
    const defaultColor = 'hsla(180, 50%, 50%, 0.5)';
    const state = reactive({
      color: defaultColor,
    });

    function onReset(): void {
      state.color = defaultColor;
    }

    function onUpdate(color: string): void {
      state.color = color;
    }

    return (): VNode => {
      return h('div', {}, [
        h('div', {}, [
          state.color,
          h('button', { onClick: onReset }, ['Reset']),
        ]),
        h(NovaColorPicker, {
          value: state.color,
          format: 'hsl',
          alpha: true,
          onUpdate,
        }),
      ]);
    };
  },
});
