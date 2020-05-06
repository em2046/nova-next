import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  reactive,
  ref,
  VNode,
  watch,
  onMounted,
} from 'vue';
import Rgba from './rgba';

function limit(n: number, low = 0, high = Infinity): number {
  if (n < low) {
    return low;
  } else if (n > high) {
    return high;
  }
  return n;
}

export default defineComponent({
  props: {
    value: {
      type: String,
      default: '#ff0000',
    },
  },
  setup: function (props) {
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

    const cache = {
      flags: {
        holdHsv: false,
        holdHueSlide: false,
        holdAlphaSlide: false,
        move: false,
      },
      hsvRect: {} as DOMRect,
      hueSlideRect: {} as DOMRect,
      alphaSlideRect: {} as DOMRect,
    };

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

    watch(
      () => props.value,
      (value, prevValue) => {
        console.log(value, prevValue);
      }
    );

    function onHsvMousemove(e: MouseEvent): void {
      state.position.saturation = limit(
        e.pageX - cache.hsvRect.x - window.pageXOffset,
        0,
        200
      );
      state.position.value = limit(
        e.pageY - cache.hsvRect.y - window.pageYOffset,
        0,
        200
      );
    }

    function onHueSlideMousemove(e: MouseEvent): void {
      state.position.hue = limit(
        e.pageY - cache.hueSlideRect.y - window.pageYOffset,
        0,
        200
      );
    }

    function onAlphaSlideMousemove(e: MouseEvent): void {
      state.position.alpha = limit(
        e.pageY - cache.alphaSlideRect.y - window.pageYOffset,
        0,
        200
      );
    }

    function onMousemove(e: MouseEvent): void {
      if (cache.flags.move) {
        return;
      }

      cache.flags.move = true;

      requestAnimationFrame(() => {
        cache.flags.move = false;
      });

      if (cache.flags.holdHsv) {
        onHsvMousemove(e);
      }
      if (cache.flags.holdHueSlide) {
        onHueSlideMousemove(e);
      }
      if (cache.flags.holdAlphaSlide) {
        onAlphaSlideMousemove(e);
      }
    }

    function onMouseup(): void {
      cache.flags.holdHsv = false;
      cache.flags.holdHueSlide = false;
      cache.flags.holdAlphaSlide = false;

      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
    }

    function onHsvMousedown(e: MouseEvent): void {
      if (hsvRef.value) {
        const hsvDom: HTMLElement = (hsvRef.value as unknown) as HTMLElement;
        cache.hsvRect = hsvDom.getBoundingClientRect();
      }

      state.position.saturation = e.offsetX;
      state.position.value = e.offsetY;

      cache.flags.holdHsv = true;

      document.addEventListener('mousemove', onMousemove);
      document.addEventListener('mouseup', onMouseup);
    }

    function onHueSlideMousedown(e: MouseEvent): void {
      state.position.hue = e.offsetY;

      if (hueSlideRef.value) {
        const hueSlideDom: HTMLElement = (hueSlideRef.value as unknown) as HTMLElement;
        cache.hueSlideRect = hueSlideDom.getBoundingClientRect();
      }

      cache.flags.holdHueSlide = true;

      document.addEventListener('mousemove', onMousemove);
      document.addEventListener('mouseup', onMouseup);
    }

    function onAlphaSlideMousedown(e: MouseEvent): void {
      state.position.alpha = e.offsetY;

      if (alphaSlideRef.value) {
        const alphaSlideDom: HTMLElement = (alphaSlideRef.value as unknown) as HTMLElement;
        cache.alphaSlideRect = alphaSlideDom.getBoundingClientRect();
      }

      cache.flags.holdAlphaSlide = true;

      document.addEventListener('mousemove', onMousemove);
      document.addEventListener('mouseup', onMouseup);
    }

    function setColor(rgba: Rgba): void {
      const hsva = rgba.toHsva();
      const { h, s, v, a } = hsva;

      state.position.hue = limit((h / 360) * 200, 0, 200);
      state.position.saturation = limit(s * 200, 0, 200);
      state.position.value = limit(200 - 200 * v, 0, 200);
      state.position.alpha = limit(200 - 200 * a, 0, 200);
    }

    function onRgbaInput(): void {
      const rDom = (rRef.value as unknown) as HTMLInputElement;
      const rValue = rDom.value.trim();
      const r = parseInt(rValue, 10);

      const gDom = (gRef.value as unknown) as HTMLInputElement;
      const gValue = gDom.value.trim();
      const g = parseInt(gValue, 10);

      const bDom = (bRef.value as unknown) as HTMLInputElement;
      const bValue = bDom.value.trim();
      const b = parseInt(bValue, 10);

      const aDom = (aRef.value as unknown) as HTMLInputElement;
      const aValue = aDom.value.trim();
      const a = parseFloat(aValue);

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

    onMounted(() => {
      const color = Rgba.fromHex(props.value);
      setColor(color);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
    });

    return (): VNode => {
      const cssRgba = color.value.toCss();
      const alphaRgb = `${cssRgba.r}, ${cssRgba.g}, ${cssRgba.b}`;
      const currColor = `rgba(${alphaRgb}, ${cssRgba.a})`;
      const alphaBarBg = `linear-gradient(180deg, rgba(${alphaRgb}, 1), rgba(${alphaRgb}, 0))`;

      return h(
        'div',
        { class: 'nova-color-picker' },
        h('div', { class: 'nova-color-picker-panel' }, [
          h(
            'div',
            {
              class: 'nova-color-picker-hsv',
              style: hsvStyle.value,
              onMousedown: onHsvMousedown,
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
          ),
          h('div', { class: 'nova-color-picker-slides' }, [
            h(
              'div',
              {
                class: 'nova-color-picker-hue-slide',
                onMousedown: onHueSlideMousedown,
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
                onMousedown: onAlphaSlideMousedown,
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
          ]),
          h('div', { class: 'nova-color-picker-form' }, [
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
          ]),
          h('div', { class: 'nova-color-picker-preview' }, [
            h('div', { class: 'nova-color-picker-preview-prev' }),
            h('div', {
              class: 'nova-color-picker-preview-curr',
              style: {
                backgroundColor: currColor,
              },
            }),
            h('div', { class: 'nova-color-picker-preview-fill-right' }),
            h('div', { class: 'nova-color-picker-preview-fill-left' }),
          ]),
        ])
      );
    };
  },
});
