import React, { Component } from "react";
import Theme from "./common/theme";
import Theming from "../lib/misc/themeing";
import Sposmos from "./sposmos";
import Begin from "./begin";
import NotFound from "./notFound";
import Playground from "./playground";
import NavBar from "./navBar";
import Callback from "./callback";
import Issue from "./issue";
import { withRouter, Route, Redirect, Switch } from "react-router-dom";
import SpotifyClient from "../lib/http/spotifyClient";

const tokenValidityTime = 5000; //3500000;

class Main extends Component {
  state = {
    darkModeOn: true,
    accessToken: ""
  };

  constructor() {
    super();
    this.theming = new Theming();
    this.refreshToken = "";
    this.spotifyClient = new SpotifyClient();

    this.handleTokenTimeout = this.handleTokenTimeout.bind(this);
  }

  componentDidMount() {
    this.setState({
      darkModeOn: this.theming.getSavedDarkModeOnStatus()
    });

    this.redirectIfOnInvalidPageForState();
  }

  redirectIfOnInvalidPageForState() {
    console.log("mounted at", this.props.location.pathname);
    if (this.props.location.pathname == "/simulation" && !this.state.accessToken)
      this.props.history.push({ pathname: "/begin" });
  }

  handleToggleTheme() {
    const darkModeOn = !this.state.darkModeOn;
    this.setState({ darkModeOn });
    this.theming.saveDarkModeOnStatus(darkModeOn);
  }

  async handleCallback(urlParams) {
    if (!urlParams.access_token || !urlParams.refresh_token)
      this.props.history.push({ pathname: "/issue", state: { issue: "Data was not passed from spotify callback." } });

    this.spotifyClient.setAccessToken(urlParams.access_token);

    let userProfile = null;
    try {
      userProfile = await this.spotifyClient.getMe();
    } catch (ex) {
      this.props.history.push({ pathname: "/issue", state: { issue: "Could not retrieve user profile." } });
      return;
    }

    if (!userProfile) {
      this.props.history.push({ pathname: "/issue", state: { issue: "Could not retrieve user profile." } });
      return;
    }

    if (userProfile.product != "premium") {
      this.props.history.push({ pathname: "/issue", state: { issue: "Spotify premium is required for this app." } });
      return;
    }

    this.props.history.push({ pathname: "/simulation" });
    this.setState({ accessToken: urlParams.access_token });
    setInterval(this.handleTokenTimeout, tokenValidityTime);
  }

  handleTokenTimeout() {
    console.log("going to try and request a new token");
  }

  render() {
    const theme = this.state.darkModeOn ? Theme.Dark : Theme.Light;
    const { accessToken } = this.state;

    return (
      <Theme variables={theme}>
        <div className="app-container">
          <div className="nav-area">
            <NavBar onThemeClick={this.handleToggleTheme.bind(this)} />
          </div>
          <div className="content-area">
            <Switch>
              <Route path="/playground" render={props => <Playground />} />
              <Route
                path="/simulation"
                render={props => <Sposmos spotifyClient={this.spotifyClient} accessToken={accessToken} />}
              />
              <Route path="/begin" render={props => <Begin />} />
              <Route path="/callback" render={props => <Callback onCallback={this.handleCallback.bind(this)} />} />
              <Route path="/issue" component={Issue} />
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

export default withRouter(Main);
