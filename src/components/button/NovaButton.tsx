import { defineComponent } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import useEnvironment, {
  EnvironmentProps,
  environmentProps,
} from '../../uses/use-environment';

export default defineComponent({
  name: 'NovaButton',
  props: {
    ...environmentProps,
  },
  setup(props, context) {
    const { slots } = context;

    const environment = useEnvironment(props as EnvironmentProps);

    return (): JSX.Element => {
      const children = slots.default?.();
      return (
        <button
          class="nova-button"
          type="button"
          data-nova-theme={environment.themeRef.value}
        >
          {children}
        </button>
      );
    };
  },
});
