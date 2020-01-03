import CelestialBodyManifestation from "./celestialBodyManifestation";

export default class CelestialBody {
    constructor(celestialBodyArgs, manifestationArgs){
        this.name = celestialBodyArgs.name;
        this.m = celestialBodyArgs.m;
        this.x = celestialBodyArgs.x;
        this.y = celestialBodyArgs.y;
        this.z = celestialBodyArgs.z;
        this.vx = celestialBodyArgs.vx;
        this.vy = celestialBodyArgs.vy;
        this.vz = celestialBodyArgs.vz;
        this.ax = celestialBodyArgs.ax;
        this.ay = celestialBodyArgs.ay;
        this.az = celestialBodyArgs.az;
        this.manifestation = new CelestialBodyManifestation(manifestationArgs.ctx, manifestationArgs.trailLength, manifestationArgs.radius);
    }
}