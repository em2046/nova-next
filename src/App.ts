import { View } from 'vue-router'
import { h } from 'vue'

export default {
  setup() {
    return () => [
      h('header', [
        h('ul', [
          h('li', [h('a', { href: '/' }, ['Home'])]),
          h('li', [h('a', { href: '/about' }, ['About'])]),
        ]),
      ]),
      h(View),
    ]
  },
}
