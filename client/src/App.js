import React, { Component } from "react";
import "./App.css";
import SpotifyClient from "./lib/spotify/spotifyClient";

class App extends Component {
  constructor() {
    super();
    const urlParams = SpotifyClient.getUrlHashParams();
    this.spotifyClient = new SpotifyClient();
    this.spotifyClient.setAccessToken(urlParams.access_token);

    this.state = {
      loggedIn: urlParams.access_token ? true : false,
      nowPlaying: {
        name: "Not Checked",
        image: ""
      }
    };
  }

  async handleGetNowPlaying() {
    const nowPlaying = await this.spotifyClient.getNowPlayingAsync();
    console.log(nowPlaying);
    this.setState({ nowPlaying });
  }

  async handleInspectThing() {
    const savedTracks = await this.spotifyClient.getSavedTracksAsync();
    const savedArtists = await this.spotifyClient.getArtistsFromTracksAsync(savedTracks);
    console.log(savedArtists);
    const uniqueGenreData = this.spotifyClient.getUniqueGenreDataFromArtists(savedArtists);
    console.log(uniqueGenreData);
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

        <button onClick={() => this.handleGetNowPlaying()}>Check Now Playing</button>

        <button onClick={() => this.handleInspectThing()}>Inspect Something</button>
      </div>
    );
  }
}

export default App;
