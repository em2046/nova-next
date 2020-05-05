import { defineComponent, h, VNode, reactive, computed } from 'vue';
import Rgba from './rgba';

export default defineComponent({
  setup() {
    const state = reactive({
      position: {
        hue: 0,
        saturation: 0,
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

    const hueStyle = computed(() => {
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

    function onSVMousedown(e: MouseEvent): void {
      state.position.saturation = e.offsetX;
      state.position.value = e.offsetY;
    }

    function onHueMousedown(e: MouseEvent): void {
      state.position.hue = e.offsetY;
    }

    function onAlphaMousedown(e: MouseEvent): void {
      state.position.alpha = e.offsetY;
    }

    return (): VNode => {
      const cssRgba = color.value.toCss();

      return h(
        'div',
        { class: 'nova-color-picker' },
        h('div', { class: 'nova-color-picker-panel' }, [
          h(
            'div',
            {
              class: 'nova-color-picker-hue',
              style: hueStyle.value,
              onMousedown: onSVMousedown,
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
                onMousedown: onHueMousedown,
              },
              [
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
                onMousedown: onAlphaMousedown,
              },
              [
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
                  h('input', { value: cssRgba.r })
                ),
              ]),
              h('label', { class: 'nova-color-picker-label-secondary' }, [
                h('div', { class: 'nova-color-picker-label-text' }, 'G'),
                h(
                  'div',
                  { class: 'nova-color-picker-number-secondary' },
                  h('input', { value: cssRgba.g })
                ),
              ]),
              h('label', { class: 'nova-color-picker-label-tertiary' }, [
                h('div', { class: 'nova-color-picker-label-text' }, 'B'),
                h(
                  'div',
                  { class: 'nova-color-picker-number-tertiary' },
                  h('input', { value: cssRgba.b })
                ),
              ]),
              h('label', { class: 'nova-color-picker-label-quaternary' }, [
                h('div', { class: 'nova-color-picker-label-text' }, 'A'),
                h(
                  'div',
                  { class: 'nova-color-picker-number-quaternary' },
                  h('input', {
                    value: cssRgba.a,
                  })
                ),
              ]),
            ]),
            h(
              'div',
              { class: 'nova-color-picker-rgb' },
              h(
                'div',
                { class: 'nova-color-picker-hex' },
                h('input', { value: `#${color.value.toHex()}` })
              )
            ),
          ]),
          h('div', { class: 'nova-color-picker-preview' }, [
            h('div', { class: 'nova-color-picker-preview-prev' }),
            h('div', { class: 'nova-color-picker-preview-curr' }),
          ]),
        ])
      );
    };
  },
});
