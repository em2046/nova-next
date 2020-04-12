import { h } from 'vue'
import { NovaInput } from '../../index'

export default {
  setup() {
    return () => [h('section', [h(NovaInput)])]
  },
}
