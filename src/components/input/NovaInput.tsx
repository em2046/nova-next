import { computed, CSSProperties, SetupContext, VNodeProps } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import { useEnvironment } from '../../uses/use-environment';
import { VueComponentProps } from '../../types/vue-component';
import { InputHTMLAttributes } from '@vue/runtime-dom';
import {
  environmentProps,
  EnvironmentProps,
} from '../environment/NovaEnvironment';

interface InputProps extends EnvironmentProps {
  class?: unknown;
  wrapClass?: unknown;
  wrapStyle?: string | CSSProperties;
  disabled?: boolean;
  readonly?: boolean;
}

const inputProps = {
  ...environmentProps,
  class: {
    type: [String, Array, Object],
    default: null,
  },
  wrapClass: {
    type: [String, Array, Object],
    default: null,
  },
  wrapStyle: {
    type: Object,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
};

const NovaInputImpl = {
  name: 'NovaInput',
  inheritAttrs: false,
  props: inputProps,
  setup(props: InputProps, context: SetupContext) {
    const environment = useEnvironment(props as EnvironmentProps);

    const wrapClassList = computed(() => {
      return [
        {
          'nova-input': true,
          'nova-input-disabled': !!props.disabled,
          'nova-input-readonly': !!props.readonly,
        },
        props.wrapClass,
      ];
    });

    const classList = computed(() => {
      return ['nova-input-text', props.class];
    });

    return (): JSX.Element => {
      return (
        <div
          class={wrapClassList.value}
          style={props.wrapStyle}
          data-nova-theme={environment.themeRef.value}
        >
          <input
            type="text"
            class={classList.value}
            {...context.attrs}
            disabled={!!props.disabled}
            readonly={!!props.readonly}
          />
          <div class="nova-input-border" />
        </div>
      );
    };
  },
};

export const NovaInput = (NovaInputImpl as unknown) as {
  new (): {
    $props: VNodeProps & InputProps & InputHTMLAttributes & VueComponentProps;
  };
};
