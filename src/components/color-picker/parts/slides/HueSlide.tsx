import { computed, ref, SetupContext, VNodeProps } from 'vue';
import { vueJsxCompat } from '../../../../vue-jsx-compat';
import useMove from '../../../../uses/use-move';
import Utils from '../../../../utils/utils';

interface HueSlideProps {
  hue: number;
}

const HueSlideImpl = {
  name: 'HueSlide',
  props: {
    hue: {
      type: Number,
      required: true,
    },
  },
  setup(props: HueSlideProps, context: SetupContext) {
    const emit = context.emit;

    const hueSlideRef = ref(null);

    const hueThumbStyle = computed(() => {
      const y = Utils.numberFixed(props.hue);

      return {
        transform: `translate(0, ${y}px)`,
      };
    });

    useMove({
      ref: hueSlideRef,
      move: (position) => {
        emit('move', position);
      },
    });

    return (): JSX.Element => {
      return (
        <div class="nova-color-picker-hue-slide" ref={hueSlideRef}>
          <div class="nova-color-picker-hue-inner">
            <div class="nova-color-picker-hue-bar" />
          </div>

          <div
            class="nova-color-picker-hue-thumb"
            style={hueThumbStyle.value}
          />
        </div>
      );
    };
  },
};

export const HueSlide = (HueSlideImpl as unknown) as {
  new (): {
    $props: VNodeProps & HueSlideProps;
  };
};
