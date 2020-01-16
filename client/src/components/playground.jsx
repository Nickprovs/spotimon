import React, { Component } from "react";
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
        <div className="content" style={{ backgroundColor: "blue", height: "968px" }}>
          CONTENT
        </div>
        <div className="footer" style={{ backgroundColor: "purple" }}>
          FOOTER
        </div>
      </div>
    );
  }
}

export default Playground;
