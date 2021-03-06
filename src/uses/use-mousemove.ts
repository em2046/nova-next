import { onBeforeUnmount, onMounted, reactive } from 'vue';
import { MoveParams } from './use-move';
import { getPaddingLeft, getPaddingTop } from '../utils/dom';

export interface MouseState {
  moving: boolean;
  holding: boolean;
}

interface MouseReturn {
  mouse: MouseState;
}

export function useMousemove(params: MoveParams): MouseReturn {
  const { ref, start, move, finish } = params;

  let rect = {} as DOMRect;
  const border = { top: 0, left: 0 };

  const state = reactive({
    mouse: {
      moving: false,
      holding: false,
    },
  });

  function onMousemove(e: MouseEvent): void {
    e.preventDefault();

    if (state.mouse.moving) {
      return;
    }

    state.mouse.moving = true;
    requestAnimationFrame(() => {
      state.mouse.moving = false;
    });

    const x = e.pageX - rect.x - window.pageXOffset - border.left;
    const y = e.pageY - rect.y - window.pageYOffset - border.top;

    move?.call(null, { x, y });
  }

  function onMouseup(): void {
    state.mouse.holding = false;

    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('mouseup', onMouseup);

    finish?.call(null);
  }

  function onMousedown(e: MouseEvent): void {
    e.preventDefault();

    state.mouse.holding = true;

    const target: HTMLElement = ref.value as HTMLElement;
    rect = target.getBoundingClientRect();
    border.left = getPaddingLeft(target);
    border.top = getPaddingTop(target);

    const rectX = rect.x ?? 0;
    const rectY = rect.y ?? 0;
    const x = e.pageX - rectX - window.pageXOffset - border.left;
    const y = e.pageY - rectY - window.pageYOffset - border.top;

    start?.call(null);
    move?.call(null, { x, y });

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup);
  }

  onMounted(() => {
    const target: HTMLElement = ref.value as HTMLElement;
    target.addEventListener('mousedown', onMousedown);
  });

  onBeforeUnmount(() => {
    const target: HTMLElement = ref.value as HTMLElement;
    target.removeEventListener('mousedown', onMousedown);
    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('mouseup', onMouseup);
  });

  return {
    mouse: state.mouse,
  };
}
