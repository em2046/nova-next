import { nextTick, onBeforeUnmount, onMounted, reactive, Ref } from 'vue';
import DomUtils from '../utils/dom-utils';
import { VisualViewport } from '../shims/visual-viewport';

interface UseDropdownParams {
  triggerRef: Ref<HTMLElement | null>;
  dropdownRef: Ref<HTMLElement | null>;
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
}

interface UseDropdownReturn {
  dropdown: Dropdown;
  onBeforeEnter: (el: Element) => void;
  onAfterEnter: (el: Element) => void;
  onBeforeLeave: (el: Element) => void;
  onAfterLeave: (el: Element) => void;
  onLeaveCancelled: (el: Element) => void;
}

interface Offset {
  left: number;
  top: number;
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

  const { triggerRef, dropdownRef, props, onOpen, onClose } = params;
  const dropdownProps = props as DropdownProps;
  let collapseStyleCache: CollapseStyle | null = null;

  function onVirtualMaskMousedown(e: MouseEvent): void {
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
  }

  function getDropdownOffset(params: GetDropdownOffsetParams) {
    const { triggerRect, dropdownRect, visualViewport } = params;

    const viewportWidth = visualViewport.width;
    const viewportHeight = visualViewport.height;
    const pageLeft = visualViewport.pageLeft;
    const pageTop = visualViewport.pageTop;

    let leftWithPageLeft = triggerRect.left + pageLeft;
    let topWithPageTop = triggerRect.top + triggerRect.height + pageTop;

    const right = triggerRect.left + dropdownRect.width;
    const bottom = triggerRect.bottom + dropdownRect.height;

    if (right > viewportWidth) {
      leftWithPageLeft = viewportWidth + pageLeft - dropdownRect.width;
    }
    if (leftWithPageLeft < pageLeft) {
      leftWithPageLeft = pageLeft;
    }

    if (bottom > viewportHeight) {
      topWithPageTop = triggerRect.top + pageTop - dropdownRect.height;
    }
    if (topWithPageTop < pageTop) {
      topWithPageTop = pageTop;
    }

    return {
      left: leftWithPageLeft,
      top: topWithPageTop,
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

  async function openDropdown(): Promise<void> {
    if (dropdownProps.disabled) {
      return;
    }

    if (!state.dropdown.loaded) {
      state.dropdown.loaded = true;
    }

    document.addEventListener('mousedown', onVirtualMaskMousedown);
    const openedOld = state.dropdown.opened;
    state.dropdown.opened = true;

    if (!openedOld) {
      onOpen?.call(null);
    }
  }

  function toggleDropdown(): void {
    const opened = state.dropdown.opened;
    if (opened) {
      closeDropdown();
    } else {
      openDropdown().then(() => {
        // do nothing
      });
    }
  }

  onMounted(() => {
    const trigger = triggerRef.value as HTMLElement;
    trigger.addEventListener('click', toggleDropdown);
  });

  onBeforeUnmount(() => {
    closeDropdown();

    const trigger = triggerRef.value as HTMLElement;
    trigger.removeEventListener('click', toggleDropdown);
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
    onBeforeEnter,
    onAfterEnter,
    onBeforeLeave,
    onAfterLeave,
    onLeaveCancelled,
  };
}
