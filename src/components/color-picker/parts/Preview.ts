import { defineComponent, h, VNode } from 'vue';

export default defineComponent({
  props: {
    color: {
      type: Object,
    },
  },
  setup(props) {
    return (): VNode | null => {
      if (!props.color) {
        return null;
      }

      const cssRgba = props.color.toCss();
      const currColor = `rgba(${cssRgba.r}, ${cssRgba.g}, ${cssRgba.b}, ${cssRgba.a})`;

      return h('div', { class: 'nova-color-picker-preview' }, [
        h('div', { class: 'nova-color-picker-preview-prev' }),
        h('div', {
          class: 'nova-color-picker-preview-curr',
          style: {
            backgroundColor: currColor,
          },
        }),
        h('div', { class: 'nova-color-picker-preview-fill-right' }),
        h('div', { class: 'nova-color-picker-preview-fill-left' }),
      ]);
    };
  },
});
