export default class SpatialInfo {
  constructor(spatialArgs) {
    this.name = spatialArgs.name;
    this.m = spatialArgs.m;
    this.x = spatialArgs.x;
    this.y = spatialArgs.y;
    this.z = spatialArgs.z;
    this.vx = spatialArgs.vx;
    this.vy = spatialArgs.vy;
    this.vz = spatialArgs.vz;
    this.ax = spatialArgs.ax;
    this.ay = spatialArgs.ay;
    this.az = spatialArgs.az;
  }
}
