import { RouterView, RouterLink } from 'vue-router'
import { defineComponent, h, VNode } from 'vue'

export default defineComponent({
  setup() {
    return (): VNode[] => [
      h('header', { id: 'header' }, [
        h('nav', { id: 'nav' }, [
          h('ul', [
            h('li', [h(RouterLink, { to: '/' }, () => 'Home')]),
            h('li', [h(RouterLink, { to: '/button' }, () => 'Button')]),
            h('li', [h(RouterLink, { to: '/input' }, () => 'Input')]),
            h('li', [h(RouterLink, { to: '/about' }, () => 'About')]),
          ]),
        ]),
      ]),
      h('main', { id: 'main' }, [h(RouterView)]),
    ]
  },
})
