import React, { Component } from "react";
import DomainInfo from "../lib/simulation/info/domainInfo";
import SpotifyPlayer from "react-spotify-web-playback";
import SpaceSimulator from "./common/spaceSimulator";
import nBodyProblem from "../lib/simulation/nBodyProblem";
import SimulationUtilities from "../lib/util/simulationUtilities";
import ElementUtilities from "../lib/util/elementUtilities";
import AudioAnalysisUtilities from "../lib/util/audioAnalysisUtilities";
import Slider from "./common/slider";
import Spinner from "./common/spinner";
import { withRouter } from "react-router-dom";

const g = 39.5;
let dt = 0.0005; //0.005 years is equal to 1.825 days
const softeningConstant = 0.15;
const scale = 70;

class Sposmos extends Component {
  state = {
    simulatorEnabled: false,
    simulationWidth: 0,
    simulationHeight: 0,
    simulationCursor: "default",
    currentUris: [],
    playlistStartOffset: 0,
    fetchingGenres: false,
    currentTrackData: {
      id: "",
      playlist: null,
      analysis: null,
      progressInSeconds: 0,
      recentLoudnessData: []
    },
    playRequested: false,
    playing: false
  };

  constructor() {
    super();

    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.onDurationCheck = this.onDurationCheck.bind(this);
    this.durationCheckTimerId = null;

    this.page = null;
    this.setPage = element => {
      this.page = element;
    };

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
    this.simulationDriver = new nBodyProblem({
      g: g,
      dt: dt,
      masses: [],
      softeningConstant: softeningConstant,
      scale: scale
    });
  }

  setSimulatorSize() {
    if (!this.page) return;

    this.setState({ simulatorWidth: ElementUtilities.getAbsoluteWidth(this.page) });
    this.setState({
      simulatorHeight:
        ElementUtilities.getAbsoluteHeight(this.page) * 0.99 -
        ElementUtilities.getAbsoluteHeight(this.header) -
        ElementUtilities.getAbsoluteHeight(this.footer)
    });
  }

  async componentDidMount() {
    //If we're not authenticated by now... the main component will redirect us...
    if (!this.props.accessToken) return;

    this.setSimulatorSize();
    window.addEventListener("resize", this.handleWindowResize);
    new ResizeObserver(this.handleWindowResize).observe(this.footer);
    await this.fetchGenres();
  }

