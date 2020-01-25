import React, { Component } from "react";
import StandardButton from "./common/standardButton";

class Begin extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="enter-container">
        <div className="banner-area">
          <h2 className="banner-text standard-text">The Universe Bumps With You</h2>
        </div>
        <div className="preview-area">
          <video
            className="preview-video"
            width="100%"
            height="100%"
            id="preview"
            muted={true}
            preload="auto"
            autoPlay={true}
            loop="loop"
            style={{ objectFit: "cover" }}
          >
            <source src="/Videos/preview.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="info-area">
          <ul className="standard-text info-list">
            <li>
              Requirements
              <ul>
                <li>Spotify Premium</li>
                <li>"Liked Songs" Playlist must have content.</li>
              </ul>
            </li>
            <li>
              What Is This?
              <ul>
                <li>Explore your most and least frequented genres.</li>
                <li>Discover something new in your sposmos.</li>
                <li>Visualize your tunes.</li>
              </ul>
            </li>
          </ul>
        </div>

        {/* What Is This?
              <ul>
                <li>Explore your recent musical taste from your most frequented to least frequented genres.</li>
                <li>Visualize your taste by the size of the genres and the way they "bump" to the music.</li>

                <li>Hit "Begin" to authenticate directly with Spotify.</li>
              </ul> */}
        <div className="enter-area">
          <div className="enter-button-container">
            <a href="http://localhost:8888/login">
              <StandardButton>Login With Spotify</StandardButton>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Begin;
