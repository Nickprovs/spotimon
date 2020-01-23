import React, { Component } from "react";
import Spinner from "./common/spinner";

class Playground extends Component {
  state = {};
  render() {
    return (
      <div className="container">
        <div className="header" style={{ backgroundColor: "red" }}>
          HEADER
        </div>
        <div className="menu " style={{ backgroundColor: "green" }}>
          MENU
        </div>
        <div className="content" style={{ backgroundColor: "tomato", height: "968px" }}>
          <Spinner />
        </div>
        <div className="footer" style={{ backgroundColor: "purple" }}>
          FOOTER
        </div>
      </div>
    );
  }
}

export default Playground;
