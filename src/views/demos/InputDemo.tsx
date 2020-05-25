import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import { NovaInput } from '../../index';

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
