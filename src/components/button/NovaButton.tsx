import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';

export default defineComponent({
  name: 'NovaButton',
  setup(props, context) {
    const { slots } = context;

    return (): unknown => {
      const children = slots.default && slots.default();
      return (
        <button class="nova-button" type="button">
          {children}
        </button>
      );
    };
  },
});
