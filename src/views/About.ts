import { defineComponent, h, VNode } from 'vue';

export default defineComponent({
  setup() {
    return (): VNode[] => [h('h1', ['About page!'])];
  },
});
