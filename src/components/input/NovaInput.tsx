import { computed, defineComponent } from 'vue';
import { vueJsxCompat } from '../../vue-jsx-compat';
import useEnvironment, {
  EnvironmentProps,
  environmentProps,
} from '../../uses/use-environment';

export default defineComponent({
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
  setup(props, context) {
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
});
