import { defineComponent, h } from 'vue';

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
