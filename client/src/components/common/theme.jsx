import React, { Component, createRef } from "react";
import LightTheme from "../../styles/themes/lightTheme";
import DarkTheme from "../../styles/themes/darkTheme";

class Theme extends Component {
  node = createRef();

  componentDidMount() {
    this.updateCSSVariables();
  }

  componentDidUpdate(prevProps) {
    if (this.props.variables !== prevProps.variables) {
      this.updateCSSVariables();
    }
  }

  updateCSSVariables() {
    Object.entries(this.props.variables).forEach(([prop, value]) => this.node.current.style.setProperty(prop, value));
  }

  render() {
    const { children } = this.props;
    return <div ref={this.node}>{children}</div>;
  }
}

Theme.Dark = DarkTheme;
Theme.Light = LightTheme;

export default Theme;
