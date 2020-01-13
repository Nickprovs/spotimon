import React, { Component } from "react";
import SpotifyClient from "../lib/spotify/spotifyClient";
import CelestialBody from "../lib/simulation/celestialBody";
import SpotifyPlayer from "react-spotify-web-playback";
import SpaceSimulator from "./common/spaceSimulator";
import nBodyProblem from "../lib/simulation/nBodyProblem";
import SimulationUtilities from "../lib/util/simulationUtilities";
import ElementUtilities from "../lib/util/elementUtilities";

const radius = 0.5;
const trailLength = 8;
const g = 39.5;
const dt = 0.001; //0.005 years is equal to 1.825 days
const softeningConstant = 0.15;
const scale = 70;

export default class Sposmos extends Component {
  state = {
    simulatorEnabled: false,
    simulationWidth: 0,
    simulationHeight: 0,
    simulationCursor: "default",
    currentUris: [],
    accessToken: "",
    playlistStartOffset: 0,

    nowPlaying: {
      fetchingGenres: false,
      name: "Not Checked",
      image: ""
    },
    currentTrackData: {
      id: "",
      analysis: null,
      progressInSeconds: 0,
      recentLoudnessData: []
    },
    playRequested: false,
    playing: false
  };

  constructor() {
    super();
    const urlParams = SpotifyClient.getUrlHashParams();
    this.spotifyClient = new SpotifyClient();
    this.spotifyClient.setAccessToken(urlParams.access_token);

    this.durationCheckTimerId = null;
    this.onDurationCheck = this.onDurationCheck.bind(this);

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

    //The N-Body Problem object which embodies our simulator data and calculations
    this.state.simulationDriver = new nBodyProblem({
      g: g,
      dt: dt,
      masses: [],
      softeningConstant: softeningConstant,
      scale: scale
    });
  }

  setSimulatorSize() {
    this.setState({ simulatorWidth: window.innerWidth });
    this.setState({
      simulatorHeight:
        window.innerHeight * 0.99 -
        ElementUtilities.getAbsoluteHeight(this.header) -
        ElementUtilities.getAbsoluteHeight(this.footer)
    });
  }

  handleWindowResize() {
    //TODO: No matter the case, we shouldn't be displaying scroll bars. Use a css class to prevent that.
    this.setSimulatorSize();
  }

  componentDidMount() {
    const urlParams = SpotifyClient.getUrlHashParams();
    this.setState({ accessToken: urlParams.access_token });
    this.setSimulatorSize();
    window.addEventListener("resize", this.handleWindowResize.bind(this));
  }

  async handleGetNowPlaying() {
    const nowPlaying = await this.spotifyClient.getNowPlayingAsync();
    if (nowPlaying) this.setState({ nowPlaying });
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

    const genresToUseCount = Math.min(50, uniqueGenreData.length);
    const quarterSize = genresToUseCount.length / 4;
    const threeQuarterMark = 3 * (quarterSize - 1);
    const frequentedGenres = uniqueGenreData.slice(0, threeQuarterMark);
    const unfrequentedGenres = uniqueGenreData.slice(threeQuarterMark, genresToUseCount - 1);
    const genres = frequentedGenres.concat(unfrequentedGenres);

    for (let genre of genres) {
      const manifestationArgs = {
        trailLength: trailLength,
        defaultRadius: radius * genre.count,
        radius: radius * genre.count
      };

      const celestialBodyArgs = {
        name: genre.name,
        m: 3.0024584e-6 * Math.pow(genre.count, 3.33),
        ...SimulationUtilities.getRandomGravitationalObjectData()
      };

      let mass = new CelestialBody(celestialBodyArgs, manifestationArgs);
      this.state.simulationDriver.masses.push(mass);
    }
    this.setState({ simulatorEnabled: true });
  }

  async handleGenreClick(hitDetectedGravitationalObject) {
    const genreName = hitDetectedGravitationalObject.name;
    const playlists = await this.spotifyClient.searchPlaylists(`the sound of ${genreName}`);
    const playlist = playlists.playlists.items[0];
    const playlistOffset = Math.min(
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * playlist.tracks.total - 1)
    );
    const res = await await this.spotifyClient.getPlaylistTracks(playlist.id, { offset: playlistOffset });
    const song = res.items[0].track;
    console.log("playlist song", song);
    await this.updateNewTrackData(song.id);

