export default class MathUtilities {
  static isPointWithinCircle(x, y, cx, cy, radius) {
    const paddedRadius = radius + 5;
    var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
    return distancesquared <= paddedRadius * paddedRadius;
  }
}
