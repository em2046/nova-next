import { computed, defineComponent, ref } from 'vue';
import useMousemove from '../../../../uses/useMousemove';
import Utils from '../../../../utils/utils';
import { vueJsxCompat } from '../../../../vue-jsx-compat';

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

    return (): JSX.Element => {
      const { r, g, b } = props.color.toCssRgba();
      const currColorRgb = `${r}, ${g}, ${b}`;
      const currColorLinearGradient = `linear-gradient(180deg, rgba(${currColorRgb}, 1), rgba(${currColorRgb}, 0))`;

      const barStyle = {
        backgroundImage: currColorLinearGradient,
      };

      return (
        <div class="nova-color-picker-alpha-slide" ref={alphaSlideRef}>
          <div class="nova-color-picker-alpha-bar" style={barStyle} />
          <div
            class="nova-color-picker-alpha-thumb"
            style={alphaThumbStyle.value}
          />
        </div>
      );
    };
  },
});
