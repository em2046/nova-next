import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import { NovaButton } from '../../index';

export default defineComponent({
  setup() {
    return (): JSX.Element => (
      <section>
        <NovaButton>{(): string => 'primary'}</NovaButton>
        <NovaButton>{(): string => 'Secondary'}</NovaButton>
        <NovaButton>{(): string => 'Link'}</NovaButton>
      </section>
    );
  },
});
