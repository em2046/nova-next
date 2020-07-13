import { vueJsxCompat } from '../../vue-jsx-compat';
import {
  computed,
  ref,
  Ref,
  SetupContext,
  Teleport,
  Transition,
  VNode,
  VNodeProps,
  vShow,
  withDirectives,
} from 'vue';
import useEnvironment, {
  NovaEnvironmentProps,
} from '../../uses/use-environment';
import useDropdown, { durationLong } from '../../uses/use-dropdown';

export interface NovaDropdownProps extends NovaEnvironmentProps {
  disabled?: boolean;
  teleportToBody?: boolean;
}

const NovaDropdownImpl = {
  name: 'NovaDropdown',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    teleportToBody: {
      type: Boolean,
      default: true,
    },
  },
  setup(props: NovaDropdownProps, context: SetupContext) {
    const { emit, slots } = context;

    const environment = useEnvironment(props as NovaEnvironmentProps);

    const triggerRef: Ref<HTMLElement | null> = ref(null);
    const dropdownRef: Ref<HTMLElement | null> = ref(null);
    const autoFocusRef: Ref<HTMLElement | null> = ref(null);

    const classList = computed(() => {
      return [
        'nova-dropdown',
        {
          ['nova-dropdown-disabled']: props.disabled,
          ['nova-dropdown-opened']: dropdown.opened,
        },
      ];
    });

    const {
      dropdown,
      onBeforeEnter,
      onAfterEnter,
      onBeforeLeave,
      onAfterLeave,
      onLeaveCancelled,
    } = useDropdown({
      triggerRef,
      dropdownRef,
      autoFocusRef,
      props,
      onOpen: () => {
        emit('openChange', true);
      },
      onClose: () => {
        emit('openChange', false);
      },
    });

    return () => {
      const children = slots.default?.();
      const trigger = slots.trigger?.();

      function createTrigger() {
        return (
          <div ref={triggerRef} class="nova-dropdown-trigger">
            {trigger}
          </div>
        );
      }

      function createDropdown() {
        if (!dropdown.loaded || props.disabled) {
          return null;
        }

        let beforeAppearFlag = false;
        let afterAppearFlag = false;

        const dropdownCoreNode = (
          <div
            class="nova-dropdown-panel"
            role="dialog"
            data-nova-theme={environment.themeRef.value}
            ref={dropdownRef}
          >
            {children}
          </div>
        );

        function onBeforeAppear(el: Element) {
          if (beforeAppearFlag) {
            return;
          }

          beforeAppearFlag = true;
          onBeforeEnter(el);
        }

        function onAfterAppear(el: Element) {
          if (afterAppearFlag) {
            return;
          }

          afterAppearFlag = true;
          onAfterEnter(el);
        }

        return (
          <Teleport to="body" disabled={!props.teleportToBody}>
            <Transition
              name="nova-dropdown"
              duration={durationLong}
              appear
              onBeforeAppear={onBeforeAppear}
              onAfterAppear={onAfterAppear}
              onBeforeEnter={onBeforeEnter}
              onAfterEnter={onAfterEnter}
              onBeforeLeave={onBeforeLeave}
              onAfterLeave={onAfterLeave}
              onLeaveCancelled={onLeaveCancelled}
            >
              {() =>
                withDirectives(dropdownCoreNode as VNode, [
                  [vShow, dropdown.opened],
                ])
              }
            </Transition>
          </Teleport>
        );
      }

      const dropdownNode = createDropdown();
      const triggerNode = createTrigger();

      return (
        <div class={classList.value}>
          {triggerNode}
          {dropdownNode}
        </div>
      );
    };
  },
};

export const NovaDropdown = (NovaDropdownImpl as unknown) as {
  new (): {
    $props: VNodeProps & NovaDropdownProps;
  };
};
