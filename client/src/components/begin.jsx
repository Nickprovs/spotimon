import React, { Component } from "react";
import ElementUtilities from "../lib/util/elementUtilities";

class Begin extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="enter-container">
        <div style={{ backgroundColor: "orange" }} className="banner-area">
          <div>hi</div>
          <div>hi</div>
          <div>hi</div>
          <div>hi</div>
          <div>hi</div>
          <div>hi</div>
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

        <div style={{ backgroundColor: "violet" }} className="info-area">
          info
        </div>

        <div style={{ backgroundColor: "aqua" }} className="enter-area">
          enter
        </div>
      </div>
    );
  }
}

export default Begin;
