import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Sposmos from "./components/sposmos";
import Begin from "./components/begin";
import NotFound from "./components/notFound";
import "./App.css";

class App extends Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/simulation" render={props => <Sposmos />} />
            <Route path="/begin" render={props => <Begin />} />
            <Route path="/not-found" render={props => <NotFound />} />
            <Redirect exact from="/" to="/begin" />
            <Redirect to="/not-found" />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
