import { defineComponent } from 'vue';
import { NovaInput } from '../../index';
import { vueJsxCompat } from '../../vue-jsx-compat';

export default defineComponent({
  setup() {
    return (): unknown => (
      <section>
        <NovaInput />
        <NovaInput />
      </section>
    );
  },
});
