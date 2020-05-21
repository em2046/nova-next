import { computed, defineComponent, h, ref, VNode } from 'vue';
import useMousemove from '../../../../uses/useMousemove';
import Utils from '../../../../utils/utils';

export default defineComponent({
  props: {
    alpha: {
      type: Number,
      required: true,
    },
    color: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    const alphaSlideRef = ref(null);

    const alphaThumbStyle = computed(() => {
      const y = Utils.numberFixed(props.alpha);
      return {
        transform: `translate(0, ${y}px)`,
      };
    });

    useMousemove({
      ref: alphaSlideRef,
      move: (position) => {
        emit('move', position);
      },
    });

    return (): VNode | null => {
      const { r, g, b } = props.color.toCss();
      const currColorRgb = `${r}, ${g}, ${b}`;
      const currColorLinearGradient = `linear-gradient(180deg, rgba(${currColorRgb}, 1), rgba(${currColorRgb}, 0))`;

      return h(
        'div',
        {
          class: 'nova-color-picker-alpha-slide',
          ref: alphaSlideRef,
        },
        [
          h('div', {
            class: 'nova-color-picker-alpha-bar',
            style: {
              backgroundImage: currColorLinearGradient,
            },
          }),
          h('div', {
            class: 'nova-color-picker-alpha-thumb',
            style: alphaThumbStyle.value,
          }),
        ]
      );
    };
  },
});
