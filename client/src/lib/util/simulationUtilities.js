export default class SimulationUtilities {
  static getRandomGravitationalObjectData() {
    const isNegativeX = Math.random() > 0.5;
    const isNegativeY = Math.random() > 0.5;

    const isNegativeVx = Math.random() > 0.5;
    const isNegativeVy = Math.random() > 0.5;

    const isNegativeAx = Math.random() > 0.5;
    const isNegativeAy = Math.random() > 0.5;

    let x = Math.random() * 2;
    let y = Math.random() * 2;
    const z = 0;

    let vx = Math.random() * 4;
    let vy = Math.random() * 4;
    const vz = 0;

    let ax = Math.random() * 1;
    let ay = Math.random() * 1;
    const az = 0;

    if (isNegativeVx) vx *= -1;
    if (isNegativeVy) vy *= -1;

    if (isNegativeX) x *= -1;
    if (isNegativeY) y *= -1;

    if (isNegativeAx) ax *= -1;
    if (isNegativeAy) ay *= -1;

    return { x, y, z, vx, vy, vz, ax, ay, az };
  }
}
