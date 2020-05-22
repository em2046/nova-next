import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../vueJsxCompat';

export default defineComponent({
  name: 'NovaInput',
  setup() {
    return (): unknown => {
      return (
        <div class="nova-input-wrap">
          <input type="text" class="nova-input" />
        </div>
      );
    };
  },
});
