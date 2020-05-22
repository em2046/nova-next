import { defineComponent } from 'vue';
import { NovaInput } from '../../index';
import { vueJsxCompat } from '../../vue-jsx-compat';

export default defineComponent({
  setup() {
    return (): JSX.Element => (
      <section>
        <NovaInput />
        <NovaInput />
      </section>
    );
  },
});
