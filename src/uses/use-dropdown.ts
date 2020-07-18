import { nextTick, onBeforeUnmount, onMounted, reactive, Ref } from 'vue';
import DomUtils from '../utils/dom-utils';
import { VisualViewport } from '../shims/visual-viewport';
import { Placement } from '../components/dropdown/NovaDropdown';
import { Offset, place } from '../utils/place';

interface UseDropdownParams {
  triggerRef: Ref<HTMLElement | null>;
  dropdownRef: Ref<HTMLElement | null>;
  reset?: () => void;
  props: Readonly<unknown>;
  onOpen?: () => void;
  onClose?: () => void;
}

interface Dropdown {
  loaded: boolean;
  opened: boolean;
}

interface DropdownProps {
  disabled: boolean;
  placement: Placement;
}

interface UseDropdownReturn {
  dropdown: Dropdown;
  close: () => void;
  onBeforeEnter: (el: Element) => void;
  onAfterEnter: (el: Element) => void;
  onBeforeLeave: (el: Element) => void;
  onAfterLeave: (el: Element) => void;
  onLeaveCancelled: (el: Element) => void;
}

interface GetDropdownOffsetParams {
  triggerRect: DOMRect;
  dropdownRect: DOMRect;
  visualViewport: VisualViewport;
}

interface GetCollapseStyleParams extends GetDropdownOffsetParams {
  offset: Offset;
}

interface CollapseStyle {
  opacity: string;
  transform: string;
  pointerEvents: string;
}

type TriggerType = 'mouse' | 'keyboard' | null;

export const durationLong = 300;

