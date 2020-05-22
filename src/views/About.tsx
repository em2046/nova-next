import { defineComponent } from 'vue';
import { vueJsxCompat } from '../vueJsxCompat';

export default defineComponent({
  setup() {
    return (): unknown => <h1>About page!</h1>;
  },
});
