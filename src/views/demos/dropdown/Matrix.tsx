import { defineComponent, reactive } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import { NovaColorPicker } from '../../../index';
import styles from './styles/martrix.module.css';

export default defineComponent({
  setup() {
    const state = reactive({
      color: '#808080',
    });

    return (): JSX.Element => {
      const pickerList = new Array(100).fill(null).map(() => {
        return (
          <li>
            <NovaColorPicker value={state.color} />
          </li>
        );
      });

      return (
        <div class={styles.box}>
          <ul>{pickerList}</ul>
        </div>
      );
    };
  },
});
