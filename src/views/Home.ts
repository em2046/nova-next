import { ref, h, VNode, RenderFunction } from 'vue'

export default {
  setup(): RenderFunction {
    const count = ref(0)
    const inc = (): void => {
      count.value++
    }

    return (): VNode[] => [
      h('div', { class: 'img' }),
      h('h1', 'Hello Vue 3!'),
      h('button', { onClick: inc }, `Clicked ${count.value} times.`),
    ]
  },
}
