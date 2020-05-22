import { defineComponent } from 'vue';
import { vueJsxCompat } from '../vue-jsx-compat';

export default defineComponent({
  setup() {
    return (): unknown => <h1>About page!</h1>;
  },
});
