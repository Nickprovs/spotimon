import React, { Component } from "react";
import "./App.css";
import SpotifyClient from "./lib/spotify/spotifyClient";
import CelestialBody from "./lib/simulation/celestialBody";
import SpotifyPlayer from "react-spotify-web-playback";
import SpaceSimulator from "./components/spaceSimulator";
import nBodyProblem from "./lib/simulation/nBodyProblem";

const radius = 0.5;
const trailLength = 35;
const g = 39.5;
const dt = 0.001; //0.005 years is equal to 1.825 days
const softeningConstant = 0.15;
const scale = 70;

class App extends Component {
  state = {
    simulatorEnabled: false,
    simulationWidth: 0,
    simulationHeight: 0,
    simulationClickable: false,
    currentUris: [],
    accessToken: "",
    playing: false,
    playlistStartOffset: 0
  };

  constructor() {
    super();
    const urlParams = SpotifyClient.getUrlHashParams();
    this.spotifyClient = new SpotifyClient();
    this.spotifyClient.setAccessToken(urlParams.access_token);

    this.canvas = null;
    this.setCanvas = element => {
      this.canvas = element;
    };

    this.header = null;
    this.setHeader = element => {
      this.header = element;
    };

    this.footer = null;
    this.setFooter = element => {
      this.footer = element;
    };

    this.state = {
      loggedIn: urlParams.access_token ? true : false,
      nowPlaying: {
        fetchingGenres: false,
        name: "Not Checked",
        image: ""
      }
    };

    //The N-Body Problem object which embodies our simulator data and calculations
    this.state.simulationDriver = new nBodyProblem({
      g: g,
      dt: dt,
      masses: [],
      softeningConstant: softeningConstant,
      scale: scale
    });
  }
  handleWindowResize() {
    //TODO: No matter the case, we shouldn't be displaying scroll bars. Use a css class to prevent that.
    this.setSimulatorSize();
  }

  componentDidMount() {
    const urlParams = SpotifyClient.getUrlHashParams();
    this.setSimulatorSize();
    window.addEventListener("resize", this.handleWindowResize.bind(this));

    console.log("header", this.header);
    console.log("footer", this.footer);
  }

  setSimulatorSize() {
    this.setState({ simulatorWidth: window.innerWidth });
    this.setState({
      simulatorHeight:
        window.innerHeight * 0.99 - this.getAbsoluteHeight(this.header) - this.getAbsoluteHeight(this.footer)
    });
  }

  getAbsoluteHeight(el) {
    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

    return Math.ceil(el.offsetHeight + margin);
  }

  async handleGetNowPlaying() {
    const nowPlaying = await this.spotifyClient.getNowPlayingAsync();
    if (nowPlaying) this.setState({ nowPlaying });
  }

  getRandomPositionData() {
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

  async handleFetchGenres() {
    let uniqueGenreData = [];
    this.setState({ fetchingGenres: true });
    try {
      const savedTracks = await this.spotifyClient.getSavedTracksAsync(300);
      const savedArtists = await this.spotifyClient.getArtistsFromTracksAsync(savedTracks);
      uniqueGenreData = this.spotifyClient.getUniqueGenreDataFromArtists(savedArtists);
    } catch (ex) {
      console.log(ex);
    } finally {
      this.setState({ fetchingGenres: false });
    }

    const genresToUseCount = Math.min(100, uniqueGenreData.length);
    const quarterSize = genresToUseCount.length / 4;
    const threeQuarterMark = 3 * (quarterSize - 1);
    const frequentedGenres = uniqueGenreData.slice(0, threeQuarterMark);
    const unfrequentedGenres = uniqueGenreData.slice(threeQuarterMark, genresToUseCount - 1);
    const genres = frequentedGenres.concat(unfrequentedGenres);

    for (let genre of genres) {
      const randData = this.getRandomPositionData();

      const manifestationArgs = {
        trailLength: trailLength,
        radius: radius * genre.count
      };

      const celestialBodyArgs = {
        name: genre.name,
        m: 3.0024584e-6 * Math.pow(genre.count, 3.33),
        x: randData.x,
        y: randData.y,
        z: randData.z,
        vx: randData.vx,
        vy: randData.vy,
        vz: randData.vz,
        ax: randData.ax,
        ay: randData.ay,
        az: randData.az
      };

      let mass = new CelestialBody(celestialBodyArgs, manifestationArgs);
      this.state.simulationDriver.masses.push(mass);
    }
    console.log(this.state.simulationDriver);
    this.setState({ simulatorEnabled: true });
  }

  async handleGenreClick(hitDetectedGravitationalObject) {
    const genreName = hitDetectedGravitationalObject.name;
    const playlists = await this.spotifyClient.searchPlaylists(`the sound of ${genreName}`);
    const playlist = playlists.playlists.items[0];
    const playlistOffset = Math.floor(Math.random() * playlist.tracks.total - 1);

    this.setState({ playlistStartOffset: playlistOffset });
    this.setState({ currentUris: [playlist.uri] });
    this.setState({ playing: true });
  }

  handleGenreMouseOver(hitDetectedGravitationalObject) {
    console.log("Mouse over", hitDetectedGravitationalObject);
  }

  async handlePlayerStatusChange(state) {
    console.log(state);
    this.setState({ playing: state.isPlaying });
    if (state.isPlaying) await this.spotifyClient.shuffle();
  }

  //test
  render() {
    const {
      simulationDriver,
      simulatorEnabled,
      simulatorWidth,
      simulatorHeight,
      playlistStartOffset,
      accessToken,
      canvasClickable,
      currentUris,
      playing
    } = this.state;
    return (
      <div className="App">
        <div ref={this.setHeader}>
          <a href="http://localhost:8888">
            <button>Login With Spotify</button>
          </a>

          <div>Now Playing: {this.state.nowPlaying.name}</div>
          <div>
            <img style={{ width: 100 }} src={this.state.nowPlaying.image} />
          </div>

          <button onClick={() => this.handleGetNowPlaying()}>Check Now Playing</button>

          <button disabled={this.state.fetchingGenres} onClick={() => this.handleFetchGenres()}>
            Fetch Genres
          </button>
        </div>

        <div style={{ cursor: canvasClickable ? "pointer" : "default" }}>
          {/* <canvas
            onMouseMove={e => this.handleMouseMove(e)}
            onClick={async e => await this.handleCanvasClick(e)}
            style={{ backgroundColor: "#0c1d40" }}
            ref={this.setCanvas}
            width={this.state.canvasWidth}
            height={this.state.canvasHeight}
          /> */}
          <SpaceSimulator
            isEnabled={simulatorEnabled}
            simulationDriver={simulationDriver}
            backgroundColor={"#0c1d40"}
            width={simulatorWidth}
            height={simulatorHeight}
            onGravitationalObjectClick={async item => this.handleGenreClick(item)}
            onGravitationalObjectMouseOver={item => this.handleGenreMouseOver(item)}
          />
        </div>

        <div ref={this.setFooter}>
          <SpotifyPlayer
            showSaveIcon={true}
            offset={playlistStartOffset}
            callback={async state => this.handlePlayerStatusChange(state)}
            play={playing}
            uris={currentUris}
            token={accessToken}
          />
        </div>
      </div>
    );
  }
}

export default App;
