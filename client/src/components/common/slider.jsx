import React, { Component } from "react";
import "../../styles/slider.css";

class Slider extends Component {
  state = {
    value: 50,
    min: 1,
    max: 100
  };

  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    const { min, max, value, step } = this.props;
    this.setState({ step });
    this.setState({ min });
    this.setState({ max });
    this.setState({ value });
  }

  handleInput(e) {
    console.log("test", e.target.value);
    const { onChange } = this.props;
    this.setState({ value: e.target.value });
    if (onChange) onChange(e.target.value);
  }

  render() {
    const { min, max, value, step } = this.state;

    return (
      <div class="slidecontainer">
        <input
          step={step}
          onChange={value => this.handleInput(value)}
          type="range"
          min={min}
          max={max}
          value={value}
          class="slider"
        />
      </div>
    );
  }
}

export default Slider;
