import { defineComponent, h, VNode } from 'vue';
import Color from '../color';

export default defineComponent({
  props: {
    color: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    function onPrevClick(): void {
      emit('reset');
    }

    return (): VNode | null => {
      const prevColor = Color.fromHex(props.value).toCssRgbaString();
      const currColor = props.color.toCssRgbaString();

      return h('div', { class: 'nova-color-picker-preview' }, [
        h('div', { class: 'nova-color-picker-preview-fill-right' }),
        h('div', { class: 'nova-color-picker-preview-fill-left' }),
        h('div', {
          class: 'nova-color-picker-preview-prev',
          style: {
            backgroundColor: prevColor,
          },
          onClick: onPrevClick,
        }),
        h('div', {
          class: 'nova-color-picker-preview-curr',
          style: {
            backgroundColor: currColor,
          },
        }),
      ]);
    };
  },
});
