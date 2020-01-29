import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import Main from "./components/main";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
