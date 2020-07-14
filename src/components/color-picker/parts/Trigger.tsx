import { computed, onMounted, ref, Ref, SetupContext, VNodeProps } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import Color from '../color';

export interface TriggerProps {
  color: Color;
  disabled: boolean;
  onAssignRef?: (ref: Ref<HTMLElement | null>) => void;
}

const TriggerImpl = {
  name: 'Trigger',
  props: {
    color: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  setup(props: TriggerProps, context: SetupContext) {
    const emit = context.emit;
    const slots = context.slots;

    const triggerRef = ref(null);

    const triggerInnerStyle = computed(() => {
      return {
        backgroundColor: props.color.toCssRgbaString(),
      };
    });

    onMounted(() => {
      emit('assignRef', triggerRef);
    });

    return (): JSX.Element => {
      const defaultTrigger = (
        <div class="nova-color-picker-trigger-inner">
          <div
            class="nova-color-picker-trigger-bg"
            style={triggerInnerStyle.value}
          />
        </div>
      );

      let triggerInner = defaultTrigger;
      const children = slots.default;
      if (children) {
        triggerInner = children();
      }

      return (
        <div
          class="nova-color-picker-trigger"
          ref={triggerRef}
          tabindex={props.disabled ? -1 : 0}
        >
          {triggerInner}
        </div>
      );
    };
  },
};

export const Trigger = (TriggerImpl as unknown) as {
  new (): {
    $props: VNodeProps & TriggerProps;
  };
};
