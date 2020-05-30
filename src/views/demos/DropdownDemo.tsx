import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import Matrix from './dropdown/Matrix';
import './dropdown/index.css';

export default defineComponent({
  setup() {
    return (): JSX.Element => (
      <section>
        <Matrix />
      </section>
    );
  },
});
