import { defineComponent } from 'vue';
import Normal from './color-picker/Normal';
import Alpha from './color-picker/Alpha';
import Hsla from './color-picker/Hsla';
import { vueJsxCompat } from '../../vue-jsx-compat';

export default defineComponent({
  setup() {
    return (): JSX.Element => (
      <section>
        <Normal />
        <Alpha />
        <Hsla />
      </section>
    );
  },
});
