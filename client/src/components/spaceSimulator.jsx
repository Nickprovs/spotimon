import React, { Component } from "react";

class SpaceSimulator extends Component {
  state = {};

  constructor() {
    super();
  }
  componentDidMount() {
    this.canvas = null;
    this.setCanvas = element => {
      this.canvas = element;
    };
  }

  render() {
    const { width, height, canvasClickable } = this.props;
    return (
      <div style={{ cursor: canvasClickable ? "pointer" : "default" }}>
        <canvas
          onMouseMove={e => this.handleMouseMove(e)}
          onClick={async e => await this.handleCanvasClick(e)}
          style={{ backgroundColor: "#0c1d40" }}
          ref={this.setCanvas}
          width={width}
          height={height}
        />
      </div>
    );
  }
}

export default SpaceSimulator;
