import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="jumbotron text-center">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Welcome to fossil jackets!</h1>
        </div>
        <div className="container">
        </div>
      </div>
    );
  }
}

export default App;