  handleWindowResize() {
    this.setSimulatorSize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  async handleGetNowPlaying() {
    const { spotifyClient } = this.props;
    const nowPlaying = await spotifyClient.getNowPlayingAsync();
    if (nowPlaying) this.setState({ nowPlaying });
  }

  async fetchGenres() {
    let uniqueGenreData = [];
    const { spotifyClient } = this.props;

    this.setState({ fetchingGenres: true });
    try {
      const savedTracks = await spotifyClient.getSavedTracksAsync(300);
      if (savedTracks.length < 20) {
        this.props.history.push({
          pathname: "/issue",
          state: { issueHeader: `You must have at least 20 liked / saved songs to continue.` }
        });
      }

      const savedArtists = await spotifyClient.getArtistsFromTracksAsync(savedTracks);
      uniqueGenreData = spotifyClient.getUniqueGenreDataFromArtists(savedArtists);
    } catch (ex) {
      console.log(ex);
      this.props.history.push({
        pathname: "/issue",
        state: { issueHeader: `You must have at least 20 liked / saved songs to continue.`, issueBody: ex }
      });
      return;
    } finally {
      this.setState({ fetchingGenres: false });
    }

    this.simulationDriver.masses = SimulationUtilities.geNBodyItemsFromUniqueGenreData(uniqueGenreData, 8);
    this.setState({ simulatorEnabled: true });
  }

  async handleGenreClick(hitDetectedGravitationalObject) {
    const { spotifyClient } = this.props;

    const genreName = hitDetectedGravitationalObject.domain.genre.name;
    const playlists = await spotifyClient.searchPlaylists(`the sound of ${genreName}`);
    const playlist = playlists.playlists.items[0];
    console.log(playlist);
    const playlistOffset = Math.min(Math.floor(Math.random() * 100), Math.floor(Math.random() * playlist.tracks.total - 1));

    const res = await spotifyClient.getPlaylistTracks(playlist.id, { offset: playlistOffset });
    const song = res.items[0].track;
    console.log("playlist song", song);
    await this.updateNewTrackDataAsync(song.id);

    let currentTrackData = { ...this.state.currentTrackData };
    currentTrackData.playlist = playlist;
    this.setState({ currentTrackData: currentTrackData });
    this.setState({ playlistStartOffset: playlistOffset });
    this.setState({ currentUris: [playlist.uri] });
    this.setState({ playRequested: true });

    this.resetIsPlaying();
    hitDetectedGravitationalObject.domain.isPlaying = true;
  }

  handleGenreMouseEnter(hitDetectedGravitationalObject) {
    this.setState({ simulationCursor: "pointer" });
  }

  handleGenreMouseLeave(hitDetectedGravitationalObject) {
    this.setState({ simulationCursor: "default" });
  }

  async handlePlayerStatusChange(state) {
    console.log("Player Status", state);
    console.log("current traxk data", this.state.currentTrackData);

    if (state.error) {
      this.props.history.push({
        pathname: "/issue",
        state: { issueHeader: `Spotify player error - Type: ${state.errorType}, Error: ${state.error}` }
      });
    }

    const previouslyPlaying = this.state.playing;
    this.setState({ playing: state.isPlaying });
    // if (state.track && state.track.id != this.state.currentTrackData.id) {
    //   await this.updateNewTrackDataAsync(state.track);
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

    this.updateAudioAnalysisVisualizationEffects();
  }

  updateAudioAnalysisVisualizationEffects() {
    const currentTrackData = { ...this.state.currentTrackData };

    //Get the audio analysis segment for the current timestamp (progress in seconds)
    let currentSegment = currentTrackData.analysis.segments.filter(
      s => s.start <= currentTrackData.progressInSeconds && s.start + s.duration > currentTrackData.progressInSeconds
    )[0];

    //If we failed to get a current audio analysis segment... we can't do much here
    if (!currentSegment) return;

    let weightedVolumeAverage = 1;
    const maxLoudness = currentTrackData.analysis.track.loudness;
    const idealRecentSampleCount = 6;
    const recentSegments = currentTrackData.recentLoudnessData;

    //If we have enough recent loudness samples to compare to the current sample
    if (recentSegments.length >= idealRecentSampleCount) {
      weightedVolumeAverage = AudioAnalysisUtilities.getWeightedVolumeAverageForSegment(currentSegment, recentSegments, maxLoudness);
    }

    //Modify the mass and time based on the weighted volume average for the current sample
    this.simulationDriver.dt = 3 * dt * weightedVolumeAverage;
    const mass = this.simulationDriver.masses.filter(m => m.domain.isPlaying)[0];
    if (mass) {
      if (!isNaN(weightedVolumeAverage)) {
        mass.manifestation.radius = mass.domain.basslineRadius + 1.0 * mass.domain.basslineRadius * weightedVolumeAverage;
      }
    }

    //Push the current loudness sample on the set of recent samples and pop the oldest if we're full.
    recentSegments.push(currentSegment.loudness_start);
    if (recentSegments.count > idealRecentSampleCount) recentSegments.pop();
  }

  resetIsPlaying() {
    //Reset's each space item's isPlaying flag contained in its domain-specific info
    for (let i = 0; i < this.simulationDriver.masses.length - 1; i++) {
      const mass = this.simulationDriver.masses[i];
      mass.domain.isPlaying = false;
    }
  }

  async updateNewTrackDataAsync(trackId) {
    const { spotifyClient } = this.props;
    try {
      const res = await spotifyClient.getAudioAnalysisForTrack(trackId);
      const currentTrackData = { ...this.state.currentTrackData, id: trackId, analysis: res, progressInSeconds: 0 };
      this.setState({ currentTrackData });
    } catch (ex) {
      console.log("Issue grabbing track data", ex);
      return;
    }
  }

  handleDeltaTChange(newDt) {
    dt = newDt;
    //Updating the simulator driver's dt will affect it's calculations while animating each frame
    this.simulationDriver.dt = newDt;
  }

  handleMassChange(factor) {
    for (let i = 0; i < this.simulationDriver.masses.length - 1; i++) {
      const mass = this.simulationDriver.masses[i];

      //Calculate a new bassline data based off the default data and the slider value
      const defaultBassLineMass = DomainInfo.getDefaultBasslineMassFromGenreCount(mass.domain.genre.count);
      const defaultBassLineRadius = DomainInfo.getDefaultBasslineRadiusFromGenreCount(mass.domain.genre.count);
      const newBasslineMass = defaultBassLineMass * factor;
      const newBasslineRadius = defaultBassLineRadius * factor;

      //Set both the bassline data and current data.
      mass.domain.basslineMass = newBasslineMass;
      mass.domain.basslineRadius = newBasslineRadius;
      mass.spatial.m = newBasslineMass;
      mass.manifestation.radius = newBasslineRadius;
    }
  }

  handlePlaylistClick() {
    const { currentTrackData } = this.state;

    //Try to parse a navigatable playlist. Do nothing if we can't
    let playlistWebPlayerUrl = "";
    if (currentTrackData.playlist && currentTrackData.playlist.external_urls)
      playlistWebPlayerUrl = currentTrackData.playlist.external_urls.spotify;
    if (!playlistWebPlayerUrl) return;

    //Open the playlist in a specific tab
    window.open(playlistWebPlayerUrl, "_newtab");
  }

  render() {
    const {
      simulationCursor,
      simulatorEnabled,
      simulatorWidth,
      simulatorHeight,
      playlistStartOffset,
      canvasClickable,
      currentUris,
      currentTrackData,
      playRequested,
      playing,
      fetchingGenres
    } = this.state;

    const { accessToken } = this.props;

    let playlistImageUrl = "";
    if (currentTrackData.playlist && currentTrackData.playlist.images) playlistImageUrl = currentTrackData.playlist.images[0].url;

    let playlistName = "";
    if (currentTrackData.playlist) playlistName = currentTrackData.playlist.name;

    console.log(playlistImageUrl);

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ visibility: fetchingGenres ? "visible" : "hidden" }} className="spinner-container">
          <Spinner />
        </div>

