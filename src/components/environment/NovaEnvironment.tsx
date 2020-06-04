import { defineComponent, provide, ref, VNode, watchEffect } from 'vue';
import { Theme } from '../../utils/symbols';

export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'dark',
    },
  },
  setup(props, context) {
    const { slots } = context;
    const themeRef = ref(props.theme);

    provide(Theme, themeRef);

    watchEffect(() => {
      themeRef.value = props.theme;
    });

    return (): VNode[] | null => {
      const children = slots.default && slots.default();

      if (!children) {
        return null;
      }

      return children;
    };
  },
});
