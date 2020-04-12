import { View } from 'vue-router'
import { defineComponent, h } from 'vue'

export default defineComponent({
  setup() {
    return () => [
      h('header', { id: 'header' }, [
        h('nav', { id: 'nav' }, [
          h('ul', [
            h('li', [h('a', { href: '/' }, ['Home'])]),
            h('li', [h('a', { href: '/button' }, ['Button'])]),
            h('li', [h('a', { href: '/input' }, ['Input'])]),
            h('li', [h('a', { href: '/about' }, ['About'])]),
          ]),
        ]),
      ]),
      h('main', { id: 'main' }, [h(View)]),
    ]
  },
})
