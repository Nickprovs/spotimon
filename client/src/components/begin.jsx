import React, { Component } from "react";
import ElementUtilities from "../lib/util/elementUtilities";

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

        <div className="info-area">info</div>

        <div className="enter-area">enter</div>
      </div>
    );
  }
}

export default Begin;
