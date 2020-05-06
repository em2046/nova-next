import { defineComponent, h, VNode } from 'vue';
import Rgba from '../rgba';

export default defineComponent({
  props: {
    color: {
      type: Object,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    function onHexInput(e: InputEvent): void {
      if (e.target) {
        const target = e.target as HTMLInputElement;
        const value = target.value.trim();

        const rgba = Rgba.fromHex(value);
        if (/^#?(([\dA-Fa-f]{6})([\dA-Fa-f]{2})?)$/.test(value)) {
          emit('setColor', rgba);
        }
      }
    }

    return (): VNode | null => {
      if (!props.color) {
        return null;
      }

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
          })
        )
      );
    };
  },
});
