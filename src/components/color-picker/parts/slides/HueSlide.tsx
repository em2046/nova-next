import { computed, defineComponent, ref } from 'vue';
import useMousemove from '../../../../uses/useMousemove';
import Utils from '../../../../utils/utils';
import { vueJsxCompat } from '../../../../vue-jsx-compat';

export default defineComponent({
  name: 'HueSlide',
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
      const y = Utils.numberFixed(props.hue);
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

    return (): JSX.Element => {
      return (
        <div class="nova-color-picker-hue-slide" ref={hueSlideRef}>
          <div class="nova-color-picker-hue-bar" />
          <div
            class="nova-color-picker-hue-thumb"
            style={hueThumbStyle.value}
          />
        </div>
      );
    };
  },
});
