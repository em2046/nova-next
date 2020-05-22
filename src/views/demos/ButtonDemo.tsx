import { NovaButton } from '../../index';
import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';

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
