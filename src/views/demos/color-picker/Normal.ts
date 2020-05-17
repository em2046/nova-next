import { defineComponent, h, reactive, VNode } from 'vue';
import { NovaColorPicker } from '../../..';

export default defineComponent({
  setup() {
    const colorDefault = '#808040';

    const state = reactive({
      color: colorDefault,
      colorDisabled: false,
    });

    function onColorUpdate(color: string): void {
      state.color = color;
    }

    function onColorReset(): void {
      state.color = colorDefault;
    }

    function onColorToggleDisable(): void {
      state.colorDisabled = !state.colorDisabled;
    }

    return (): VNode => {
      return h('div', {}, [
        h('div', [
          state.color,
          h('button', { onClick: onColorReset }, ['Reset']),
          h('button', { onClick: onColorToggleDisable }, ['Toggle disable']),
        ]),
        h(NovaColorPicker, {
          value: state.color,
          disabled: state.colorDisabled,
          onUpdate: onColorUpdate,
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
