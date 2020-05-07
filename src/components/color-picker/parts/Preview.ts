import { defineComponent, h, VNode } from 'vue';

export default defineComponent({
  props: {
    color: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    return (): VNode | null => {
      const { r, g, b, a } = props.color.toCss();
      const currColor = `rgba(${r}, ${g}, ${b}, ${a})`;

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
