import { defineComponent } from 'vue';
import Normal from './color-picker/Normal';
import Alpha from './color-picker/Alpha';
import Hsla from './color-picker/Hsla';
import { vueJsxCompat } from '../../vueJsxCompat';

export default defineComponent({
  setup() {
    return (): unknown => (
      <section>
        <Normal />
        <Alpha />
        <Hsla />
      </section>
    );
  },
});
