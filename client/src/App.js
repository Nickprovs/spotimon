import React, { Component } from "react";
import "./App.css";
import Spotify from "spotify-web-api-js";
const spotifyWebApi = new Spotify();
const maxTrackPullCount = 300;

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: "Not Checked",
        image: ""
      }
    };

    console.log("Token", params.access_token);

    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token);
    }
  }

  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  async getNowPlaying() {
    try {
      const res = await spotifyWebApi.getMyCurrentPlaybackState();
      this.setState({
        nowPlaying: {
          name: res.item.name,
          image: res.item.album.images[0].url
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  async inspectThing() {
    const savedTracks = await this.getSavedTracks();
    const savedArtists = await this.getArtistsFromTracks(savedTracks);
    console.log(savedArtists);
    const uniqueGenreData = this.getUniqueGenreDataFromArtists(savedArtists);
    console.log(uniqueGenreData);
  }

  async getSavedTracks() {
    let likedTracks = [];
    try {
      let limit = 50;

      const res = await spotifyWebApi.getMySavedTracks();
      const totalSavedCount = res.total;

      for (let i = 0; i * limit < maxTrackPullCount && i * limit < totalSavedCount; i++) {
        const res = await spotifyWebApi.getMySavedTracks({ offset: i * limit, limit: limit });
        likedTracks.push(...res.items.map(o => o.track));
      }
    } catch (ex) {
      console.log(ex);
    }
    return likedTracks;
  }

  async getArtistsFromTracks(tracks) {
    let artists = [];

    try {
      for (let track of tracks) {
        const res = await spotifyWebApi.getArtist(track.artists[0].id);
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
      sortedUniqueGenreData.push({ genre: genreKey, count: uniqueGenreData[genreKey] });

    sortedUniqueGenreData.sort((a, b) => {
      return b.count - a.count;
    });

    return sortedUniqueGenreData;
  }
  //test
  render() {
    return (
      <div className="App">
        <a href="http://localhost:8888">
          <button>Login With Spotify</button>
        </a>

        <div>Now Playing: {this.state.nowPlaying.name}</div>
        <div>
          <img style={{ width: 100 }} src={this.state.nowPlaying.image} />
        </div>

        <button onClick={() => this.getNowPlaying()}>Check Now Playing</button>

        <button onClick={() => this.inspectThing()}>Inspect Something</button>
      </div>
    );
  }
}

export default App;
