import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

import Login from '../login/Login.js';
import Table from '../table/Table.js';
import Item from '../item/Item.js';

const loggedInRender = () => {
  return sessionStorage.getItem('credentials') ? (
    <Redirect to="/jacket" />
  ) : (
    <Redirect to="/login" />
  );
};

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="jumbotron text-center">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <div className="container">
            <Route exact path="/" render={loggedInRender}/>
            <Route exact path="/login" component={Login} />
            <Route exact path="/jacket" component={Table} />
            <Route exact path="/jacket/:jid" component={Item} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
