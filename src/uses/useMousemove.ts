import { onBeforeUnmount, onMounted, Ref } from 'vue';
import DomUtils from '../utils/dom-utils';

export interface MousePosition {
  x: number;
  y: number;
}

interface UseMousemoveParams {
  ref: Ref<HTMLElement | null>;
  start?: () => void;
  move?: (position: MousePosition) => void;
  finish?: () => void;
}

export default function useMousemove(options: UseMousemoveParams): void {
  const { ref, start, move, finish } = options;

  let rect = {} as DOMRect;
  const border = { top: 0, left: 0 };
  let moving = false;

  function onMousemove(e: MouseEvent): void {
    if (moving) {
      return;
    }

    moving = true;
    requestAnimationFrame(() => {
      moving = false;
    });

    const x = e.pageX - rect.x - window.pageXOffset - border.left;
    const y = e.pageY - rect.y - window.pageYOffset - border.top;

    move && move.call(null, { x, y });
  }

  function onMouseup(): void {
    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('mouseup', onMouseup);

    finish && finish.call(null);
  }

  function onMousedown(e: MouseEvent): void {
    const target: HTMLElement = ref.value as HTMLElement;
    rect = target.getBoundingClientRect();
    border.left = DomUtils.getPaddingLeft(target);
    border.top = DomUtils.getPaddingTop(target);

    const x = e.pageX - rect.x - window.pageXOffset - border.left;
    const y = e.pageY - rect.y - window.pageYOffset - border.top;

    start && start.call(null);
    move && move.call(null, { x, y });

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
}
