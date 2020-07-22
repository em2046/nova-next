import { VisualViewport } from '../shims/visual-viewport';

const defaultSearchLimit = 1024;

export interface FunctionKeys {
  alt: boolean;
  shift: boolean;
  ctrl: boolean;
}

export const up = Symbol('up');
export const down = Symbol('down');
export type Direction = typeof up | typeof down;

export function getInputValue(target: HTMLInputElement): string {
  return target.value.trim();
}

export function setInputValue(
  target: HTMLInputElement,
  value: string | number
): void {
  target.value = value.toString();
}

export function getElementPosition(element: HTMLElement): DOMRect {
  return element.getBoundingClientRect();
}

export function isInElement(
  departure: HTMLElement,
  destination: HTMLElement,
  searchLimit = defaultSearchLimit
): boolean {
  let currElement: HTMLElement | null = departure;
  for (let i = 0; i < searchLimit; i++) {
    if (currElement === destination) {
      return true;
    }
    if (!currElement) {
      return false;
    }
    currElement = currElement.parentElement;
  }

  return false;
}

export function getStyleOf(element: HTMLElement, prop: string): string {
  return getComputedStyle(element).getPropertyValue(prop);
}

export function getPixelNumber(pixel: string): number {
  if (!pixel) {
    return 0;
  }

  if (pixel.indexOf('px') !== pixel.length - 2) {
    throw new Error('Can only get pixel type');
  }

  return parseFloat(pixel);
}

export function getPaddingTop(element: HTMLElement): number {
  const borderTopWidth = getStyleOf(element, 'padding-top');

  return getPixelNumber(borderTopWidth);
}

export function getPaddingLeft(element: HTMLElement): number {
  const borderLeftWidth = getStyleOf(element, 'padding-left');

  return getPixelNumber(borderLeftWidth);
}

export function getVisualViewport(): VisualViewport {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const visualViewport = window.visualViewport;

  if (visualViewport) {
    return visualViewport;
  }

  return {
    addEventListener: window.addEventListener,
    dispatchEvent: window.dispatchEvent,
    removeEventListener: window.removeEventListener,
    height: window.innerHeight,
    offsetLeft: 0,
    offsetTop: 0,
    pageLeft: window.pageXOffset,
    pageTop: window.pageYOffset,
    scale: 1,
    width: document.documentElement.clientWidth,
  };
}

export function setStyles(element: HTMLElement, styles: unknown): void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Reflect.ownKeys(styles).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    element.style[key] = styles[key];
  });
}

export function isTouchSupported(): boolean {
  return window.ontouchstart !== undefined;
}

export function getFocusable(target: HTMLElement | null): HTMLElement[] | null {
  if (!target) {
    return null;
  }

  const mayFocusable = target.querySelectorAll(
    'a,button,details,input,select,textarea,[tabindex]'
  );

  return Array.from(mayFocusable).filter((item) => {
    const tabindex = item.getAttribute('tabindex');

    if (item.getAttribute('data-nova-trap')) {
      return false;
    }

    if (item.getAttribute('disabled')) {
      return false;
    }

    return !(tabindex && tabindex.indexOf('-') !== -1);
  }) as HTMLElement[];
}
