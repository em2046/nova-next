import {
  computed,
  defineComponent,
  h,
  reactive,
  ref,
  VNode,
  watch,
  onMounted,
  Ref,
} from 'vue';
import Rgba from './rgba';
import Utils from '../../utils/utils';
import { MousePosition } from '../../uses/useMousemove';
import HsvPanel from './parts/HsvPanel';
import HueSlide from './parts/HueSlide';
import AlphaSlide from './parts/AlphaSlide';
import Preview from './parts/Preview';

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

    const rRef = ref(null);
    const gRef = ref(null);
    const bRef = ref(null);
    const aRef = ref(null);

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

    function getRgbValue(domRef: Ref<null>): number {
      const dom = (domRef.value as unknown) as HTMLInputElement;
      const value = dom.value.trim();
      return parseInt(value, 10);
    }

    function getAlphaValue(domRef: Ref<null>): number {
      const dom = (domRef.value as unknown) as HTMLInputElement;
      const value = dom.value.trim();
      return parseFloat(value);
    }

    function onRgbaInput(): void {
      const r = getRgbValue(rRef);
      const g = getRgbValue(gRef);
      const b = getRgbValue(bRef);
      const a = getAlphaValue(aRef);

      setColor(Rgba.fromCss(r, g, b, a));
    }

    function onHexInput(e: InputEvent): void {
      if (e.target) {
        const target = e.target as HTMLInputElement;
        const value = target.value.trim();

        const color = Rgba.fromHex(value);
        if (/^#?(([\dA-Fa-f]{6})([\dA-Fa-f]{2})?)$/.test(value)) {
          setColor(color);
        }
      }
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
      const cssRgba = color.value.toCss();

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
        h('div', { class: 'nova-color-picker-labels' }, [
          h('label', { class: 'nova-color-picker-label-primary' }, [
            h('div', { class: 'nova-color-picker-label-text' }, 'R'),
            h(
              'div',
              { class: 'nova-color-picker-number-primary' },
              h('input', {
                value: cssRgba.r,
                ref: rRef,
                onInput: onRgbaInput,
              })
            ),
          ]),
          h('label', { class: 'nova-color-picker-label-secondary' }, [
            h('div', { class: 'nova-color-picker-label-text' }, 'G'),
            h(
              'div',
              { class: 'nova-color-picker-number-secondary' },
              h('input', {
                value: cssRgba.g,
                ref: gRef,
                onInput: onRgbaInput,
              })
            ),
          ]),
          h('label', { class: 'nova-color-picker-label-tertiary' }, [
            h('div', { class: 'nova-color-picker-label-text' }, 'B'),
            h(
              'div',
              { class: 'nova-color-picker-number-tertiary' },
              h('input', {
                value: cssRgba.b,
                ref: bRef,
                onInput: onRgbaInput,
              })
            ),
          ]),
          h('label', { class: 'nova-color-picker-label-quaternary' }, [
            h('div', { class: 'nova-color-picker-label-text' }, 'A'),
            h(
              'div',
              { class: 'nova-color-picker-number-quaternary' },
              h('input', {
                value: cssRgba.a,
                ref: aRef,
                onInput: onRgbaInput,
              })
            ),
          ]),
        ]),
        h(
          'div',
          { class: 'nova-color-picker-rgb' },
          h(
            'div',
            {
              class: 'nova-color-picker-hex',
            },
            h('input', {
              value: `#${color.value.toHex()}`,
              onInput: onHexInput,
            })
          )
        ),
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
