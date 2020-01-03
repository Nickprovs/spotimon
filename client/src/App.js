import React, { Component } from "react";
import "./App.css";
import SpotifyClient from "./lib/spotify/spotifyClient";
import nBodyProblem from "./lib/simulation/nBodyProblem";
import CelestialBody from "./lib/simulation/celestialBody";
import CelestialBodyManifestation from "./lib/simulation/celestialBodyManifestation";

const scale = 70;
const radius = 0.5;
const trailLength = 35;
const g = 39.5;
const dt = 0.001; //0.005 years is equal to 1.825 days
const softeningConstant = 0.15;


class App extends Component {
  state = {
    canvasClickable: false
  };

  constructor() {
    super();
    const urlParams = SpotifyClient.getUrlHashParams();
    this.spotifyClient = new SpotifyClient();
    this.spotifyClient.setAccessToken(urlParams.access_token);
    this.canvasMousePosition = {x: -1, y: -1};

    this.animate = this.animate.bind(this);
    
    this.innerSolarSystem = new nBodyProblem({
      g: g,
      dt: dt,
      masses: [],
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
      
      const manifestationArgs = {
        ctx: this.ctx, trailLength: trailLength, radius: radius*genre.count
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

    this.ctx.clearRect(0, 0, this.width, this.height);

    const massesLen = this.innerSolarSystem.masses.length;

    let cursorMadeContactWithBody = false;

    for (let i = 0; i < massesLen; i++) {
      const massI = this.innerSolarSystem.masses[i];
      const x = this.width / 2 + massI.x * scale;
      const y = this.height / 2 + massI.y * scale;

      massI.manifestation.draw(x, y);

      const bodyMouseHitRadius = Math.max(massI.manifestation.radius,7);
      if(this.pointInCircle(this.canvasMousePosition.x, this.canvasMousePosition.y, x, y, bodyMouseHitRadius)){
        cursorMadeContactWithBody = true;
      }

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
    this.setState({canvasClickable: cursorMadeContactWithBody});
    requestAnimationFrame(this.animate);
  }

  pointInCircle(x, y, cx, cy, radius) {
    var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
    return distancesquared <= radius * radius;
  }

  handleCanvasClick(e){
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    const massesLen = this.innerSolarSystem.masses.length;
    for (let i = 0; i < massesLen; i++) {
      const massI = this.innerSolarSystem.masses[i];
      const x = this.width / 2 + massI.x * scale;
      const y = this.height / 2 + massI.y * scale;

      const bodyMouseHitRadius = Math.max(massI.manifestation.radius,7);

      if(this.pointInCircle(mouseX, mouseY, x, y, bodyMouseHitRadius)){
        console.log("clicked", massI.name);
        return;
      }
      
    }
  }

  handleMouseMove(e){
    const {offsetX: x, offsetY: y} = e.nativeEvent;
    this.canvasMousePosition.x = x;
    this.canvasMousePosition.y = y;
  }


  //test
  render() {
    const {canvasClickable} = this.state;
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

        <div style={{cursor: canvasClickable ? "pointer" : "default"}}>
          <canvas onMouseMove={(e) => this.handleMouseMove(e)} onClick={(e)=> this.handleCanvasClick(e)} style={{ backgroundColor: "#0c1d40" }} ref={this.setCanvas} width={this.width} height={this.height} />
        </div>
      </div>
    );
  }
}

export default App;
