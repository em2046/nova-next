import {
  computed,
  ComputedRef,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  Ref,
} from 'vue';
import DomUtils from '../utils/dom-utils';
import { VisualViewport } from '../shims/visual-viewport';
import Geometry from '../utils/geometry';

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
  offset: {
    left: number;
    top: number;
  };
}

interface DropdownProps {
  disabled: boolean;
}

type DropdownStyle = ComputedRef<{ left: string; top: string }>;

interface UseDropdownReturn {
  dropdownStyle: DropdownStyle;
  dropdown: Dropdown;
}

interface Offset {
  left: number;
  top: number;
}

interface OffsetParams {
  triggerRect: DOMRect;
  dropdownRect: DOMRect;
  visualViewport: VisualViewport;
}

interface StyleParams extends OffsetParams {
  offset: Offset;
}

export default function useDropdown(
  params: UseDropdownParams
): UseDropdownReturn {
  const state = reactive({
    dropdown: {
      loaded: false,
      opened: false,
      offset: {
        left: 0,
        top: 0,
      },
      style: {},
    },
  });

  const { triggerRef, dropdownRef, props, onOpen, onClose } = params;
  const dropdownProps = props as DropdownProps;

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
    if (dropdownProps.disabled) {
      return;
    }

    const trigger = triggerRef.value as HTMLElement;
    const dropdown = dropdownRef.value as HTMLElement;
    if (trigger && dropdown) {
      const triggerRect = DomUtils.getElementPosition(trigger);
      const dropdownRect = DomUtils.getElementPosition(dropdown);
      const visualViewport: VisualViewport = DomUtils.getVisualViewport();

      const styleBefore = getThumbStyle({
        offset: state.dropdown.offset,
        triggerRect,
        dropdownRect,
        visualViewport,
      });

      state.dropdown.style = Object.assign({}, styleBefore, getTransition());
    }

    document.removeEventListener('mousedown', onVirtualMaskMousedown);
    const openedOld = state.dropdown.opened;
    state.dropdown.opened = false;

    if (openedOld) {
      onClose && onClose.call(null);
    }
  }

  function getOffset(params: OffsetParams) {
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

  function getThumbStyle(params: StyleParams) {
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

    let dropdownInitHeight = triggerRect.height;
    if (heightProportion) {
      dropdownInitHeight =
        (triggerRect.width * widthProportion) / heightProportion;
    }

    const [x, y] = Geometry.lineLineIntersection(
      triggerRect.left,
      triggerRect.top,
      offset.left,
      offset.top,
      triggerRect.right,
      triggerRect.top + dropdownInitHeight,
      dropdownRect.width + offset.left,
      dropdownRect.height + offset.top
    );

    const originX = x - offset.left + pageLeft;
    const originY = y - offset.top + pageTop;

    return {
      opacity: `0`,
      transform: `scale(${widthProportion})`,
      transformOrigin: `${originX}px ${originY}px`,
      pointerEvents: `none`,
    };
  }

  function getFullStyle() {
    return {
      opacity: `1`,
      transform: `scale(1)`,
      pointerEvents: `unset`,
    };
  }

  function getTransition() {
    return {
      transition: `transform 200ms linear, opacity 200ms linear`,
    };
  }

  function resetStyle() {
    state.dropdown.style = {};
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
    resetStyle();

    await nextTick();

    const trigger = triggerRef.value as HTMLElement;
    const triggerRect = DomUtils.getElementPosition(trigger);

    const dropdown = dropdownRef.value as HTMLElement;
    const dropdownRect = DomUtils.getElementPosition(dropdown);

    const visualViewport: VisualViewport = DomUtils.getVisualViewport();

    const offset = getOffset({
      triggerRect,
      dropdownRect,
      visualViewport,
    });

    const styleBefore = getThumbStyle({
      offset,
      triggerRect,
      dropdownRect,
      visualViewport,
    });

    state.dropdown.offset = offset;
    state.dropdown.style = styleBefore;

    setTimeout(() => {
      const styleAfter = getFullStyle();
      state.dropdown.style = Object.assign(
        {},
        styleBefore,
        styleAfter,
        getTransition()
      );
    });

    if (!openedOld) {
      onOpen && onOpen.call(null);
    }
  }

  function toggleDropdown(): void {
    const opened = state.dropdown.opened;
    if (opened) {
      closeDropdown();
    } else {
      openDropdown();
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

  const dropdownStyle = computed(() => {
    const offset = state.dropdown.offset;
    const style = state.dropdown.style;

    return {
      left: `${offset.left}px`,
      top: `${offset.top}px`,
      ...style,
    };
  });

  return {
    dropdownStyle,
    dropdown: state.dropdown,
  };
}
