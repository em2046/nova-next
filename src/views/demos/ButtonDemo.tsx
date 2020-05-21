import { NovaButton } from '../../index';
import { defineComponent, h } from 'vue';

export default defineComponent({
  setup() {
    return (): unknown => (
      <section>
        <NovaButton>{(): string => 'primary'}</NovaButton>
        <NovaButton>{(): string => 'Secondary'}</NovaButton>
        <NovaButton>{(): string => 'Link'}</NovaButton>
      </section>
    );
  },
});
