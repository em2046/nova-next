const defaultSearchLimit = 1024;

export default class DomHelper {
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
}
