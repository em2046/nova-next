import {
  onMounted,
  onBeforeUnmount,
  Ref,
  reactive,
  computed,
  ComputedRef,
} from 'vue';
import DomHelper from '../utils/dom-helper';

interface UseDropdownParams {
  triggerRef: Ref<null>;
  dropdownRef: Ref<null>;
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

type DropdownStyle = ComputedRef<{ left: string; top: string }>;

interface UseDropdownReturn {
  dropdownStyle: DropdownStyle;
  dropdown: Dropdown;
}

export default function useDropdown(
  options: UseDropdownParams
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

  const { triggerRef, dropdownRef, onOpen, onClose } = options;

  function onVirtualMaskMousedown(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const dropdown = (dropdownRef.value as unknown) as HTMLElement;
    const stopDropdown = DomHelper.isInElement(target, dropdown);
    const trigger = (triggerRef.value as unknown) as HTMLElement;
    const stopTrigger = DomHelper.isInElement(target, trigger);

    if (stopDropdown || stopTrigger) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    closeDropdown();
  }

  function closeDropdown(): void {
    document.removeEventListener('mousedown', onVirtualMaskMousedown);
    state.dropdown.opened = false;
    onClose && onClose.call(null);
  }

  function openDropdown(): void {
    document.addEventListener('mousedown', onVirtualMaskMousedown);
    state.dropdown.opened = true;
    const trigger = (triggerRef.value as unknown) as HTMLElement;
    const rect = DomHelper.getElementPosition(trigger);
    state.dropdown.offset.left = rect.left;
    state.dropdown.offset.top = rect.top + rect.height;
    onOpen && onOpen.call(null);
  }

  onMounted(() => {
    const trigger = (triggerRef.value as unknown) as HTMLElement;
    trigger.addEventListener('click', openDropdown);
  });

  onBeforeUnmount(() => {
    closeDropdown();
    const trigger = (triggerRef.value as unknown) as HTMLElement;
    trigger.removeEventListener('click', openDropdown);
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
