export default class DomHelper {
  static getInputValue(target: HTMLInputElement): string {
    return target.value.trim();
  }

  static setInputValue(target: HTMLInputElement, value: string): void {
    target.value = value;
  }
}
