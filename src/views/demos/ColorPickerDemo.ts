import { defineComponent, h, VNode } from 'vue';
import Normal from './color-picker/Normal';
import Alpha from './color-picker/Alpha';
import Hsla from './color-picker/Hsla';

export default defineComponent({
  setup() {
    return (): VNode[] => [h('section', [h(Normal), h(Alpha), h(Hsla)])];
  },
});
