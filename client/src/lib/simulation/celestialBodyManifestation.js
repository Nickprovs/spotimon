//How masses store themselves visually
export default class CelestialBodyManifestation {
  constructor(ctx, trailLength, radius) {
    this.ctx = ctx;
    this.trailLength = trailLength;
    this.radius = radius;
    this.primaryColor = {
      r: Math.floor(Math.random()*256),      // Random between 0-255
      g: Math.floor(Math.random()*256),          // Random between 0-255
      b: Math.floor(Math.random()*256)          // Random between 0-255
    }
    this.positions = [];
  }

  storePosition(x, y) {
    this.positions.push({
      x,
      y
    });

    if (this.positions.length > this.trailLength) this.positions.shift();
  }

  draw(x, y) {
    this.storePosition(x, y);

    const positionsLen = this.positions.length;

    for (let i = 0; i < positionsLen; i++) {
      let transparency;
      let circleScaleFactor;

      const scaleFactor = i / positionsLen;

      if (i === positionsLen - 1) {
        transparency = 1;
        circleScaleFactor = 1;
      } else {
        transparency = scaleFactor / 2;
        circleScaleFactor = scaleFactor;
      }

      const {r,g,b} = this.primaryColor;
      this.ctx.beginPath();
      this.ctx.arc(this.positions[i].x, this.positions[i].y, circleScaleFactor * this.radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = `rgb(${r}, ${g}, ${b}, ${transparency})`;

      this.ctx.fill();
    }
  }
}
