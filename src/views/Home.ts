import { ref, h } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const inc = () => {
      count.value++
    }

    return () => [
      h('div', { class: 'img' }),
      h('h1', ['Hello Vue 3!']),
      h('button', { onClick: inc }, [`Clicked ${count.value} times.`]),
    ]
  },
}
