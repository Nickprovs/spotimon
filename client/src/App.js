import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import Main from "./components/main";
import "./App.css";

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    );
  }
}

export default App;
