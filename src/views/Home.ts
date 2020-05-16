import { defineComponent, h, RenderFunction, VNode } from 'vue';
import { RouterLink } from 'vue-router';

export default defineComponent({
  setup(): RenderFunction {
    return (): VNode[] => [
      h('h1', 'nova-next'),
      h('p', 'Experimental Vue components'),
      h(RouterLink, { to: '/color-picker' }, () => 'ColorPicker'),
    ];
  },
});
