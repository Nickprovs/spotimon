import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import "../styles/navBar.css";

class NavBar extends Component {
  state = {
    isOpen: false
  };

  constructor(props) {
    super(props);

    this.navBar = null;
    this.setNavBarRef = element => {
      this.navBar = element;
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleGlobalClick.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleGlobalClick.bind(this));
  }

  handleGlobalClick(event) {
    if (this.navBar && !this.navBar.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  handleNavBarClick() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleTitleBarClick() {
    if (this.state.isOpen) this.setState({ isOpen: false });
  }

  render() {
    const { onThemeClick } = this.props;
    return (
      <div ref={this.setNavBarRef} className="nav">
        <input
          type="checkbox"
          id="nav-check"
          onChange={this.handleNavBarClick.bind(this)}
          checked={this.state.isOpen}
        />
        <div className="nav-header">
          <Link
            onClick={this.handleTitleBarClick.bind(this)}
            to="/"
            style={{ textDecoration: "none" }}
            className="nav-title"
          >
            sposmos
          </Link>
        </div>
        <div className="nav-btn">
          <label htmlFor="nav-check">
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>

        <div className="nav-links" onClick={this.handleNavBarClick.bind(this)}>
          <a rel="noopener noreferrer" target="_blank" href="http://www.nickprovs.com">
            Author
          </a>
          <a style={{ cursor: "pointer" }} onClick={onThemeClick}>
            Theme
          </a>
        </div>
      </div>
    );
  }
}

export default NavBar;
