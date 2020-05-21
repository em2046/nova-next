import { defineComponent, h } from 'vue';
import { NovaInput } from '../../index';

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
