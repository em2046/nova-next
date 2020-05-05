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
              h('div', { class: 'nova-color-picker-label-primary' }, 'R'),
              h('div', { class: 'nova-color-picker-label-secondary' }, 'G'),
              h('div', { class: 'nova-color-picker-label-tertiary' }, 'B'),
              h('div', { class: 'nova-color-picker-label-quaternary' }, 'A%'),
            ]),
            h('div', { class: 'nova-color-picker-numbers' }, [
              h(
                'div',
                { class: 'nova-color-picker-number-primary' },
                h('input')
              ),
              h(
                'div',
                { class: 'nova-color-picker-number-secondary' },
                h('input')
              ),
              h(
                'div',
                { class: 'nova-color-picker-number-tertiary' },
                h('input')
              ),
              h(
                'div',
                { class: 'nova-color-picker-number-quaternary' },
                h('input')
              ),
            ]),
            h(
              'div',
              { class: 'nova-color-picker-rgb' },
              h('div', { class: 'nova-color-picker-hex' }, h('input'))
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
