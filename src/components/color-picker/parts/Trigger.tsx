import { computed, defineComponent, h, onMounted, ref, VNode } from 'vue';

export default defineComponent({
  props: {
    color: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    const triggerRef = ref(null);

    const triggerInnerStyle = computed(() => {
      return {
        backgroundColor: props.color.toCssRgbaString(),
      };
    });

    onMounted(() => {
      emit('assignRef', triggerRef);
    });

    return (): VNode => {
      return h(
        'div',
        {
          class: 'nova-color-picker-trigger',
          ref: triggerRef,
        },
        h('div', {
          class: 'nova-color-picker-trigger-inner',
          style: triggerInnerStyle.value,
        })
      );
    };
  },
});
