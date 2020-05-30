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

interface UseDropdownParams {
  triggerRef: Ref<HTMLElement | null>;
  dropdownRef: Ref<HTMLElement | null>;
  props: Readonly<unknown>;
  onOpen?: () => void;
  onClose?: () => void;
}

interface Dropdown {
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

export default function useDropdown(
  params: UseDropdownParams
): UseDropdownReturn {
  const state = reactive({
    dropdown: {
      opened: false,
      offset: {
        left: 0,
        top: 0,
      },
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

    document.removeEventListener('mousedown', onVirtualMaskMousedown);
    const openedOld = state.dropdown.opened;
    state.dropdown.opened = false;

    if (openedOld) {
      onClose && onClose.call(null);
    }
  }

  function getOffset() {
    const trigger = triggerRef.value as HTMLElement;
    const triggerRect = DomUtils.getElementPosition(trigger);

    const dropdown = dropdownRef.value as HTMLElement;
    const dropdownRect = DomUtils.getElementPosition(dropdown);

    const visualViewport: VisualViewport = DomUtils.getVisualViewport();
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

  async function openDropdown(): Promise<void> {
    if (dropdownProps.disabled) {
      return;
    }

    document.addEventListener('mousedown', onVirtualMaskMousedown);
    const openedOld = state.dropdown.opened;
    state.dropdown.opened = true;

    await nextTick();
    state.dropdown.offset = getOffset();

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
    return {
      left: `${offset.left}px`,
      top: `${offset.top}px`,
    };
  });

  return {
    dropdownStyle,
    dropdown: state.dropdown,
  };
}
