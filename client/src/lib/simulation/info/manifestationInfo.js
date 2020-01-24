export default class ManifestationInfo {
  constructor(manifestationArgs) {
    this.trailLength = manifestationArgs.trailLength;
    this.radius = manifestationArgs.radius;
    this.hasRing = manifestationArgs.hasRing;
    this.primaryColor = {
      r: Math.floor(Math.random() * 256), // Random between 0-255
      g: Math.floor(Math.random() * 256), // Random between 0-255
      b: Math.floor(Math.random() * 256) // Random between 0-255
    };
    this.positions = [];
    this.storePosition = this.storePosition.bind(this);
  }

  storePosition(x, y) {
    this.positions.push({
      x,
      y
    });
    if (this.positions.length > this.trailLength) this.positions.shift();
  }

  draw(canvasContext, x, y) {
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

      const { r, g, b } = this.primaryColor;
      canvasContext.beginPath();
      canvasContext.arc(this.positions[i].x, this.positions[i].y, circleScaleFactor * this.radius, 0, 2 * Math.PI);
      canvasContext.fillStyle = `rgb(${r}, ${g}, ${b}, ${transparency})`;
      canvasContext.fill();

      //Special Operations for the main circle
      if (i === positionsLen - 1) {
        if (this.hasRing) {
          canvasContext.beginPath();
          canvasContext.arc(
            this.positions[i].x,
            this.positions[i].y,
            1 * this.radius + this.radius * 0.25,
            0,
            2 * Math.PI
          );
          canvasContext.strokeStyle = `rgb(${r}, ${g}, ${b}, ${1})`;
          canvasContext.lineWidth = 2;
          canvasContext.stroke();
        }
      }
    }
  }
}
