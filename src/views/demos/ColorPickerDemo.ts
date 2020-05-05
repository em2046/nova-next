import { h, VNode } from 'vue';
import { NovaColorPicker } from '../../components/color-picker';

export default {
  setup() {
    return (): VNode[] => [
      h('section', [h(NovaColorPicker), h(NovaColorPicker)]),
    ];
  },
};
