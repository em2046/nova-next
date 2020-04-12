import { defineComponent, h } from 'vue'

export default defineComponent({
  setup(props, context) {
    const { slots } = context

    return () => {
      const children = slots.default && slots.default()
      return h(
        'button',
        {
          class: 'nova-button',
          type: 'button',
        },
        [children]
      )
    }
  },
})
