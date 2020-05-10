const defaultSearchLimit = 1024;

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
    if (pixel.indexOf('px') !== pixel.length - 2) {
      throw new Error('Can only get pixel type');
    }

    return parseFloat(pixel);
  }

  static getBorderTopWidth(element: HTMLElement): number {
    const borderTopWidth = DomUtils.getStyleOf(element, 'border-top-width');

    return DomUtils.getPixelNumber(borderTopWidth);
  }

  static getBorderLeftWidth(element: HTMLElement): number {
    const borderLeftWidth = DomUtils.getStyleOf(element, 'border-left-width');

    return DomUtils.getPixelNumber(borderLeftWidth);
  }
}
