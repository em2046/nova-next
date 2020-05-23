export default class Utils {
  /**
   * Return number in the [low, high]
   * @param value Input number
   * @param min Min limit, Default is 0
   * @param max Max limit, Default is Infinity
   */
  static numberLimit(value: number, min = 0, max = Infinity): number {
    if (value < min) {
      return min;
    } else if (value > max) {
      return max;
    }
    return value;
  }

  /**
   * Keep some digits after the decimal point, remove trailing zeros
   * @param value Input number
   * @param fractionDigits Number of digits after the decimal point. Must be in the [0, 20], Default is 2
   */
  static numberFixed(value: number, fractionDigits = 2): number {
    const fixed = value.toFixed(fractionDigits);
    const floatNumber = parseFloat(fixed);

    if (Number.isNaN(floatNumber)) {
      return 0;
    }

    return floatNumber;
  }
}
