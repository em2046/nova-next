import { onBeforeUnmount, onMounted, Ref } from 'vue';

interface Position {
  x: number;
  y: number;
}

interface UseMousemoveParams {
  ref: Ref<null>;
  start?: () => void;
  move?: (position: Position) => void;
  finish?: () => void;
}

export default function useMousemove(options: UseMousemoveParams): void {
  const { ref, start, move, finish } = options;

  let rect = {} as DOMRect;
  let moving = false;

  function onMousemove(e: MouseEvent): void {
    if (moving) {
      return;
    }
    moving = true;
    requestAnimationFrame(() => {
      moving = false;
    });

    const x = e.pageX - rect.x - window.pageXOffset;
    const y = e.pageY - rect.y - window.pageYOffset;

    move && move.call(null, { x, y });
  }

  function onMouseup(): void {
    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('mouseup', onMouseup);

    finish && finish.call(null);
  }

  function onMousedown(e: MouseEvent): void {
    const target: HTMLElement = (ref.value as unknown) as HTMLElement;
    rect = target.getBoundingClientRect();

    const x = e.offsetX;
    const y = e.offsetY;

    start && start.call(null);
    move && move.call(null, { x, y });

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup);
  }

  onMounted(() => {
    const target: HTMLElement = (ref.value as unknown) as HTMLElement;
    target.addEventListener('mousedown', onMousedown);
  });

  onBeforeUnmount(() => {
    const target: HTMLElement = (ref.value as unknown) as HTMLElement;
    target.removeEventListener('mousedown', onMousedown);
    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('mouseup', onMouseup);
  });
}
