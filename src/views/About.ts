import { h, VNode } from 'vue';

export default {
  setup() {
    return (): VNode[] => [h('h1', ['About page!'])];
  },
};
