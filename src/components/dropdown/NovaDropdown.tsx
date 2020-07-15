import { vueJsxCompat } from '../../vue-jsx-compat';
import {
  computed,
  CSSProperties,
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
  Environment,
  NovaEnvironmentProps,
} from '../../uses/use-environment';
import useDropdown, { durationLong } from '../../uses/use-dropdown';
import DomUtils from '../../utils/dom-utils';

export interface NovaDropdownProps extends NovaEnvironmentProps {
  disabled?: boolean;
  dropdownClass?: unknown;
  dropdownStyle?: string | CSSProperties;
  dropdownProps?: {
    [key: string]: unknown;
  };
  teleportToBody?: boolean;
  environment?: Environment;
}

export interface NovaDropdownTriggerScoped {
  disabled: boolean;
}

export const dropdownProps = {
  disabled: {
    type: Boolean,
    default: false,
  },
  dropdownClass: {
    type: [String, Array, Object],
    default: null,
  },
  dropdownStyle: {
    type: Object,
    default: null,
  },
  dropdownProps: {
    type: Object,
    default: null,
  },
  teleportToBody: {
    type: Boolean,
    default: true,
  },
  environment: {
    type: Object,
    default: null,
  },
};

const NovaDropdownImpl = {
  name: 'NovaDropdown',
  props: dropdownProps,
  setup(props: NovaDropdownProps, context: SetupContext) {
    const { emit, slots } = context;

    let trapped = false;

    const environment =
      props.environment ?? useEnvironment(props as NovaEnvironmentProps);

    const triggerRef: Ref<HTMLElement | null> = ref(null);
    const dropdownRef: Ref<HTMLElement | null> = ref(null);
    const autoFocusRef: Ref<HTMLElement | null> = ref(null);
    const trapHeaderRef: Ref<HTMLElement | null> = ref(null);
    const trapTrailerRef: Ref<HTMLElement | null> = ref(null);

    function trapHeaderFocus() {
      const focusable = DomUtils.getFocusable(dropdownRef.value);
      nextFocus(focusable[focusable.length - 1]);
    }

    function trapTrailerFocus() {
      const focusable = DomUtils.getFocusable(dropdownRef.value);
      nextFocus(focusable[0]);
    }

    function nextFocus(target: HTMLElement | null) {
      if (trapped) {
        return;
      }

      trapped = true;
      target?.focus();

      requestAnimationFrame(() => {
        trapped = false;
      });
    }

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
      closeDropdown,
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
      const slotTrigger = slots.trigger;

      let slotTriggerNode: VNode[] | null = null;
      if (slotTrigger) {
        slotTriggerNode = slotTrigger({
          closeDropdown,
        });
      }

      function createTrigger() {
        return (
          <div
            ref={triggerRef}
            class="nova-dropdown-trigger"
            tabindex={props.disabled ? -1 : 0}
          >
            {slotTriggerNode}
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
            style={props.dropdownStyle}
            {...props.dropdownProps}
          >
            <div
              class="nova-trap"
              data-nova-trap="header"
              tabindex={0}
              ref={trapHeaderRef}
              onFocus={trapHeaderFocus}
            />
            <div
              class="nova-trap"
              data-nova-trap="trailer"
              tabindex={0}
              ref={trapTrailerRef}
              onFocus={trapTrailerFocus}
            />
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
        <div
          class={classList.value}
          data-nova-theme={environment.themeRef.value}
        >
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
