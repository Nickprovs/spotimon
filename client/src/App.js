import React, { Component } from "react";
import "./App.css";
import SpotifyClient from "./lib/spotify/spotifyClient";
import nBodyProblem from "./lib/simulation/nBodyProblem";
import Manifestation from "./lib/simulation/manifestation";

const scale = 70;
const radius = 7;
const trailLength = 35;
const g = 39.5;
const dt = 0.005; //0.005 years is equal to 1.825 days
const softeningConstant = 0.15;

const masses = [
  {
    name: "Mercury",
    m: 1.65956463e-7,
    x: -0.346390408691506,
    y: -0.272465544507684,
    z: 0.00951633403684172,
    vx: 4.25144321778261,
    vy: -7.61778341043381,
    vz: -1.01249478093275
  },
  {
    name: "Venus",
    m: 2.44699613e-6,
    x: -0.168003526072526,
    y: 0.698844725464528,
    z: 0.0192761582256879,
    vx: -7.2077847105093,
    vy: -1.76778886124455,
    vz: 0.391700036358566
  },
  {
    name: "Earth",
    m: 3.0024584e-6,
    x: 0.648778995445634,
    y: 0.747796691108466,
    z: -3.22953591923124e-5,
    vx: -4.85085525059392,
    vy: 4.09601538682312,
    vz: -0.000258553333317722
  },
  {
    m: 3.213e-7,
    name: "Mars",
    x: -0.574871406752105,
    y: -1.395455041953879,
    z: -0.01515164037265145,
    vx: 4.9225288800471425,
    vy: -1.5065904473191791,
    vz: -0.1524041758922603
  }
];

class App extends Component {
  constructor() {
    super();
    const urlParams = SpotifyClient.getUrlHashParams();
    this.spotifyClient = new SpotifyClient();
    this.spotifyClient.setAccessToken(urlParams.access_token);

    this.animate = this.animate.bind(this);

    this.innerSolarSystem = new nBodyProblem({
      g: g,
      dt: dt,
      masses: JSON.parse(JSON.stringify(masses)),
      softeningConstant: softeningConstant
    });

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas = null;
    this.setCanvas = element => {
      this.canvas = element;
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

  componentDidMount() {
    this.ctx = this.canvas.getContext("2d");
  }

  beginAnimating() {
    this.populateManifestations(this.innerSolarSystem.masses);
    this.animate();
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

    let x = Math.random() * 2;
    let y = Math.random() * 2;
    const z = 0;
    let vx = Math.random() * 4;
    let vy = Math.random() * 4;
    const vz = 0;

    if (isNegativeVx) vx *= -1;
    if (isNegativeVy) vy *= -1;
    if (isNegativeX) x *= -1;
    if (isNegativeY) y *= -1;

    return { x, y, z, vx, vy, vz };
  }

  async handleFetchGenres() {
    let uniqueGenreData = [];
    this.setState({ fetchingGenres: true });
    try {
      const savedTracks = await this.spotifyClient.getSavedTracksAsync(300);
      const savedArtists = await this.spotifyClient.getArtistsFromTracksAsync(savedTracks);
      uniqueGenreData = this.spotifyClient.getUniqueGenreDataFromArtists(savedArtists);
      console.log(uniqueGenreData);
    } catch (ex) {
      console.log(ex);
    } finally {
      this.setState({ fetchingGenres: false });
    }

    const genresToUseCount = Math.min(100,uniqueGenreData.length);
    const quarterSize = (genresToUseCount.length / 4)
    const threeQuarterMark = 3 * (quarterSize -1);
    const frequentedGenres = uniqueGenreData.slice(0, threeQuarterMark);
    const unfrequentedGenres = uniqueGenreData.slice(threeQuarterMark, genresToUseCount - 1);
    const genres = frequentedGenres.concat(unfrequentedGenres);

    for (let genre of genres) {
      const randData = this.getRandomPositionData();
      this.innerSolarSystem.masses.push({
        name: genre.name,
        m: 3.0024584e-6 * Math.pow(genre.count, 3),
        x: randData.x,
        y: randData.y,
        z: randData.z,
        vx: randData.vx,
        vy: randData.vy,
        vz: randData.vz
      });
    }

    console.log(this.innerSolarSystem.masses);

    this.beginAnimating();
  }

  populateManifestations(masses) {
    masses.forEach(mass => (mass["manifestation"] = new Manifestation(this.ctx, trailLength, radius)));
  }

  animate() {
    this.innerSolarSystem.updatePositionVectors();
    this.innerSolarSystem.updateAccelerationVectors();
    this.innerSolarSystem.updateVelocityVectors();

    this.ctx.clearRect(0, 0, this.width, this.height);

    const massesLen = this.innerSolarSystem.masses.length;

    for (let i = 0; i < massesLen; i++) {
      const massI = this.innerSolarSystem.masses[i];
      const x = this.width / 2 + massI.x * scale;
      const y = this.height / 2 + massI.y * scale;

      massI.manifestation.draw(x, y);

      if (massI.name) {
        this.ctx.font = "14px Arial";
        this.ctx.fillText(massI.name, x + 12, y + 4);
        this.ctx.fill();
      }

      //Past Negative X Dir
      if (massI.x < -this.width/2 /scale ) {
        massI.x = this.width/2 /scale;
        massI.y *= -1;
        massI.vx /= 2;
        continue;
     }

      //Past Positive X Dir
      if (massI.x > this.width/2 /scale ) {
        massI.x = -this.width/2 /scale;
        massI.y *= -1;
        massI.vx /= 2;
        continue;
      }

      //Past Negative Y Dir
      if (massI.y < -this.height/2 /scale ) {
        massI.y = this.height/2 /scale;
        massI.x *= -1;
        massI.vy /= 2;
        continue;
      }

      //Past Negative Y Dir
      if (massI.y > this.height/2 /scale ) {
        massI.y = -this.height/2 /scale;
        massI.x *= -1;
        massI.vy /= 2;
        continue;
      }

    }

    requestAnimationFrame(this.animate);
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

        <button disabled={this.state.fetchingGenres} onClick={() => this.handleFetchGenres()}>
          Fetch Genres
        </button>

        <div>
          <canvas style={{ backgroundColor: "green" }} ref={this.setCanvas} width={this.width} height={this.height} />
        </div>
      </div>
    );
  }
}

export default App;
