import {
  computed,
  defineComponent,
  h,
  reactive,
  VNode,
  watch,
  onMounted,
} from 'vue';
import Rgba from './rgba';
import Utils from '../../utils/utils';
import { MousePosition } from '../../uses/useMousemove';
import HsvPanel from './parts/HsvPanel';
import HueSlide from './parts/HueSlide';
import AlphaSlide from './parts/AlphaSlide';
import Preview from './parts/Preview';
import RgbaLabels from './parts/RgbaLabels';
import HexLabel from './parts/HexLabel';

export default defineComponent({
  model: {
    event: 'update',
  },
  props: {
    value: {
      type: String,
      default: '#ff0000',
    },
  },
  setup: function (props, context) {
    const emit = context.emit;

    const state = reactive({
      position: {
        hue: 0,
        saturation: 200,
        value: 0,
        alpha: 0,
      },
    });

    const hueReg = computed(() => {
      return Math.round((state.position.hue / 200) * 360) % 360;
    });

    const color = computed(() => {
      return Rgba.fromCssLikeHsva(
        hueReg.value,
        state.position.saturation / 2,
        (200 - state.position.value) / 2,
        (200 - state.position.alpha) / 200
      );
    });

    function setColor(rgba: Rgba): void {
      const hsva = rgba.toHsva();
      const { h, s, v, a } = hsva;

      state.position.hue = Utils.limit((h / 360) * 200, 0, 200);
      state.position.saturation = Utils.limit(s * 200, 0, 200);
      state.position.value = Utils.limit(200 - 200 * v, 0, 200);
      state.position.alpha = Utils.limit(200 - 200 * a, 0, 200);
    }

    function updateColor(): void {
      emit('update', `#${color.value.toHex()}`);
    }

    watch(
      () => props.value,
      (value, prevValue) => {
        if (value !== prevValue) {
          const color = Rgba.fromHex(value);
          setColor(color);
        }
      }
    );

    onMounted(() => {
      const color = Rgba.fromHex(props.value);
      setColor(color);
    });

    return (): VNode => {
      const hsvNode = h(HsvPanel, {
        hueReg: hueReg.value,
        saturation: state.position.saturation,
        value: state.position.value,
        onMove: (position: MousePosition) => {
          state.position.saturation = Utils.limit(position.x, 0, 200);
          state.position.value = Utils.limit(position.y, 0, 200);
        },
        onFinish: () => {
          updateColor();
        },
      });

      const hueSlideNode = h(HueSlide, {
        hue: state.position.hue,
        onMove: (position: MousePosition) => {
          state.position.hue = Utils.limit(position.y, 0, 200);
        },
        onFinish: () => {
          updateColor();
        },
      });

      const alphaSlideNode = h(AlphaSlide, {
        alpha: state.position.alpha,
        color: color.value,
        onMove: (position: MousePosition) => {
          state.position.alpha = Utils.limit(position.y, 0, 200);
        },
        onFinish: () => {
          updateColor();
        },
      });

      const slidesNode = h('div', { class: 'nova-color-picker-slides' }, [
        hueSlideNode,
        alphaSlideNode,
      ]);

      const formNode = h('div', { class: 'nova-color-picker-form' }, [
        h(RgbaLabels, {
          color: color.value,
          onSetColor: (rgba: Rgba) => {
            setColor(rgba);
          },
        }),
        h(HexLabel, {
          color: color.value,
          onSetColor: (rgba: Rgba) => {
            setColor(rgba);
          },
        }),
      ]);

      const previewNode = h(Preview, {
        color: color.value,
      });

      return h(
        'div',
        { class: 'nova-color-picker' },
        h('div', { class: 'nova-color-picker-panel' }, [
          hsvNode,
          slidesNode,
          formNode,
          previewNode,
        ])
      );
    };
  },
});