    this.setState({ playlistStartOffset: playlistOffset });
    this.setState({ currentUris: [playlist.uri] });
    this.setState({ playRequested: true });
  }

  handleGenreMouseEnter(hitDetectedGravitationalObject) {
    this.setState({ simulationCursor: "pointer" });
  }

  handleGenreMouseLeave(hitDetectedGravitationalObject) {
    this.setState({ simulationCursor: "default" });
  }

  async handlePlayerStatusChange(state) {
    const previouslyPlaying = this.state.playing;
    this.setState({ playing: state.isPlaying });
    // if (state.track && state.track.id != this.state.currentTrackData.id) {
    //   await this.updateNewTrackData(state.track);
    // }

    if (state.isPlaying) {
      this.setState({ currentTrackData: { ...this.state.currentTrackData, progressInSeconds: state.position } });
    }

    if (!state.isPlaying) {
      clearInterval(this.durationCheckTimerId);
      this.setState({ playRequested: false });
    }
    if (state.isPlaying && !previouslyPlaying) {
      try {
        // await this.spotifyClient.setShuffle(true);
      } catch (ex) {
        console.log("shuffle issue", ex);
      }
      this.durationCheckTimerId = setInterval(this.onDurationCheck, 200);
      console.log(this.state.currentTrackData.analysis);
    }
  }

  onDurationCheck() {
    const currentTrackData = { ...this.state.currentTrackData };
    currentTrackData.progressInSeconds += 0.2;
    this.setState({ currentTrackData });

    const maxLoudness = currentTrackData.analysis.track.loudness;

    let matchingSegmentForTime = currentTrackData.analysis.segments.filter(
      s => s.start <= currentTrackData.progressInSeconds && s.start + s.duration > currentTrackData.progressInSeconds
    )[0];

    const averageRecentLength = 6;

    let timeCoeffecient = 1;
    if (matchingSegmentForTime && currentTrackData.recentLoudnessData.length >= averageRecentLength) {
      let averageRecent =
        currentTrackData.recentLoudnessData.reduce((a, b) => a + b, 0) / currentTrackData.recentLoudnessData.length;
      let comparisonWithRecentAverage = Math.abs(matchingSegmentForTime.loudness_start / averageRecent);

      let comparisonWithLast = Math.abs(
        matchingSegmentForTime.loudness_start /
          currentTrackData.recentLoudnessData[currentTrackData.recentLoudnessData.length - 1]
      );

      let comparisonWithMaxLoudness = Math.pow(Math.abs(maxLoudness / matchingSegmentForTime.loudness_start), 1.7);

      timeCoeffecient = 0.4 * comparisonWithLast + 0.4 * comparisonWithRecentAverage + 0.2 * comparisonWithMaxLoudness;
    }
    this.state.simulationDriver.dt = 3 * dt * timeCoeffecient;
    for (let i = 0; i < this.state.simulationDriver.masses.length - 1; i++) {
      const mass = this.state.simulationDriver.masses[i];
      if (!isNaN(timeCoeffecient))
        mass.manifestation.radius =
          mass.manifestation.defaultRadius + 2.5 * mass.manifestation.defaultRadius * timeCoeffecient;
      // console.log("time coeff", timeCoeffecient,  "default radius", mass.manifestation.defaultRadius);
    }
    if (matchingSegmentForTime) {
      currentTrackData.recentLoudnessData.push(matchingSegmentForTime.loudness_start);
      if (currentTrackData.recentLoudnessData.count > averageRecentLength) currentTrackData.recentLoudnessData.pop();
    }
  }

  async updateNewTrackData(trackId) {
    const res = await this.spotifyClient.getAudioAnalysisForTrack(trackId);
    const currentTrackData = { ...this.state.currentTrackData, id: trackId, analysis: res, progressInSeconds: 0 };
    this.setState({ currentTrackData });
  }

  //test
  render() {
    const {
      simulationCursor,
      simulationDriver,
      simulatorEnabled,
      simulatorWidth,
      simulatorHeight,
      playlistStartOffset,
      accessToken,
      canvasClickable,
      currentUris,
      playRequested
    } = this.state;

    return (
      <div className="App">
        <div ref={this.setHeader}>
          <a href="http://localhost:8888/login">
            <button style={{ backgroundColor: "green" }}>Login With Spotify</button>
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
          <SpaceSimulator
            simulationDriver={simulationDriver}
            isEnabled={simulatorEnabled}
            backgroundColor={"#0c1d40"}
            width={simulatorWidth}
            height={simulatorHeight}
            cursor={simulationCursor}
            onGravitationalObjectClick={async item => this.handleGenreClick(item)}
            onGravitationalObjectMouseEnter={item => this.handleGenreMouseEnter(item)}
            onGravitationalObjectMouseLeave={item => this.handleGenreMouseLeave(item)}
          />
        </div>

        <div ref={this.setFooter}>
          <SpotifyPlayer
            showSaveIcon={true}
            offset={playlistStartOffset}
            callback={async state => this.handlePlayerStatusChange(state)}
            play={playRequested}
            uris={currentUris}
            token={accessToken}
          />
        </div>
      </div>
    );
  }
}
