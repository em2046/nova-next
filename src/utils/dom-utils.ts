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

export default class DomUtils {
  static getInputValue(target: HTMLInputElement): string {
    return target.value.trim();
  }

  static setInputValue(target: HTMLInputElement, value: string | number): void {
    target.value = value.toString();
  }

  static getElementPosition(element: HTMLElement): DOMRect {
    return element.getBoundingClientRect();
  }

  static isInElement(
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

  static getStyleOf(element: HTMLElement, prop: string): string {
    return getComputedStyle(element).getPropertyValue(prop);
  }

  static getPixelNumber(pixel: string): number {
    if (!pixel) {
      return 0;
    }

    if (pixel.indexOf('px') !== pixel.length - 2) {
      throw new Error('Can only get pixel type');
    }

    return parseFloat(pixel);
  }

  static getPaddingTop(element: HTMLElement): number {
    const borderTopWidth = DomUtils.getStyleOf(element, 'padding-top');

    return DomUtils.getPixelNumber(borderTopWidth);
  }

  static getPaddingLeft(element: HTMLElement): number {
    const borderLeftWidth = DomUtils.getStyleOf(element, 'padding-left');

    return DomUtils.getPixelNumber(borderLeftWidth);
  }

  static getVisualViewport(): VisualViewport {
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
}
