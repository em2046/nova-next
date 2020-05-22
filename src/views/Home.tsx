import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';
import { vueJsxCompat } from '../vue-jsx-compat';

export default defineComponent({
  setup() {
    return (): unknown => [
      <h1>Nova next</h1>,
      <p>Experimental Vue components</p>,
      <RouterLink to="/color-picker">{(): string => 'ColorPicker'}</RouterLink>,
    ];
  },
});
