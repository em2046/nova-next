import { defineComponent, h, reactive, VNode } from 'vue';
import { NovaColorPicker } from '../../../index';

export default defineComponent({
  setup() {
    const defaultColor = '#808040';

    const state = reactive({
      color: defaultColor,
      disabled: false,
    });

    function onUpdate(color: string): void {
      state.color = color;
    }

    function onReset(): void {
      state.color = defaultColor;
    }

    function onToggleDisable(): void {
      state.disabled = !state.disabled;
    }

    return (): VNode => {
      return h('div', {}, [
        h('div', [
          state.color,
          h('button', { onClick: onReset }, ['Reset']),
          h('button', { onClick: onToggleDisable }, ['Toggle disable']),
        ]),
        h(NovaColorPicker, {
          value: state.color,
          disabled: state.disabled,
          onUpdate,
          preset: [
            '#804040',
            '#808040',
            '#408040',
            '#408080',
            '#404080',
            '#804080',
            '#808080',
          ],
        }),
      ]);
    };
  },
});
