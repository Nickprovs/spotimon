import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Sposmos from "./components/sposmos";
import Begin from "./components/begin";
import NotFound from "./components/notFound";
import Playground from "./components/playground";
import Theme from "./components/common/theme";
import NavBar from "./components/navBar";

import "./App.css";

class App extends Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  handleToggleTheme() {
    console.log("theme toggled");
  }

  render() {
    const theme = Theme.Dark;

    return (
      <Theme variables={theme}>
        <BrowserRouter>
          <div className="app-container">
            <div style={{ backgroundColor: "red" }} className="nav-area">
              <div className="nav-area" style={{ backgroundColor: "red" }}>
                <NavBar onThemeClick={this.handleToggleTheme.bind(this)} />
              </div>
            </div>
            <div className="content-area">
              <Begin />
            </div>

            {/*<div style={{ backgroundColor: "blue" }} className="content-area">
              <Switch>
                <Route path="/playground" render={props => <Playground />} />
                <Route path="/simulation" render={props => <Sposmos />} />
                <Route path="/begin" render={props => <Begin />} />
                <Route path="/not-found" render={props => <NotFound />} />
                <Redirect exact from="/" to="/begin" />
                <Redirect to="/not-found" />
              </Switch>
            </div> */}
          </div>
        </BrowserRouter>
      </Theme>
    );
  }
}

export default App;
