import Spotify from "spotify-web-api-js";
//Wraps JPerez this.spotifyWebApi and exposes domain-specific functionality we need
class SpotifyClient extends Spotify {
  static getUrlHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  isLoggedIn() {
    return this.getAccessToken() === true;
  }

  async getSavedTracksAsync(totalPullCount = 300) {
    let likedTracks = [];
    try {
      let limit = Math.min(50, totalPullCount);

      const res = await this.getMySavedTracks();
      const totalSavedCount = res.total;

      for (let i = 0; i * limit < totalPullCount && i * limit < totalSavedCount; i++) {
        const res = await this.getMySavedTracks({ offset: i * limit, limit: limit });
        likedTracks.push(...res.items.map(o => o.track));
      }
    } catch (ex) {
      console.log(ex);
    }
    return likedTracks;
  }

  async getArtistsFromTracksAsync(tracks) {
    let artists = [];

    try {
      for (let track of tracks) {
        const res = await this.getArtist(track.artists[0].id);
        artists.push(res);
      }
    } catch (ex) {
      console.log(ex);
    }
    return artists;
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

    for (let genreKey in uniqueGenreData)
      sortedUniqueGenreData.push({ name: genreKey, count: uniqueGenreData[genreKey] });

    sortedUniqueGenreData.sort((a, b) => {
      return b.count - a.count;
    });

    return sortedUniqueGenreData;
  }

  async getNowPlayingAsync() {
    try {
      const res = await this.getMyCurrentPlaybackState();
      return {
        name: res.item.name,
        image: res.item.album.images[0].url
      };
    } catch (ex) {
      console.log(ex);
    }
  }
}

export default SpotifyClient;
