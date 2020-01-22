import React, { Component } from "react";
import UrlUtilities from "../lib/util/urlUtilities";

class Callback extends Component {
  state = {};
  render() {
    return <h1>Callback</h1>;
  }

  componentDidMount() {
    let urlParams = UrlUtilities.getUrlHashParams();
    this.props.onCallback(urlParams);
  }
}

export default Callback;
