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
import useMousemove from '../../uses/useMousemove';

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

    const hsvRef = ref(null);
    const hueSlideRef = ref(null);
    const alphaSlideRef = ref(null);
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

    const cursorStyle = computed(() => {
      return {
        transform: `translate(${state.position.saturation}px, ${state.position.value}px)`,
      };
    });

    const hueThumbStyle = computed(() => {
      return {
        transform: `translate(0, ${state.position.hue}px)`,
      };
    });

    const hueReg = computed(() => {
      return Math.round((state.position.hue / 200) * 360) % 360;
    });

    const hsvStyle = computed(() => {
      return {
        backgroundColor: `hsl(${hueReg.value} ,100%, 50%)`,
      };
    });

    const alphaThumbStyle = computed(() => {
      return {
        transform: `translate(0, ${state.position.alpha}px)`,
      };
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

    useMousemove({
      ref: hsvRef,
      move: (position) => {
        state.position.saturation = Utils.limit(position.x, 0, 200);
        state.position.value = Utils.limit(position.y, 0, 200);
      },
      finish: () => {
        updateColor();
      },
    });

    useMousemove({
      ref: hueSlideRef,
      move: (position) => {
        state.position.hue = Utils.limit(position.y, 0, 200);
      },
      finish: () => {
        updateColor();
      },
    });

    useMousemove({
      ref: alphaSlideRef,
      move: (position) => {
        state.position.alpha = Utils.limit(position.y, 0, 200);
      },
      finish: () => {
        updateColor();
      },
    });

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
      const alphaRgb = `${cssRgba.r}, ${cssRgba.g}, ${cssRgba.b}`;
      const currColor = `rgba(${alphaRgb}, ${cssRgba.a})`;
      const alphaBarBg = `linear-gradient(180deg, rgba(${alphaRgb}, 1), rgba(${alphaRgb}, 0))`;

      const hsvNode = h(
        'div',
        {
          class: 'nova-color-picker-hsv',
          style: hsvStyle.value,
          ref: hsvRef,
        },
        [
          h('div', { class: 'nova-color-picker-saturation' }),
          h('div', { class: 'nova-color-picker-value' }),
          h('div', {
            class: 'nova-color-picker-cursor',
            style: cursorStyle.value,
          }),
        ]
      );

      const slidesNode = h('div', { class: 'nova-color-picker-slides' }, [
        h(
          'div',
          {
            class: 'nova-color-picker-hue-slide',
            ref: hueSlideRef,
          },
          [
            h('div', {
              class: 'nova-color-picker-hue-bar',
            }),
            h('div', {
              class: 'nova-color-picker-hue-thumb',
              style: hueThumbStyle.value,
            }),
          ]
        ),
        h(
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
        ),
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

      const previewNode = h('div', { class: 'nova-color-picker-preview' }, [
        h('div', { class: 'nova-color-picker-preview-prev' }),
        h('div', {
          class: 'nova-color-picker-preview-curr',
          style: {
            backgroundColor: currColor,
          },
        }),
        h('div', { class: 'nova-color-picker-preview-fill-right' }),
        h('div', { class: 'nova-color-picker-preview-fill-left' }),
      ]);

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
