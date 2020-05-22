import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';

export default defineComponent({
  name: 'NovaInput',
  setup() {
    return (): JSX.Element => {
      return (
        <div class="nova-input-wrap">
          <input type="text" class="nova-input" />
        </div>
      );
    };
  },
});
