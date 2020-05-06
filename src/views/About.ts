import { h, VNode, defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return (): VNode[] => [h('h1', ['About page!'])];
  },
});
