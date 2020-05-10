import { defineComponent, h, VNode, reactive } from 'vue';
import Color from '../../color';
import DomUtils from '../../../../utils/dom-utils';

export default defineComponent({
  props: {
    color: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    const state = reactive({
      hexShort: false,
    });

    function updateColor(eventName: string, hex: string): void {
      if (Color.hexRule.test(hex)) {
        state.hexShort = hex.replace('#', '').length === 3;
        const color = Color.fromHex(hex);
        emit(eventName, color);
      }
    }

    function onHexInput(e: InputEvent): void {
      const target = e.target as HTMLInputElement;
      const value = DomUtils.getInputValue(target);
      updateColor('colorInput', value);
    }

    function onHexBlur(e: InputEvent): void {
      const target = e.target as HTMLInputElement;
      const inputValue = DomUtils.getInputValue(target);
      const hex = Color.hexNormalize(inputValue);
      const hashHex = `#${hex}`;

      if (inputValue !== hashHex) {
        DomUtils.setInputValue(target, hashHex);
      }

      updateColor('colorBlur', hex);
    }

    return (): VNode | null => {
      return h(
        'div',
        { class: 'nova-color-picker-output' },
        h(
          'div',
          {
            class: 'nova-color-picker-hex',
          },
          h('input', {
            value: props.color.toCssHexString(state.hexShort),
            onInput: onHexInput,
            onBlur: onHexBlur,
          })
        )
      );
    };
  },
});
