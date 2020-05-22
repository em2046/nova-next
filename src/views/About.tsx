import { defineComponent } from 'vue';
import { vueJsxCompat } from '../vue-jsx-compat';

export default defineComponent({
  setup() {
    return (): JSX.Element => <h1>About page!</h1>;
  },
});
