import React, { Component } from "react";
import NBodyItem from "../lib/simulation/nBodyItem";
import DomainInfo from "../lib/simulation/info/domainInfo";
import SpotifyPlayer from "react-spotify-web-playback";
import SpaceSimulator from "./common/spaceSimulator";
import nBodyProblem from "../lib/simulation/nBodyProblem";
import SimulationUtilities from "../lib/util/simulationUtilities";
import ElementUtilities from "../lib/util/elementUtilities";
import Slider from "./common/slider";
import Spinner from "./common/spinner";
import { withRouter } from "react-router-dom";

const trailLength = 8;
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

    this.durationCheckTimerId = null;
    this.onDurationCheck = this.onDurationCheck.bind(this);

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
    this.state.simulationDriver = new nBodyProblem({
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

  handleWindowResize() {
    //TODO: No matter the case, we shouldn't be displaying scroll bars. Use a css class to prevent that.
    this.setSimulatorSize();
  }

  async componentDidMount() {
    this.setSimulatorSize();
    window.addEventListener("resize", this.handleWindowResize);
    console.log("footer", this.footer);
    new ResizeObserver(this.handleWindowResize).observe(this.footer);
    await this.fetchGenres();
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
      const savedArtists = await spotifyClient.getArtistsFromTracksAsync(savedTracks);
      uniqueGenreData = spotifyClient.getUniqueGenreDataFromArtists(savedArtists);
    } catch (ex) {
      console.log(ex);
    } finally {
      this.setState({ fetchingGenres: false });
    }

    const genresToUseCount = Math.min(25, uniqueGenreData.length);
    const quarterSize = genresToUseCount.length / 4;
    const threeQuarterMark = 3 * (quarterSize - 1);
    const frequentedGenres = uniqueGenreData.slice(0, threeQuarterMark);
    const unfrequentedGenres = uniqueGenreData.slice(threeQuarterMark, genresToUseCount - 1);
    const genres = frequentedGenres.concat(unfrequentedGenres);

    for (let genre of genres) {
      const defaultMass = DomainInfo.getDefaultBasslineMassFromGenreCount(genre.count);

      const manifestationArgs = {
        defaultMass: defaultMass,
        trailLength: trailLength,
        radius: DomainInfo.getDefaultBasslineRadiusFromGenreCount(genre.count),
        hasRing: Math.random() > 0.6
      };

      const spatialArgs = {
        m: defaultMass,
        ...SimulationUtilities.getRandomGravitationalObjectData()
      };

      const domainArgs = {
        genre: genre
      };

      let mass = new NBodyItem(spatialArgs, manifestationArgs, domainArgs);
      this.state.simulationDriver.masses.push(mass);
    }
    this.setState({ simulatorEnabled: true });
  }

  async handleGenreClick(hitDetectedGravitationalObject) {
    const { spotifyClient } = this.props;

    const genreName = hitDetectedGravitationalObject.domain.genre.name;
    const playlists = await spotifyClient.searchPlaylists(`the sound of ${genreName}`);
    const playlist = playlists.playlists.items[0];
    console.log(playlist);
    const playlistOffset = Math.min(
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * playlist.tracks.total - 1)
    );

    const res = await spotifyClient.getPlaylistTracks(playlist.id, { offset: playlistOffset });
    const song = res.items[0].track;
    console.log("playlist song", song);
    await this.updateNewTrackData(song.id);

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

    const mass = this.state.simulationDriver.masses.filter(m => m.domain.isPlaying)[0];
    if (mass) {
      if (!isNaN(timeCoeffecient)) {
        mass.manifestation.radius = mass.domain.basslineRadius + 1.0 * mass.domain.basslineRadius * timeCoeffecient;
      }
    }

    if (matchingSegmentForTime) {
      currentTrackData.recentLoudnessData.push(matchingSegmentForTime.loudness_start);
      if (currentTrackData.recentLoudnessData.count > averageRecentLength) currentTrackData.recentLoudnessData.pop();
    }
  }

  resetIsPlaying() {
    for (let i = 0; i < this.state.simulationDriver.masses.length - 1; i++) {
      const mass = this.state.simulationDriver.masses[i];
      mass.domain.isPlaying = false;
    }
  }

  async updateNewTrackData(trackId) {
    const { spotifyClient } = this.props;

    const res = await spotifyClient.getAudioAnalysisForTrack(trackId);
    const currentTrackData = { ...this.state.currentTrackData, id: trackId, analysis: res, progressInSeconds: 0 };
    this.setState({ currentTrackData });
  }

  handleDeltaTChange(newDt) {
    dt = newDt;
    this.state.simulationDriver.dt = newDt;
  }
  handleMassChange(factor) {
    console.log("hi");
    for (let i = 0; i < this.state.simulationDriver.masses.length - 1; i++) {
      const mass = this.state.simulationDriver.masses[i];
      const defaultBassLineMass = DomainInfo.getDefaultBasslineMassFromGenreCount(mass.domain.genre.count);
      const defaultBassLineRadius = DomainInfo.getDefaultBasslineRadiusFromGenreCount(mass.domain.genre.count);
      const newBasslineMass = defaultBassLineMass * factor;
      const newBasslineRadius = defaultBassLineRadius * factor;

      mass.domain.basslineMass = newBasslineMass;
      mass.domain.basslineRadius = newBasslineRadius;

      mass.spatial.m = newBasslineMass;
      mass.manifestation.radius = newBasslineRadius;
    }
  }

  handlePlaylistClick() {
    const { currentTrackData } = this.state;
    let playlistWebPlayerUrl = "";
    if (currentTrackData.playlist && currentTrackData.playlist.external_urls)
      playlistWebPlayerUrl = currentTrackData.playlist.external_urls.spotify;

    if (!playlistWebPlayerUrl) return;

    window.open(playlistWebPlayerUrl, "_newtab");
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
      canvasClickable,
      currentUris,
      currentTrackData,
      playRequested,
      playing,
      fetchingGenres
    } = this.state;

    const { accessToken } = this.props;

    let playlistImageUrl = "";
    if (currentTrackData.playlist && currentTrackData.playlist.images)
      playlistImageUrl = currentTrackData.playlist.images[0].url;

    let playlistName = "";
    if (currentTrackData.playlist) playlistName = currentTrackData.playlist.name;

    console.log(playlistImageUrl);

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ visibility: fetchingGenres ? "visible" : "hidden" }} className="spinner-container">
          <Spinner />
        </div>

        <div
          className="simulator-container dashboard-text"
          style={{ width: "100%", height: "100%" }}
          ref={this.setPage}
        >
          <div style={{ cursor: canvasClickable ? "pointer" : "default" }}>
            <SpaceSimulator
              simulationDriver={simulationDriver}
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
                  <img style={{ backgroundGolor: "green" }} width="40" height="40" src={playlistImageUrl} />
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
                <Slider
                  step={0.1}
                  min={0.1}
                  value={1}
                  max={3}
                  onChange={this.handleMassChange.bind(this)}
                  style={{ margin: "10px" }}
                />
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
