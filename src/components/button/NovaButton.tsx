import { ButtonHTMLAttributes, SetupContext, VNodeProps } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import { useEnvironment } from '../../uses/use-environment';
import { VueComponentProps } from '../../types/vue-component';
import {
  environmentProps,
  EnvironmentProps,
} from '../environment/NovaEnvironment';

export interface ButtonProps extends EnvironmentProps {
  primary?: boolean;
}

const buttonProps = {
  ...environmentProps,
  primary: {
    type: Boolean,
    default: false,
  },
};

const NovaButtonImpl = {
  name: 'NovaButton',
  props: buttonProps,
  setup(props: ButtonProps, context: SetupContext) {
    const { slots } = context;

    const environment = useEnvironment(props as EnvironmentProps);

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
    $props: VNodeProps & ButtonProps & ButtonHTMLAttributes & VueComponentProps;
  };
};
