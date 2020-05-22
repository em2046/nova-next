import { computed, defineComponent, ref } from 'vue';
import useMousemove from '../../../uses/useMousemove';
import Utils from '../../../utils/utils';

import { vueJsxCompat } from '../../../vue-jsx-compat';

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
      const x = Utils.numberFixed(props.saturation);
      const y = Utils.numberFixed(props.value);
      return {
        transform: `translate(${x}px, ${y}px)`,
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

    return (): JSX.Element => {
      return (
        <div
          class={'nova-color-picker-hsv'}
          style={hsvStyle.value}
          ref={hsvRef}
        >
          <div class="nova-color-picker-saturation" />
          <div class="nova-color-picker-value" />
          <div class="nova-color-picker-cursor" style={cursorStyle.value} />
        </div>
      );
    };
  },
});
