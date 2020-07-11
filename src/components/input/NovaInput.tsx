import { computed, CSSProperties, SetupContext, VNodeProps } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import useEnvironment, {
  environmentProps,
  NovaEnvironmentProps,
} from '../../uses/use-environment';

interface NovaInputProps extends NovaEnvironmentProps {
  class?: unknown;
  wrapClass?: unknown;
  wrapStyle?: string | CSSProperties;
  disabled?: boolean;
  readonly?: boolean;
}

const NovaInputImpl = {
  name: 'NovaInput',
  inheritAttrs: false,
  props: {
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
  },
  setup(props: NovaInputProps, context: SetupContext) {
    const environment = useEnvironment(props as NovaEnvironmentProps);

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
    $props: VNodeProps & NovaInputProps;
  };
};
