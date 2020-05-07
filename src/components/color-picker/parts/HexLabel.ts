import { defineComponent, h, VNode } from 'vue';
import Color from '../color';

export default defineComponent({
  props: {
    color: {
      type: Object,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    function updateColor(value: string, eventName: string): void {
      const rgba = Color.fromHex(value);
      if (/^#?(([\dA-Fa-f]{6})([\dA-Fa-f]{2})?)$/.test(value)) {
        emit(eventName, rgba);
      }
    }

    function onHexInput(e: InputEvent): void {
      if (e.target) {
        const target = e.target as HTMLInputElement;
        const value = target.value.trim();

        updateColor(value, 'colorInput');
      }
    }

    function onHexBlur(e: InputEvent): void {
      const target = e.target as HTMLInputElement;
      const oldValue = target.value.trim();
      let value = oldValue;

      value = value.replace(/[^\dA-Fa-f]/g, '');

      if (value.length === 3) {
        value = `${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}`;
      }

      if (value.length > 8) {
        value = value.substr(0, 8);
      }

      if (value.length === 7) {
        value = value.substr(0, 6);
      }

      if (oldValue !== '#' + value) {
        target.value = '#' + value;
      }

      updateColor(value, 'colorBlur');
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
            onBlur: onHexBlur,
          })
        )
      );
    };
  },
});
