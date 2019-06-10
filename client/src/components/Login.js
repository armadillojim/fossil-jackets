import React, { Component } from 'react';

import config from './config.json';
import { PlainTextInput } from './TextInputs.js';
import Strings from './assets/Strings.js';
import { tokenFromPassword, generateSignature } from './lib/TokenService.js';

import './Login.css';

class Login extends Component {
  static navigationOptions = {
    title: Strings.pleaseSignIn,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      waiting: false,
    };
  }

  // NB: URL and URLSearchParams are not yet supported.  We would otherwise do:
  //   const url = new URL(`https://${config.domain}/api${path}`);
  //   url.search = new URLSearchParams({ email: email, time: now, hmac: hmac });
  signIn = () => {
    const email = this.state.email.toLowerCase();
    const password = this.state.password;
    const token = tokenFromPassword(email, password);
    const now = Date.now();
    const path = '/token/verify';
    const hmac = generateSignature({ email: email, path: path, time: now }, token);
    const urlBase = `https://${config.domain}/api${path}`;
    const urlQuery = `email=${encodeURIComponent(email)}&time=${now}&hmac=${encodeURIComponent(hmac)}`;
    this.setState({ waiting: true });
    fetch(`${urlBase}?${urlQuery}`).then((res) => {
      this.setState({ waiting: false });
      if (!res.ok) { throw { code: res.status, message: res.statusText }; }
      return res.json();
    }).then((res) => {
      sessionStorage.setItem('user:credentials', JSON.stringify({ uid: res.uid, token: token }));
      this.props.history.replace('/jacket');
    }).catch((err) => {
      alert(Strings.tokenVerifyErrorMessage);
      this.setState({ waiting: false });
    });
  };

  render() {
    const getFillStyle = (delay) => ({ animationDelay: `-${delay}s` });
    return this.state.waiting ? (
      <div className="waiting">
        <div style={{ animationDuration: '0.8s' }} className="dots">
          <div className="circle" style={getFillStyle(0.3)} />
          <div className="circle" style={getFillStyle(0.2)} />
          <div className="circle" style={getFillStyle(0.1)} />
        </div>
        <div className="signingIn">{Strings.signingIn}</div>
      </div>
    ) : (
      <div>
        <div><h3>{Strings.pleaseSignIn}</h3></div>
        <PlainTextInput
          keyboardType={'email'}
          label={Strings.email}
          onChangeText={(text) => this.setState({ email: text })}
          placeholder={Strings.email}
        />
        <PlainTextInput
          keyboardType={'password'}
          label={Strings.password}
          onChangeText={(text) => this.setState({ password: text })}
          placeholder={Strings.password}
        />
        <div style={{ margin: 5, width: '97%' }}>
          <button title={Strings.signIn} onClick={this.signIn} style={{ color: 'white', backgroundColor: 'forestgreen' }}>
            {Strings.signIn}
          </button>
        </div>
      </div>
    );
  }
}

export default Login;
