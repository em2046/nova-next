import { computed, ref, SetupContext, VNodeProps } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import { MovePosition, useMove } from '../../../uses/use-move';
import { fromHsva, toCssRgbaString } from '../color';
import { numberFixed } from '../../../utils/utils';

interface HsvPanelProps {
  hueReg: number;
  saturation: number;
  value: number;
  onMove: (position: MovePosition) => void;
}

const HsvPanelImpl = {
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
  setup(props: HsvPanelProps, context: SetupContext) {
    const emit = context.emit;

    const hsvRef = ref(null);

    const cursorStyle = computed(() => {
      const x = numberFixed(props.saturation);
      const y = numberFixed(props.value);
      return {
        transform: `translate(${x}px, ${y}px)`,
      };
    });

    const hsvStyle = computed(() => {
      const bg = toCssRgbaString(fromHsva(props.hueReg, 1, 1));

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
};

export const HsvPanel = (HsvPanelImpl as unknown) as {
  new (): {
    $props: VNodeProps & HsvPanelProps;
  };
};
