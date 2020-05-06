import { computed, defineComponent, h, ref, VNode } from 'vue';
import useMousemove from '../../../uses/useMousemove';

export default defineComponent({
  props: {
    alpha: {
      type: Number,
    },
    color: {
      type: Object,
    },
  },
  setup(props, context) {
    const emit = context.emit;

    const alphaSlideRef = ref(null);

    const alphaThumbStyle = computed(() => {
      return {
        transform: `translate(0, ${props.alpha}px)`,
      };
    });

    useMousemove({
      ref: alphaSlideRef,
      move: (position) => {
        emit('move', position);
      },
      finish: () => {
        emit('finish');
      },
    });

    return (): VNode | null => {
      if (!props.color) {
        return null;
      }

      const cssRgba = props.color.toCss();
      const alphaRgb = `${cssRgba.r}, ${cssRgba.g}, ${cssRgba.b}`;
      const alphaBarBg = `linear-gradient(180deg, rgba(${alphaRgb}, 1), rgba(${alphaRgb}, 0))`;

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
              backgroundImage: alphaBarBg,
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
