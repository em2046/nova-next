import { h, VNode } from 'vue'
import { NovaInput } from '../../index'

export default {
  setup() {
    return (): VNode[] => [h('section', [h(NovaInput)])]
  },
}
