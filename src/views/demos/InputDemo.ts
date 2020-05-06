import { h, VNode, defineComponent } from 'vue';
import { NovaInput } from '../../index';

export default defineComponent({
  setup() {
    return (): VNode[] => [h('section', [h(NovaInput), h(NovaInput)])];
  },
});
