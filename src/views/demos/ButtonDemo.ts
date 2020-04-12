import { h } from 'vue'
import { NovaButton } from '../../index'

export default {
  setup() {
    return () => [
      h('section', [
        h(NovaButton, () => 'Primary'),
        h(NovaButton, () => 'Secondary'),
        h(NovaButton, () => 'Link'),
      ]),
    ]
  },
}
