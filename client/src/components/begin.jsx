import React, { Component } from "react";

class Begin extends Component {
  state = {};
  render() {
    return (
      <div>
        <h1>Begin</h1>
        <video width="100%" height="auto" id="preview" preload="true" autoPlay="true" loop="loop">
          <source src="/Videos/preview.mp4" type="video/mp4" />
          {/* <source src="myVideo.webm" type="video/webm" />
          <source src="myVideo.ogv" type="video/ogg" /> */}
        </video>
      </div>
    );
  }
}

export default Begin;
