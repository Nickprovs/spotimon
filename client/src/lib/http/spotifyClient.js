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

    const asyncGetTracksCalls = [];
    for (let i = 0; i * limit < totalPullCount && i * limit < totalSavedCount; i++) {
      asyncGetTracksCalls.push(this.getMySavedTracks({ offset: i * limit, limit: limit }));
    }
    const totalRes = await Promise.all(asyncGetTracksCalls);
    for (const res of totalRes) likedTracks.push(...res.items.map(o => o.track));

    return likedTracks;
  }

  async getArtistsFromTracksAsync(tracks) {
    let artists = [];
    const asyncGetArtistCalls = [];
    for (const track of tracks) {
      asyncGetArtistCalls.push(this.getArtist(track.artists[0].id));
    }
    const totalRes = await Promise.all(asyncGetArtistCalls);
    return totalRes;
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
