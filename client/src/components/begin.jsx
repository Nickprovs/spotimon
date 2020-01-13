import React, { Component } from "react";

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
    this.setState({ headerHeight: window.innerHeight * 0.2 });
    this.setState({ contentHeight: window.innerHeight * 0.6 });
    this.setState({ footerHeight: window.innerHeight * 0.2 });
  }

  render() {
    const { headerHeight, contentHeight, footerHeight } = this.state;
    return (
      <div>
        {/* Intro Info */}
        <div style={{ height: headerHeight, textAlign: "center" }}>
          <h1>Begin</h1>
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
        <div style={{ height: footerHeight, textAlign: "center" }}>
          <button>Hi there</button>
        </div>
      </div>
    );
  }
}

export default Begin;
