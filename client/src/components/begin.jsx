import React, { Component } from "react";
import ElementUtilities from "../lib/util/elementUtilities";

class Begin extends Component {
  state = {
    headerHeight: 100,
    contentHeight: 300,
    footerHeight: 100
  };

  constructor() {
    super();
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);
    this.sizeContentToWindow();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize() {
    this.sizeContentToWindow();
  }

  sizeContentToWindow() {
    this.setState({ headerHeight: window.innerHeight * 0.98 * 0.1 });
    this.setState({ contentHeight: window.innerHeight * 0.98 * 0.45 });
    this.setState({ footerHeight: window.innerHeight * 0.98 * 0.45 });
  }

  render() {
    const { headerHeight, contentHeight, footerHeight } = this.state;
    return (
      <div>
        {/* Intro Info */}
        <div style={{ backgroundColor: "#0c1d40", height: headerHeight, textAlign: "center" }}>
          <div style={{ display: "inline-block", verticalAlign: "middle" }}>
            <h1 style={{ color: "white", fontSize: "32" }} className="standard-text">
              The Universe Bumps With You
            </h1>
          </div>
        </div>

        {/* Preview */}
        <div style={{ height: contentHeight, textAlign: "center" }}>
          <video
            height={contentHeight}
            width="100%"
            className="preview-video"
            style={{ objectFit: "cover" }}
            filt
            id="preview"
            muted="true"
            preload="true"
            autoPlay="true"
            loop="loop"
          >
            <source src="/Videos/preview.mp4" type="video/mp4" />
            {/* <source src="myVideo.webm" type="video/webm" />
            <source src="myVideo.ogv" type="video/ogg" /> */}
          </video>
        </div>

        {/* Begin */}
        <div style={{ backgroundColor: "#0c1d40", height: footerHeight, textAlign: "center" }}>
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <button>Begin</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Begin;
