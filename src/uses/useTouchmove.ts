import { onBeforeUnmount, onMounted } from 'vue';
import DomUtils from '../utils/dom-utils';
import { MoveParams } from './useMove';

export default function useTouchmove(params: MoveParams): void {
  const { ref, start, move, finish } = params;

  let rect = {} as DOMRect;
  const border = { top: 0, left: 0 };
  let moving = false;

  function onTouchmove(e: TouchEvent): void {
    if (e.cancelable) {
      e.preventDefault();
    }

    if (moving) {
      return;
    }

    const firstFinger = e.changedTouches[0];

    moving = true;
    requestAnimationFrame(() => {
      moving = false;
    });

    const x = firstFinger.pageX - rect.x - window.pageXOffset - border.left;
    const y = firstFinger.pageY - rect.y - window.pageYOffset - border.top;

    move && move.call(null, { x, y });
  }

  function onTouchend(e: TouchEvent): void {
    if (e.cancelable) {
      e.preventDefault();
    }

    const target: HTMLElement = ref.value as HTMLElement;
    target.removeEventListener('touchmove', onTouchmove);
    target.removeEventListener('touchend', onTouchend);
    target.removeEventListener('touchcancel', onTouchend);

    finish && finish.call(null);
  }

  function onTouchstart(e: TouchEvent): void {
    if (e.cancelable) {
      e.preventDefault();
    }

    const firstFinger = e.changedTouches[0];

    const target: HTMLElement = ref.value as HTMLElement;
    rect = target.getBoundingClientRect();
    border.left = DomUtils.getPaddingLeft(target);
    border.top = DomUtils.getPaddingTop(target);

    const rectX = rect.x || 0;
    const rectY = rect.y || 0;
    const x = firstFinger.pageX - rectX - window.pageXOffset - border.left;
    const y = firstFinger.pageY - rectY - window.pageYOffset - border.top;

    start && start.call(null);
    move && move.call(null, { x, y });

    target.addEventListener('touchmove', onTouchmove);
    target.addEventListener('touchend', onTouchend);
    target.addEventListener('touchcancel', onTouchend);
  }

  onMounted(() => {
    const target: HTMLElement = ref.value as HTMLElement;
    target.addEventListener('touchstart', onTouchstart);
  });

  onBeforeUnmount(() => {
    const target: HTMLElement = ref.value as HTMLElement;
    target.removeEventListener('touchstart', onTouchstart);
    target.removeEventListener('touchmove', onTouchmove);
    target.removeEventListener('touchend', onTouchend);
    target.removeEventListener('touchcancel', onTouchend);
  });
}
