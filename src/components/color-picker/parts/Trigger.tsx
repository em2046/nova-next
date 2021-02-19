import { computed, onMounted, ref, Ref, SetupContext, VNodeProps } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import { Color } from '../color';
import { Environment } from '../../../uses/use-environment';

export interface TriggerProps {
  color: Color;
  disabled: boolean;
  environment: Environment;
  onAssignRef: (ref: Ref<HTMLElement | null>) => void;
}

const TriggerImpl = {
  name: 'Trigger',
  emits: ['assignRef'],
  props: {
    color: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    environment: {
      type: Object,
      required: true,
    },
  },
  setup(props: TriggerProps, context: SetupContext) {
    const { slots, emit } = context;

    const triggerRef: Ref<HTMLElement | null> = ref(null);

    const triggerInnerStyle = computed(() => {
      return {
        backgroundColor: props.color.toCssRgbaString(),
      };
    });

    onMounted(() => {
      emit('assignRef', triggerRef);
    });

    return (): JSX.Element => {
      const language = props.environment.languageRef.value.colorPicker;

      let triggerNode = (
        <div
          ref={triggerRef}
          class="nova-color-picker-trigger"
          role="button"
          aria-label={language.aria.trigger}
          tabindex={props.disabled ? -1 : 0}
        >
          <div class="nova-color-picker-trigger-inner">
            <div
              class="nova-color-picker-trigger-bg"
              style={triggerInnerStyle.value}
            />
          </div>
        </div>
      );
      const children = slots.default;
      if (children) {
        triggerNode = children();
      }

      return triggerNode;
    };
  },
};

export const Trigger = (TriggerImpl as unknown) as {
  new (): {
    $props: VNodeProps & TriggerProps;
  };
};
