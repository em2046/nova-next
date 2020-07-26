import { vueJsxCompat } from '../../vue-jsx-compat';
import {
  computed,
  HTMLAttributes,
  ref,
  Ref,
  SetupContext,
  Teleport,
  Transition,
  VNode,
  VNodeProps,
  vShow,
  watch,
  withDirectives,
} from 'vue';
import { Environment, useEnvironment } from '../../uses/use-environment';
import { durationLong, useDropdown } from '../../uses/use-dropdown';
import { VueComponentProps } from '../../types/vue-component';
import { EnvironmentProps } from '../environment/NovaEnvironment';
import { Placement, VueClass, VueProps, VueStyle } from '../../types/props';
import { getFocusable } from '../../utils/dom';

export interface DropdownProps extends EnvironmentProps {
  disabled?: boolean;
  dropdownClass?: VueClass;
  dropdownStyle?: VueStyle;
  dropdownProps?: VueProps;
  teleportToBody?: boolean;
  environment?: Environment;
  placement?: Placement;
  onOpenChange?: (open: boolean) => void;
}

export interface DropdownInstance {
  close: () => void;
}

export interface DropdownTriggerScoped {
  disabled: boolean;
  dropdownInstance: DropdownInstance;
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
  placement: {
    type: String,
    default: 'bottomLeft',
  },
};

const NovaDropdownImpl = {
  name: 'NovaDropdown',
  props: dropdownProps,
  setup(props: DropdownProps, context: SetupContext) {
    const { emit, slots } = context;

    let trapped = false;

    const environment =
      props.environment ?? useEnvironment(props as EnvironmentProps);

    const triggerRef: Ref<HTMLElement | null> = ref(null);
    const dropdownRef: Ref<HTMLElement | null> = ref(null);
    const trapHeaderRef: Ref<HTMLElement | null> = ref(null);
    const trapHiddenRef: Ref<HTMLElement | null> = ref(null);
    const trapTrailerRef: Ref<HTMLElement | null> = ref(null);

    function trapHeaderFocus() {
      const focusable = getFocusable(dropdownRef.value);
      nextFocus(focusable?.[focusable.length - 1]);
    }

    function trapTrailerFocus() {
      const focusable = getFocusable(dropdownRef.value);
      nextFocus(focusable?.[0]);
    }

    function nextFocus(target: HTMLElement | undefined) {
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
    const panelClassList = computed(() => {
      return ['nova-dropdown-panel', props.dropdownClass];
    });

    const {
      dropdown,
      close,
      onBeforeEnter,
      onAfterEnter,
      onBeforeLeave,
      onAfterLeave,
      onLeaveCancelled,
    } = useDropdown({
      triggerRef,
      dropdownRef,
      trapHiddenRef,
      props,
      onOpen: () => {
        emit('openChange', true);
      },
      onClose: () => {
        emit('openChange', false);
      },
    });

    // TODO Find another way to communicate parent and child components
    const dropdownInstance: DropdownInstance = {
      close,
    };

    watch(
      () => props.disabled,
      (value) => {
        if (value) {
          dropdown.loaded = false;
          dropdown.opened = false;
        }
      }
    );

    return () => {
      const children = slots.default?.();
      const slotTrigger = slots.trigger;

      let slotTriggerNode: VNode[] | null = null;
      if (slotTrigger) {
        slotTriggerNode = slotTrigger({
          dropdownInstance,
        });
      }

      function createTrigger() {
        return (
          <div ref={triggerRef} class="nova-dropdown-trigger">
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
            class={panelClassList.value}
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
            {children}
            <div class="nova-trap" ref={trapHiddenRef} tabindex={0} />
            <div
              class="nova-trap"
              data-nova-trap="trailer"
              tabindex={0}
              ref={trapTrailerRef}
              onFocus={trapTrailerFocus}
            />
            <div class="nova-dropdown-panel-border" />
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
    $props: VNodeProps & DropdownProps & HTMLAttributes & VueComponentProps;
  };
};
