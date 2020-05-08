import { computed, defineComponent, h, ref, VNode } from 'vue';
import useMousemove from '../../../../uses/useMousemove';
import Utils from '../../../../utils/utils';

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
      const y = Utils.numberFixed(props.hue, 2);
      return {
        transform: `translate(0, ${y}px)`,
      };
    });

    useMousemove({
      ref: hueSlideRef,
      move: (position) => {
        emit('move', position);
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
