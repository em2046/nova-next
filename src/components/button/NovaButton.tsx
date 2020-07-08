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
      const icon = slots.icon?.();
      const classList = [
        'nova-button',
        { 'nova-button-icon-only': icon && !children },
      ];

      function createIcon() {
        if (!icon) {
          return null;
        }

        return <span class="nova-button-icon">{icon}</span>;
      }

      function createChildren() {
        if (!children) {
          return null;
        }

        return <span>{children}</span>;
      }

      return (
        <button
          class={classList}
          type="button"
          data-nova-theme={environment.themeRef.value}
        >
          {createIcon()}
          {createChildren()}
        </button>
      );
    };
  },
});
