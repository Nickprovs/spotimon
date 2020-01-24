export default class DomainInfo {
  static getDefaultBasslineMassFromGenreCount(genreCount) {
    return 3.0024584e-6 * Math.pow(genreCount, 3.33);
  }

  static getDefaultBasslineRadiusFromGenreCount(genreCount) {
    return 0.5 * genreCount;
  }

  constructor(domainArgs) {
    this.isPlaying = domainArgs.isPlaying ? domainArgs.isPlaying : false;
    this.genre = domainArgs.genre;
    this.basslineMass = DomainInfo.getDefaultBasslineMassFromGenreCount(this.genre.count);
    this.basslineRadius = DomainInfo.getDefaultBasslineRadiusFromGenreCount(this.genre.count);
  }
}
