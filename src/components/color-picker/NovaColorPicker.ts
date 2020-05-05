import { defineComponent, h, VNode } from 'vue'

export default defineComponent({
  setup() {
    return (): VNode => {
      return h(
        'div',
        { class: 'nova-color-picker' },
        h('div', { class: 'nova-color-picker-panel' }, [
          h('div', { class: 'nova-color-picker-hue' }, [
            h('div', { class: 'nova-color-picker-saturation' }),
            h('div', { class: 'nova-color-picker-value' }),
            h('div', { class: 'nova-color-picker-cursor' }),
          ]),
          h('div', { class: 'nova-color-picker-slides' }, [
            h('div', { class: 'nova-color-picker-hue-slide' }, [
              h('div', { class: 'nova-color-picker-hue-thumb' }),
            ]),
            h('div', { class: 'nova-color-picker-opacity-slide' }, [
              h('div', { class: 'nova-color-picker-opacity-thumb' }),
            ]),
          ]),
          h('div', { class: 'nova-color-picker-form' }, [
            h('div', { class: 'nova-color-picker-labels' }, [
              h('label', { class: 'nova-color-picker-label-primary' }, [
                h('div', { class: 'nova-color-picker-label-text' }, 'R'),
                h(
                  'div',
                  { class: 'nova-color-picker-number-primary' },
                  h('input', { value: 127 })
                ),
              ]),
              h('label', { class: 'nova-color-picker-label-secondary' }, [
                h('div', { class: 'nova-color-picker-label-text' }, 'G'),
                h(
                  'div',
                  { class: 'nova-color-picker-number-secondary' },
                  h('input', { value: 63 })
                ),
              ]),
              h('label', { class: 'nova-color-picker-label-tertiary' }, [
                h('div', { class: 'nova-color-picker-label-text' }, 'B'),
                h(
                  'div',
                  { class: 'nova-color-picker-number-tertiary' },
                  h('input', { value: 63 })
                ),
              ]),
              h('label', { class: 'nova-color-picker-label-quaternary' }, [
                h('div', { class: 'nova-color-picker-label-text' }, 'A%'),
                h(
                  'div',
                  { class: 'nova-color-picker-number-quaternary' },
                  h('input', { value: 100 })
                ),
              ]),
            ]),
            h(
              'div',
              { class: 'nova-color-picker-rgb' },
              h(
                'div',
                { class: 'nova-color-picker-hex' },
                h('input', { value: '#7f3f3f' })
              )
            ),
          ]),
          h('div', { class: 'nova-color-picker-preview' }, [
            h('div', { class: 'nova-color-picker-preview-prev' }),
            h('div', { class: 'nova-color-picker-preview-curr' }),
          ]),
        ])
      )
    }
  },
})
