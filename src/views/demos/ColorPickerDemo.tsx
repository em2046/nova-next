import { defineComponent, h } from 'vue';
import Normal from './color-picker/Normal';
import Alpha from './color-picker/Alpha';
import Hsla from './color-picker/Hsla';

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
