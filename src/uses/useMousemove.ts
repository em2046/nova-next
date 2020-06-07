import { onBeforeUnmount, onMounted } from 'vue';
import DomUtils from '../utils/dom-utils';
import { MoveParams } from './useMove';

export default function useMousemove(params: MoveParams): void {
  const { ref, start, move, finish } = params;

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

    move?.call(null, { x, y });
  }

  function onMouseup(): void {
    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('mouseup', onMouseup);

    finish?.call(null);
  }

  function onMousedown(e: MouseEvent): void {
    const target: HTMLElement = ref.value as HTMLElement;
    rect = target.getBoundingClientRect();
    border.left = DomUtils.getPaddingLeft(target);
    border.top = DomUtils.getPaddingTop(target);

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
}
