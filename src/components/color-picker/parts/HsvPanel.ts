import { computed, defineComponent, h, ref, VNode } from 'vue';
import useMousemove from '../../../uses/useMousemove';

export default defineComponent({
  props: {
    hueReg: {
      type: Number,
      required: true,
    },
    saturation: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    const hsvRef = ref(null);

    const cursorStyle = computed(() => {
      return {
        transform: `translate(${props.saturation}px, ${props.value}px)`,
      };
    });

    const hsvStyle = computed(() => {
      return {
        backgroundColor: `hsl(${props.hueReg} ,100%, 50%)`,
      };
    });

    useMousemove({
      ref: hsvRef,
      move: (position) => {
        emit('move', position);
      },
    });

    return (): VNode => {
      return h(
        'div',
        {
          class: 'nova-color-picker-hsv',
          style: hsvStyle.value,
          ref: hsvRef,
        },
        [
          h('div', { class: 'nova-color-picker-saturation' }),
          h('div', { class: 'nova-color-picker-value' }),
          h('div', {
            class: 'nova-color-picker-cursor',
            style: cursorStyle.value,
          }),
        ]
      );
    };
  },
});
