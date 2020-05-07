export default class DomHelper {
  static getInputValue(target: HTMLInputElement): string {
    return target.value.trim();
  }

  static setInputValue(target: HTMLInputElement, value: string | number): void {
    target.value = value.toString();
  }
}
