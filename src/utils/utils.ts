export default class Utils {
  /**
   * Return number in the [low, high]
   * @param n Input number
   * @param low Min limit
   * @param high Max limit
   */
  static numberLimit(n: number, low = 0, high = Infinity): number {
    if (n < low) {
      return low;
    } else if (n > high) {
      return high;
    }
    return n;
  }

  /**
   * Keep some digits after the decimal point, remove trailing zeros
   * @param n Input number
   * @param fractionDigits Number of digits after the decimal point. Must be in the [0, 20]
   */
  static numberFixed(n: number, fractionDigits = 2): string {
    const fixed = n.toFixed(fractionDigits);
    return parseFloat(fixed).toString();
  }
}
