import { computed, defineComponent, ref } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import useMove from '../../../uses/useMove';
import Utils from '../../../utils/utils';
import Color from '../color';

export default defineComponent({
  name: 'HsvPanel',
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
      const x = Utils.numberFixed(props.saturation);
      const y = Utils.numberFixed(props.value);
      return {
        transform: `translate(${x}px, ${y}px)`,
      };
    });

    const hsvStyle = computed(() => {
      const bg = Color.fromHsva(props.hueReg, 1, 1).toCssRgbaString();

      return {
        background: `linear-gradient(90deg, hsl(0, 0%, 100%), ${bg})`,
      };
    });

    useMove({
      ref: hsvRef,
      move: (position) => {
        emit('move', position);
      },
    });

    return (): JSX.Element => {
      return (
        <div class="nova-color-picker-hsv" ref={hsvRef}>
          <div class="nova-color-picker-hsv-inner">
            <div
              class="nova-color-picker-hue-saturation"
              style={hsvStyle.value}
            />
            <div class="nova-color-picker-value" />
          </div>
          <div class="nova-color-picker-cursor" style={cursorStyle.value} />
        </div>
      );
    };
  },
});
