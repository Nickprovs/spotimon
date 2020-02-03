import Spotify from "spotify-web-api-js";
//Wraps JPerez this.spotifyWebApi and exposes domain-specific functionality we need
class SpotifyClient extends Spotify {
  isLoggedIn() {
    return this.getAccessToken() === true;
  }

  async getSavedTracksAsync(totalPullCount = 300) {
    let likedTracks = [];
    let limit = Math.min(50, totalPullCount);

    const resTotal = await this.getMySavedTracks();
    const totalSavedCount = resTotal.total;

    for (let i = 0; i * limit < totalPullCount && i * limit < totalSavedCount; i++) {
      const result = await this.getMySavedTracks({ offset: i * limit, limit: limit });
      likedTracks.push(...result.items.map(o => o.track));
    }

    return likedTracks;
  }

  async getMyTopArtistsAsync(totalPullCount = 50) {
    let myTopArtists = [];
    let limit = Math.min(50, totalPullCount);

    const resTotal = await this.getMyTopArtists();
    const myTopArtistsCount = resTotal.total;

    for (let i = 0; i * limit < totalPullCount && i * limit < myTopArtistsCount; i++) {
      const result = await this.getMyTopArtists({ offset: i * limit, limit: limit });
      myTopArtists.push(...result.items);
    }
    return myTopArtists;
  }

  getUniqueGenreDataFromArtists(artists) {
    //Create and populate dictionary
    let uniqueGenreData = {};
    for (let artist of artists) {
      for (let artistGenre of artist.genres) {
        if (uniqueGenreData[artistGenre]) uniqueGenreData[artistGenre]++;
        else uniqueGenreData[artistGenre] = 1;
      }
    }

    let sortedUniqueGenreData = [];

    for (let genreKey in uniqueGenreData) sortedUniqueGenreData.push({ name: genreKey, count: uniqueGenreData[genreKey] });

    sortedUniqueGenreData.sort((a, b) => {
      return b.count - a.count;
    });

    return sortedUniqueGenreData;
  }
}

export default SpotifyClient;
