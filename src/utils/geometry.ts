export default class Geometry {
  static lineLineIntersection(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number
  ): [number, number] {
    const a = x1 * y2 - y1 * x2;
    const b = x3 * y4 - y3 * x4;
    const c = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    let x = 0;
    let y = 0;

    if (c) {
      x = (a * (x3 - x4) - (x1 - x2) * b) / c;
      y = (a * (y3 - y4) - (y1 - y2) * b) / c;
    }

    return [x, y];
  }
}
