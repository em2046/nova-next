import { computed, defineComponent, h, ref, VNode } from 'vue';
import useMousemove from '../../../uses/useMousemove';

export default defineComponent({
  props: {
    hue: {
      type: Number,
      required: true,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    const hueSlideRef = ref(null);

    const hueThumbStyle = computed(() => {
      return {
        transform: `translate(0, ${props.hue}px)`,
      };
    });

    useMousemove({
      ref: hueSlideRef,
      move: (position) => {
        emit('move', position);
      },
      finish: () => {
        emit('finish');
      },
    });

    return (): VNode => {
      return h(
        'div',
        {
          class: 'nova-color-picker-hue-slide',
          ref: hueSlideRef,
        },
        [
          h('div', {
            class: 'nova-color-picker-hue-bar',
          }),
          h('div', {
            class: 'nova-color-picker-hue-thumb',
            style: hueThumbStyle.value,
          }),
        ]
      );
    };
  },
});
