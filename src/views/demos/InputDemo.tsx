import { defineComponent } from 'vue';
import { NovaInput } from '../../index';
import { vueJsxCompat } from '../../vueJsxCompat';

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