export default function useDropdown(
  params: UseDropdownParams
): UseDropdownReturn {
  const state = reactive({
    dropdown: {
      loaded: false,
      opened: false,
    },
  });

  let triggerType: TriggerType;

  const { triggerRef, dropdownRef, reset, props, onOpen, onClose } = params;
  const dropdownProps = props as DropdownProps;
  let collapseStyleCache: CollapseStyle | null = null;

  function onVirtualMaskMousedown(e: MouseEvent): void {
    triggerType = 'mouse';

    if (dropdownProps.disabled) {
      return;
    }

    const target = e.target as HTMLElement;
    const dropdown = dropdownRef.value as HTMLElement;
    const stopDropdown = DomUtils.isInElement(target, dropdown);
    const trigger = triggerRef.value as HTMLElement;
    const stopTrigger = DomUtils.isInElement(target, trigger);

    if (stopDropdown || stopTrigger) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    closeDropdown();
  }

  function triggerFocus() {
    const trigger = triggerRef.value as HTMLElement;
    const focusable = DomUtils.getFocusable(trigger);
    const firstFocusable = focusable?.[0];
    firstFocusable?.focus();
  }

  function closeDropdown(): void {
    document.removeEventListener('mousedown', onVirtualMaskMousedown);

    if (dropdownProps.disabled) {
      return;
    }

    const prevOpened = state.dropdown.opened;
    state.dropdown.opened = false;

    if (prevOpened) {
      onClose?.call(null);
    }

    if (triggerType === 'keyboard') {
      triggerFocus();
    }

    triggerType = null;
  }

  function getDropdownOffset(params: GetDropdownOffsetParams) {
    const { triggerRect, dropdownRect, visualViewport } = params;

    const placement = dropdownProps.placement;

    const { left, top } = place(
      triggerRect,
      dropdownRect,
      visualViewport,
      placement
    );

    return {
      left: left,
      top: top,
    };
  }

  function getCollapseStyle(params: GetCollapseStyleParams): CollapseStyle {
    const { offset, triggerRect, dropdownRect, visualViewport } = params;

    const pageLeft = visualViewport.pageLeft;
    const pageTop = visualViewport.pageTop;

    let widthProportion = 1;
    if (dropdownRect.width) {
      widthProportion = triggerRect.width / dropdownRect.width;
    }
    let heightProportion = 1;
    if (dropdownRect.height) {
      heightProportion = triggerRect.height / dropdownRect.height;
    }

    const dropdownXCenter = dropdownRect.width / 2 + offset.left;
    const triggerXCenter = pageLeft + triggerRect.left + triggerRect.width / 2;
    const dropdownYCenter = dropdownRect.height / 2 + offset.top;
    const triggerYCenter = pageTop + triggerRect.top + triggerRect.height / 2;

    const translateX = triggerXCenter - dropdownXCenter;
    const translateY = triggerYCenter - dropdownYCenter;

    return {
      opacity: `0`,
      transform: `translate(${translateX}px, ${translateY}px) scale(${widthProportion}, ${heightProportion}) `,
      pointerEvents: `none`,
    };
  }

  function getExpandStyle() {
    return {
      opacity: `1`,
      transform: `translate(0, 0) scale(1)`,
    };
  }

  function getTransitionStyle() {
    return {
      transition: `transform ${durationLong}ms var(--nova-cubic-bezier-out-cubic), opacity ${durationLong}ms var(--nova-cubic-bezier-out-cubic)`,
    };
  }

  function resetStyle(el: Element | HTMLElement) {
    DomUtils.setStyles(el as HTMLElement, {
      left: '',
      top: '',
      opacity: '',
      transform: '',
      pointerEvents: '',
      transition: '',
    });
  }

  function openDropdown() {
    if (dropdownProps.disabled) {
      return;
    }

    if (!state.dropdown.loaded) {
      state.dropdown.loaded = true;

      nextTick(() => {
        const dropdown = dropdownRef.value as HTMLElement;
        dropdown.addEventListener('keydown', triggerKeydown);
      });
    }

    document.addEventListener('mousedown', onVirtualMaskMousedown);
    const openedOld = state.dropdown.opened;
    state.dropdown.opened = true;

    if (!openedOld) {
      onOpen?.call(null);
    }
  }

  function triggerClick() {
    toggleDropdown();
  }

  function toggleDropdown(): void {
    const opened = state.dropdown.opened;
    if (opened) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  function triggerKeydown(e: KeyboardEvent) {
    if (dropdownProps.disabled) {
      return;
    }

    switch (e.key) {
      case 'Enter':
        triggerType = 'keyboard';
        toggleDropdown();
        e.preventDefault();
        break;
      case 'Esc':
      case 'Escape':
        reset?.();
        nextTick(() => {
          triggerType = 'keyboard';
          closeDropdown();
        });
        break;
    }
  }

  onMounted(() => {
    const trigger = triggerRef.value as HTMLElement;
    trigger.addEventListener('click', triggerClick);
    trigger.addEventListener('keydown', triggerKeydown);
  });

  onBeforeUnmount(() => {
    closeDropdown();

    const trigger = triggerRef.value as HTMLElement;
    trigger.removeEventListener('click', triggerClick);
    trigger.removeEventListener('keydown', triggerKeydown);
  });

  function getOffsetStyle(offset: Offset) {
    return {
      left: `${offset.left}px`,
      top: `${offset.top}px`,
    };
  }

  async function onBeforeEnter(el: Element) {
    await nextTick();

    const trigger = triggerRef.value as HTMLElement;
    const triggerRect = DomUtils.getElementPosition(trigger);

    const dropdown = dropdownRef.value as HTMLElement;
    const dropdownRect = DomUtils.getElementPosition(dropdown);

    const visualViewport: VisualViewport = DomUtils.getVisualViewport();

    const params = {
      triggerRect,
      dropdownRect,
      visualViewport,
    };
    const offset = getDropdownOffset(params);
    const collapseStyle = getCollapseStyle({ offset, ...params });

    collapseStyleCache = collapseStyle;

    const offsetStyle = getOffsetStyle(offset);

    DomUtils.setStyles(
      el as HTMLElement,
      Object.assign({}, offsetStyle, collapseStyle)
    );

    requestAnimationFrame(() => {
      const style = Object.assign({}, getExpandStyle(), getTransitionStyle());
      DomUtils.setStyles(el as HTMLElement, style);
    });
  }

  function onAfterEnter(el: Element) {
    DomUtils.setStyles(el as HTMLElement, {
      pointerEvents: '',
    });

    if (!DomUtils.isTouchSupported()) {
      nextTick(() => {
        const focusable = DomUtils.getFocusable(el as HTMLElement);
        const firstFocusable = focusable?.[0];
        firstFocusable?.focus();
      });
    }
  }

  function onBeforeLeave(el: Element) {
    const style = Object.assign({}, collapseStyleCache, getTransitionStyle());
    DomUtils.setStyles(el as HTMLElement, style);
  }

  function onAfterLeave(el: Element) {
    resetStyle(el);
  }

  function onLeaveCancelled(el: Element) {
    resetStyle(el);
  }

  return {
    dropdown: state.dropdown,
    close: closeDropdown,
    onBeforeEnter,
    onAfterEnter,
    onBeforeLeave,
    onAfterLeave,
    onLeaveCancelled,
  };
}
