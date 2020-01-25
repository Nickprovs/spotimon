import DomainInfo from "../simulation/info/domainInfo";
import NBodyItem from "../simulation/nBodyItem";

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

  static geNBodyItemsFromUniqueGenreData(uniqueGenreData, trailLength = 8) {
    const genresToUseCount = Math.min(25, uniqueGenreData.length);
    const quarterSize = genresToUseCount.length / 4;
    const threeQuarterMark = 3 * (quarterSize - 1);
    const frequentedGenres = uniqueGenreData.slice(0, threeQuarterMark);
    const unfrequentedGenres = uniqueGenreData.slice(threeQuarterMark, genresToUseCount - 1);
    const genres = frequentedGenres.concat(unfrequentedGenres);

    let nBodyItems = [];

    for (let genre of genres) {
      const defaultMass = DomainInfo.getDefaultBasslineMassFromGenreCount(genre.count);

      const manifestationArgs = {
        defaultMass: defaultMass,
        trailLength: trailLength,
        radius: DomainInfo.getDefaultBasslineRadiusFromGenreCount(genre.count),
        hasRing: Math.random() > 0.6
      };

      const spatialArgs = {
        m: defaultMass,
        ...SimulationUtilities.getRandomGravitationalObjectData()
      };

      const domainArgs = {
        genre: genre
      };

      const item = new NBodyItem(spatialArgs, manifestationArgs, domainArgs);
      nBodyItems.push(item);
    }

    return nBodyItems;
  }
}
