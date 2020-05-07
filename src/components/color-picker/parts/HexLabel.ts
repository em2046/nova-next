import { defineComponent, h, VNode } from 'vue';
import Color from '../color';
import DomHelper from '../../../utils/dom-helper';

export default defineComponent({
  props: {
    color: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    function updateColor(eventName: string, hex: string): void {
      if (Color.hexRule.test(hex)) {
        const color = Color.fromHex(hex);
        emit(eventName, color);
      }
    }

    function onHexInput(e: InputEvent): void {
      const target = e.target as HTMLInputElement;
      const value = DomHelper.getInputValue(target);
      updateColor('colorInput', value);
    }

    function onHexBlur(e: InputEvent): void {
      const target = e.target as HTMLInputElement;
      const inputValue = DomHelper.getInputValue(target);
      const hex = Color.hexNormalize(inputValue);
      const hashHex = `#${hex}`;

      if (inputValue !== hashHex) {
        DomHelper.setInputValue(target, hashHex);
      }

      updateColor('colorBlur', hex);
    }

    return (): VNode | null => {
      return h(
        'div',
        { class: 'nova-color-picker-rgb' },
        h(
          'div',
          {
            class: 'nova-color-picker-hex',
          },
          h('input', {
            value: `#${props.color.toHex()}`,
            onInput: onHexInput,
            onBlur: onHexBlur,
          })
        )
      );
    };
  },
});
