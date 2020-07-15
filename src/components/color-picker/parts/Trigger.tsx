import { computed, SetupContext, VNodeProps } from 'vue';
import { vueJsxCompat } from '../../../vue-jsx-compat';
import Color from '../color';

export interface TriggerProps {
  color: Color;
  disabled: boolean;
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
    const slots = context.slots;

    const triggerInnerStyle = computed(() => {
      return {
        backgroundColor: props.color.toCssRgbaString(),
      };
    });

    return (): JSX.Element => {
      let triggerInner = (
        <div class="nova-color-picker-trigger-inner">
          <div
            class="nova-color-picker-trigger-bg"
            style={triggerInnerStyle.value}
          />
        </div>
      );
      const children = slots.default;
      if (children) {
        triggerInner = children();
      }

      return triggerInner;
    };
  },
};

export const Trigger = (TriggerImpl as unknown) as {
  new (): {
    $props: VNodeProps & TriggerProps;
  };
};
