import React, { Component } from "react";
import "./App.css";
import SpotifyClient from "./lib/spotify/spotifyClient";
import nBodyProblem from "./lib/simulation/nBodyProblem";
import CelestialBody from "./lib/simulation/celestialBody";
import SpotifyPlayer from "react-spotify-web-playback";

const scale = 70;
const radius = 0.5;
const trailLength = 35;
const g = 39.5;
const dt = 0.001; //0.005 years is equal to 1.825 days
const softeningConstant = 0.15;

class App extends Component {
  state = {
    canvasWidth: 0,
    canvasHeight: 0,
    canvasClickable: false,
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
    this.canvasMousePosition = { x: -1, y: -1 };

    this.animate = this.animate.bind(this);

    this.innerSolarSystem = new nBodyProblem({
      g: g,
      dt: dt,
      masses: [],
      softeningConstant: softeningConstant
    });

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
  }
  handleWindowResize() {
    //TODO: No matter the case, we shouldn't be displaying scroll bars. Use a css class to prevent that.
    this.setState({ canvasWidth: window.innerWidth });
    this.setState({
      canvasHeight:
        window.innerHeight * 0.99 - this.getAbsoluteHeight(this.header) - this.getAbsoluteHeight(this.footer)
    });
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext("2d");
    const urlParams = SpotifyClient.getUrlHashParams();
    this.setState({ accessToken: urlParams.access_token });
    this.state.canvasWidth = window.innerWidth;
    this.state.canvasHeight =
      window.innerHeight * 0.99 - this.getAbsoluteHeight(this.header) - this.getAbsoluteHeight(this.footer);
    window.addEventListener("resize", this.handleWindowResize.bind(this));

    console.log("header", this.header);
    console.log("footer", this.footer);
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
        ctx: this.ctx,
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
      this.innerSolarSystem.masses.push(mass);
    }
    this.animate();
  }

  animate() {
    this.innerSolarSystem.updatePositionVectors();
    this.innerSolarSystem.updateAccelerationVectors();
    this.innerSolarSystem.updateVelocityVectors();

    this.ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);

    const massesLen = this.innerSolarSystem.masses.length;

    let cursorMadeContactWithBody = false;

    for (let i = 0; i < massesLen; i++) {
      const massI = this.innerSolarSystem.masses[i];
      const x = this.state.canvasWidth / 2 + massI.x * scale;
      const y = this.state.canvasHeight / 2 + massI.y * scale;

      massI.manifestation.draw(x, y);

      for (let j = 0; j < massI.manifestation.positions.length; j++) {
        const scaleFactor = j / massI.manifestation.positions.length;
        const massPosition = massI.manifestation.positions[j];
        if (
          this.pointInCircle(
            this.canvasMousePosition.x,
            this.canvasMousePosition.y,
            massPosition.x,
            massPosition.y,
            scaleFactor * massI.manifestation.radius
          )
        ) {
          cursorMadeContactWithBody = true;
          break;
        }
      }

      if (massI.name) {
        this.ctx.font = "14px Arial";
        this.ctx.fillText(massI.name, x + 12, y + 4);
        this.ctx.fill();
      }

      //Past Negative X Dir
      if (massI.x < -this.state.canvasWidth / 2 / scale) {
        massI.x = this.state.canvasWidth / 2 / scale;
        massI.y *= -1;
        massI.vx /= 2;
        continue;
      }

      //Past Positive X Dir
      if (massI.x > this.state.canvasWidth / 2 / scale) {
        massI.x = -this.state.canvasWidth / 2 / scale;
        massI.y *= -1;
        massI.vx /= 2;
        continue;
      }

      //Past Negative Y Dir
      if (massI.y < -this.state.canvasHeight / 2 / scale) {
        massI.y = this.state.canvasHeight / 2 / scale;
        massI.x *= -1;
        massI.vy /= 2;
        continue;
      }

      //Past Negative Y Dir
      if (massI.y > this.state.canvasHeight / 2 / scale) {
        massI.y = -this.state.canvasHeight / 2 / scale;
        massI.x *= -1;
        massI.vy /= 2;
        continue;
      }
    }
    this.setState({ canvasClickable: cursorMadeContactWithBody });
    requestAnimationFrame(this.animate);
  }

  pointInCircle(x, y, cx, cy, radius) {
    const paddedRadius = radius + 5;
    var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
    return distancesquared <= paddedRadius * paddedRadius;
  }

  async handleCanvasClick(e) {
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    const massesLen = this.innerSolarSystem.masses.length;
    let hitDectectionSuccessful = false;
    let hitDetectedMass = null;

    for (let i = 0; i < massesLen; i++) {
      const massI = this.innerSolarSystem.masses[i];

      for (let i = 0; i < massI.manifestation.positions.length; i++) {
        const massPosition = massI.manifestation.positions[i];
        const scaleFactor = i / massI.manifestation.positions.length;

        if (
          this.pointInCircle(mouseX, mouseY, massPosition.x, massPosition.y, massI.manifestation.radius * scaleFactor)
        ) {
          console.log("clicked", massI.name);
          hitDectectionSuccessful = true;
          hitDetectedMass = massI;
          break;
        }
      }

      if (hitDectectionSuccessful) break;
    }

    if (!hitDectectionSuccessful) return;

    const playlists = await this.spotifyClient.searchPlaylists(`the sound of ${hitDetectedMass.name}`);
    const playlist = playlists.playlists.items[0];
    const playlistOffset = Math.floor(Math.random() * playlist.tracks.total - 1);

    this.setState({ playlistStartOffset: playlistOffset });
    this.setState({ currentUris: [playlist.uri] });
    this.setState({ playing: true });
  }

  handleMouseMove(e) {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    this.canvasMousePosition.x = x;
    this.canvasMousePosition.y = y;
  }

  async handlePlayerStatusChange(state) {
    console.log(state);
    this.setState({ playing: state.isPlaying });
    if (state.isPlaying) await this.spotifyClient.shuffle();
  }

  //test
  render() {
    const { playlistStartOffset, accessToken, canvasClickable, currentUris, playing } = this.state;
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
          <canvas
            onMouseMove={e => this.handleMouseMove(e)}
            onClick={async e => await this.handleCanvasClick(e)}
            style={{ backgroundColor: "#0c1d40" }}
            ref={this.setCanvas}
            width={this.state.canvasWidth}
            height={this.state.canvasHeight}
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
