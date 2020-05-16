export default class Utils {
  /**
   * Return number in the [low, high]
   * @param n Input number
   * @param min Min limit, Default is 0
   * @param max Max limit, Default is Infinity
   */
  static numberLimit(n: number, min = 0, max = Infinity): number {
    if (n < min) {
      return min;
    } else if (n > max) {
      return max;
    }
    return n;
  }

  /**
   * Keep some digits after the decimal point, remove trailing zeros
   * @param n Input number
   * @param fractionDigits Number of digits after the decimal point. Must be in the [0, 20], Default is 2
   */
  static numberFixed(n: number, fractionDigits = 2): number {
    const fixed = n.toFixed(fractionDigits);
    return parseFloat(fixed);
  }
}
