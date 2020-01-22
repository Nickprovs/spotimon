import React, { Component } from "react";
import Theme from "./common/theme";
import Theming from "../lib/misc/themeing";
import Sposmos from "./sposmos";
import Begin from "./begin";
import NotFound from "./notFound";
import Playground from "./playground";
import NavBar from "./navBar";
import { Route, Redirect, Switch } from "react-router-dom";

class Main extends Component {
  state = {
    darkModeOn: true
  };

  constructor() {
    super();
    this.theming = new Theming();
  }

  componentDidMount() {
    this.setState({
      darkModeOn: this.theming.getSavedDarkModeOnStatus()
    });
  }

  handleToggleTheme() {
    const darkModeOn = !this.state.darkModeOn;
    this.setState({ darkModeOn });
    this.theming.saveDarkModeOnStatus(darkModeOn);
  }

  render() {
    const theme = this.state.darkModeOn ? Theme.Dark : Theme.Light;

    return (
      <Theme variables={theme}>
        <div className="app-container">
          <div className="nav-area">
            <NavBar onThemeClick={this.handleToggleTheme.bind(this)} />
          </div>
          <div className="content-area">
            <Switch>
              <Route path="/playground" render={props => <Playground />} />
              <Route path="/simulation" render={props => <Sposmos />} />
              <Route path="/begin" render={props => <Begin />} />
              <Route path="/not-found" render={props => <NotFound />} />
              <Redirect exact from="/" to="/begin" />
              <Redirect to="/not-found" />
            </Switch>
          </div>
        </div>
      </Theme>
    );
  }
}

export default Main;
