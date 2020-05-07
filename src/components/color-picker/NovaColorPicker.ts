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
      color: Rgba.fromCssLikeHsva(0, 100, 100, 1),
    });

    const hueReg = computed(() => {
      return Math.round((state.position.hue / 200) * 360) % 360;
    });

    function getPanelColor(): Rgba {
      return Rgba.fromCssLikeHsva(
        hueReg.value,
        state.position.saturation / 2,
        (200 - state.position.value) / 2,
        (200 - state.position.alpha) / 200
      );
    }

    function setColor(rgba: Rgba, isWatch = false): void {
      const hsva = rgba.toHsva();
      const { h, s, v, a } = hsva;

      const hue = Utils.limit((h / 360) * 200, 0, 200);
      const saturation = Utils.limit(s * 200, 0, 200);
      const value = Utils.limit(200 - 200 * v, 0, 200);
      const alpha = Utils.limit(200 - 200 * a, 0, 200);

      const panelColor = getPanelColor();

      if (!isWatch || panelColor.toHex() !== rgba.toHex()) {
        state.color = rgba;
        state.position.hue = hue;
        state.position.saturation = saturation;
        state.position.value = value;
        state.position.alpha = alpha;
      }
    }

    function setColorFromPanel(): void {
      state.color = getPanelColor();
    }

    function updateColor(): void {
      setColorFromPanel();
      emit('update', `#${state.color.toHex()}`);
    }

    watch(
      () => props.value,
      (value, prevValue) => {
        if (value !== prevValue) {
          const color = Rgba.fromHex(value);
          setColor(color, true);
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
          setColorFromPanel();
        },
        onFinish: () => {
          updateColor();
        },
      });

      const hueSlideNode = h(HueSlide, {
        hue: state.position.hue,
        onMove: (position: MousePosition) => {
          state.position.hue = Utils.limit(position.y, 0, 200);
          setColorFromPanel();
        },
        onFinish: () => {
          updateColor();
        },
      });

      const alphaSlideNode = h(AlphaSlide, {
        alpha: state.position.alpha,
        color: state.color,
        onMove: (position: MousePosition) => {
          state.position.alpha = Utils.limit(position.y, 0, 200);
          setColorFromPanel();
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
          color: state.color,
          onCustomInput: (rgba: Rgba) => {
            setColor(rgba);
          },
          onCustomBlur: (rgba: Rgba) => {
            emit('update', `#${rgba.toHex()}`);
          },
        }),
        h(HexLabel, {
          color: state.color,
          onCustomInput: (rgba: Rgba) => {
            setColor(rgba);
          },
          onCustomBlur: (rgba: Rgba) => {
            emit('update', `#${rgba.toHex()}`);
          },
        }),
      ]);

      const previewNode = h(Preview, {
        color: state.color,
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
