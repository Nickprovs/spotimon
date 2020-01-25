import React, { Component } from "react";
import UrlUtilities from "../lib/util/urlUtilities";

class Callback extends Component {
  state = {};
  render() {
    return (
      <div style={{ margin: "10px" }} className="center-wrapper">
        <h1>Callback</h1>
        <br />
        <h1>Preparing to redirect...</h1>
      </div>
    );
  }

  componentDidMount() {
    let urlParams = UrlUtilities.getUrlHashParams();
    this.props.onCallback(urlParams);
  }
}

export default Callback;