        <div className="simulator-container dashboard-text" style={{ width: "100%", height: "100%" }} ref={this.setPage}>
          <div style={{ cursor: canvasClickable ? "pointer" : "default" }}>
            <SpaceSimulator
              simulationDriver={this.simulationDriver}
              isEnabled={simulatorEnabled}
              backgroundColor={"var(--s7)"}
              width={simulatorWidth}
              height={simulatorHeight}
              cursor={simulationCursor}
              onGravitationalObjectClick={async item => this.handleGenreClick(item)}
              onGravitationalObjectMouseEnter={item => this.handleGenreMouseEnter(item)}
              onGravitationalObjectMouseLeave={item => this.handleGenreMouseLeave(item)}
            />
          </div>

          <div className="dashboard-area standard-text" ref={this.setHeader}>
            {playing && (
              <div className="dashboard-info-area playlist-section">
                <div onClick={this.handlePlaylistClick.bind(this)} className="dashboard-section-left playlist-section">
                  <img alt="playlist" style={{ backgroundGolor: "green" }} width="40" height="40" src={playlistImageUrl} />
                  <div style={{ marginLeft: "4px" }}>
                    <label style={{ cursor: "inherit" }}>Playlist</label>
                    <br />
                    <label style={{ cursor: "inherit" }}>{playlistName}</label>
                  </div>
                </div>
              </div>
            )}

            {/* Time Slider */}
            <div className="dashboard-c1-area">
              <div className="dashboard-section-center">
                <label>Time</label>
                <br />
                <Slider
                  step={0.000001}
                  min={0.00001}
                  value={0.0005}
                  max={0.002}
                  onChange={this.handleDeltaTChange.bind(this)}
                  style={{ margin: "10px" }}
                />
              </div>
            </div>

            {/* Mass Slider */}
            <div className="dashboard-c2-area">
              <div className="dashboard-section-center">
                <label>Mass</label>
                <br />
                <Slider step={0.1} min={0.1} value={1} max={3} onChange={this.handleMassChange.bind(this)} style={{ margin: "10px" }} />
              </div>
            </div>
          </div>

          <div ref={this.setFooter}>
            <SpotifyPlayer
              styles={{
                loaderColor: "var(--f1)",
                sliderHandleColor: "var(--f1)",
                sliderTrackColor: "var(--b3)",
                bgColor: "var(--b2)",
                color: "var(--f1)",
                trackNameColor: "var(--f1)",
                trackArtistColor: "var(--f1)"
              }}
              showSaveIcon={true}
              offset={playlistStartOffset}
              callback={async state => this.handlePlayerStatusChange(state)}
              play={playRequested}
              uris={currentUris}
              token={accessToken}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Sposmos);
