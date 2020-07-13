import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import Matrix from './dropdown/Matrix';
import Normal from './dropdown/Normal';

export default defineComponent({
  setup() {
    return (): JSX.Element => (
      <section>
        <Normal />
        <Matrix />
      </section>
    );
  },
});
