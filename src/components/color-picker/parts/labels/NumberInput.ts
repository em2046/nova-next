import { defineComponent, h, VNode } from 'vue';

export default defineComponent({
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return (): VNode => {
      return h('input', {
        value: props.value,
      });
    };
  },
});
