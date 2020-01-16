import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Sposmos from "./components/sposmos";
import Begin from "./components/begin";
import NotFound from "./components/notFound";
import Playground from "./components/playground";
import Theme from "./components/common/theme";
import Theming from "./lib/misc/themeing";
import NavBar from "./components/navBar";

import "./App.css";

class App extends Component {
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
        <BrowserRouter>
          <div className="app-container">
            <div className="nav-area">
              <NavBar onThemeClick={this.handleToggleTheme.bind(this)} />
            </div>
            <div style={{ backgroundColor: "blue" }} className="content-area">
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
        </BrowserRouter>
      </Theme>
    );
  }
}

export default App;
