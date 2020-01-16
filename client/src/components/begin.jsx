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
            muted="true"
            preload="true"
            autoPlay="true"
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
                <li>Spotify Premium Membership</li>
                <li>Your "Liked Songs" Playlist must have some content.</li>
              </ul>
            </li>
            <li>
              What Is This?
              <ul>
                <li>Explore your taste from most to least frequented genres.</li>
                <li>Visualize your taste through the mass of your genres and the way they "bump" to the music.</li>
                <li>Hit "Begin" to authenticate directly with Spotify.</li>
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
            <StandardButton>Begin</StandardButton>
          </div>
        </div>
      </div>
    );
  }
}

export default Begin;
