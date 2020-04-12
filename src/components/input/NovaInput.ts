import { defineComponent, h } from 'vue'

export default defineComponent({
  setup() {
    return () => {
      return h('div', [h('input', { class: 'nova-input', type: 'text' })])
    }
  },
})
