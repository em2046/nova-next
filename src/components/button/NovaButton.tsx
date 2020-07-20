import { ButtonHTMLAttributes, SetupContext, VNodeProps } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import useEnvironment, {
  environmentProps,
  NovaEnvironmentProps,
} from '../../uses/use-environment';
import { VueComponentProps } from '../../utils/types';

interface NovaButtonProps extends NovaEnvironmentProps {
  primary?: boolean;
}

const NovaButtonImpl = {
  name: 'NovaButton',
  props: {
    ...environmentProps,
    primary: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: NovaButtonProps, context: SetupContext) {
    const { slots } = context;

    const environment = useEnvironment(props as NovaEnvironmentProps);

    return (): JSX.Element => {
      const children = slots.default?.();
      const icon = slots.icon?.();
      const classList = [
        'nova-button',
        { 'nova-button-icon-only': icon && !children },
        { 'nova-button-primary': props.primary },
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
};

export const NovaButton = (NovaButtonImpl as unknown) as {
  new (): {
    $props: VNodeProps &
      NovaButtonProps &
      ButtonHTMLAttributes &
      VueComponentProps;
  };
};
