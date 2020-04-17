import { h, VNode } from 'vue'
import { NovaButton } from '../../index'

export default {
  setup() {
    return (): VNode[] => [
      h('section', [
        h(NovaButton, () => 'Primary'),
        h(NovaButton, () => 'Secondary'),
        h(NovaButton, () => 'Link'),
      ]),
    ]
  },
}
