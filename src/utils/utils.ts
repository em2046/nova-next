export default class Utils {
  /**
   * Return number in [low high]
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
}
