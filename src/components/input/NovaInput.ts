import { defineComponent, h, VNode } from 'vue'

export default defineComponent({
  setup() {
    return (): VNode => {
      return h('div', [h('input', { class: 'nova-input', type: 'text' })])
    }
  },
})
