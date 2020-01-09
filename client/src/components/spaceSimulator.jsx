import React, { Component } from "react";
import MathUtilities from "../lib/util/mathUtilities";

class SpaceSimulator extends Component {
  state = {};

  constructor() {
    super();

    //Animation
    this.animationId = null;
    this.isAnimating = false;
    this.animate = this.animate.bind(this);

    //Canvas
    this.canvasMousePosition = { x: -1, y: -1 };
    this.currentMouseOverObject = null;
    this.canvas = null;
    this.setCanvas = element => {
      this.canvas = element;
    };
  }

  componentDidMount() {
    this.canvasContext = this.canvas.getContext("2d");
  }

  animate() {
    const { simulationDriver, width, height } = this.props;

    simulationDriver.updatePositionVectors();
    simulationDriver.updateAccelerationVectors();
    simulationDriver.updateVelocityVectors();

    this.canvasContext.clearRect(0, 0, width, height);

    for (let i = 0; i < simulationDriver.masses.length; i++) {
      const massI = simulationDriver.masses[i];
      const x = width / 2 + massI.x * simulationDriver.scale;
      const y = height / 2 + massI.y * simulationDriver.scale;

      massI.manifestation.draw(this.canvasContext, x, y);

      if (massI.name) {
        this.canvasContext.font = "14px Arial";
        this.canvasContext.fillText(massI.name, x + 12, y + 4);
        this.canvasContext.fill();
      }

      const edgeX = width / 2 / simulationDriver.scale;
      //Past Negative X Dir
      if (massI.x < -edgeX) {
        massI.x = edgeX;
        massI.y *= -1;
        massI.vx /= 2;
        continue;
      }

      //Past Positive X Dir
      if (massI.x > edgeX) {
        massI.x = -edgeX;
        massI.y *= -1;
        massI.vx /= 2;
        continue;
      }

      const edgeY = height / 2 / simulationDriver.scale;
      //Past Negative Y Dir
      if (massI.y < -edgeY) {
        massI.y = edgeY;
        massI.x *= -1;
        massI.vy /= 2;
        continue;
      }

      //Past Negative Y Dir
      if (massI.y > edgeY) {
        massI.y = -edgeY;
        massI.x *= -1;
        massI.vy /= 2;
        continue;
      }
    }

    this.animationId = requestAnimationFrame(this.animate);
  }

  //Sets current canvas mouse position as a global variable
  //Hit detection handled when animating to avoid duplicate iteration
  handleCanvasMouseMove(e) {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    this.canvasMousePosition.x = x;
    this.canvasMousePosition.y = y;

    const { simulationDriver, onGravitationalObjectMouseEnter, onGravitationalObjectMouseLeave } = this.props;

    let gravitationalObjectUnderCursor = null;
    const massesLen = simulationDriver.masses.length;

    for (let i = 0; i < massesLen; i++) {
      const massI = simulationDriver.masses[i];
      for (let j = 0; j < massI.manifestation.positions.length; j++) {
        const scaleFactor = j / massI.manifestation.positions.length;
        const massPosition = massI.manifestation.positions[j];
        if (
          MathUtilities.isPointWithinCircle(
            this.canvasMousePosition.x,
            this.canvasMousePosition.y,
            massPosition.x,
            massPosition.y,
            scaleFactor * massI.manifestation.radius
          )
        ) {
          gravitationalObjectUnderCursor = massI;
          break;
        }
        if (gravitationalObjectUnderCursor) break;
      }
    }
    if (gravitationalObjectUnderCursor && this.currentMouseOverObject !== gravitationalObjectUnderCursor) {
      this.currentMouseOverObject = gravitationalObjectUnderCursor;
      onGravitationalObjectMouseEnter(gravitationalObjectUnderCursor);
    }

    if (!gravitationalObjectUnderCursor && this.currentMouseOverObject) {
      onGravitationalObjectMouseLeave(this.currentMouseOverObject);
      this.currentMouseOverObject = null;
    }
  }
  //Detects if a hit has occured on the canvas
  //Calls onGravitationalObjectClicked if there's a hit (passed in via props)
  handleCanvasMouseClick(e) {
    const { simulationDriver, onGravitationalObjectClick } = this.props;

    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    const massesLen = simulationDriver.masses.length;
    let hitDectectionSuccessful = false;
    let hitDetectedMass = null;

    for (let i = 0; i < massesLen; i++) {
      const massI = simulationDriver.masses[i];

      for (let i = 0; i < massI.manifestation.positions.length; i++) {
        const massPosition = massI.manifestation.positions[i];
        const scaleFactor = i / massI.manifestation.positions.length;

        if (
          MathUtilities.isPointWithinCircle(
            mouseX,
            mouseY,
            massPosition.x,
            massPosition.y,
            massI.manifestation.radius * scaleFactor
          )
        ) {
          console.log("clicked", massI.name);
          hitDectectionSuccessful = true;
          hitDetectedMass = massI;
          break;
        }
      }

      if (hitDectectionSuccessful) break;
    }

    if (!hitDectectionSuccessful) return;

    onGravitationalObjectClick(hitDetectedMass);
  }

  setAnimation(shouldAnimate) {
    console.log("setting anim status", shouldAnimate);
    if (shouldAnimate && !this.isAnimating) {
      this.animationId = requestAnimationFrame(this.animate);
      console.log("got animation id", this.animationId);
      this.isAnimating = true;
    }

    if (!shouldAnimate && this.isAnimating) {
      cancelAnimationFrame(this.animationId);
      this.isAnimating = false;
      this.animationId = null;
    }
  }

  render() {
    const { isEnabled, width, height, canvasClickable, backgroundColor, cursor } = this.props;
    this.setAnimation(isEnabled);

    console.log("render width", width);
    console.log("background color", backgroundColor);
    return (
      <div style={{ cursor: canvasClickable ? "pointer" : "default" }}>
        <canvas
          ref={this.setCanvas}
          onMouseMove={e => this.handleCanvasMouseMove(e)}
          onClick={async e => await this.handleCanvasMouseClick(e)}
          style={{ backgroundColor: backgroundColor, cursor: cursor }}
          width={width}
          height={height}
        />
      </div>
    );
  }
}

export default SpaceSimulator;
