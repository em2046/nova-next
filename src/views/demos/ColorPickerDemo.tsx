import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import Normal from './color-picker/Normal';
import Alpha from './color-picker/Alpha';
import Hsla from './color-picker/Hsla';
import VModel from './color-picker/VModel.vue';

export default defineComponent({
  setup() {
    return (): JSX.Element => (
      <section>
        <Normal />
        <Alpha />
        <Hsla />
        <VModel />
      </section>
    );
  },
});
