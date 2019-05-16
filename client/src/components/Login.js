import React, { Component } from 'react';

import config from './config.json';
import { PlainTextInput } from './TextInputs.js';
import Strings from './assets/Strings.js';
import { tokenFromPassword, generateSignature } from './lib/TokenService.js';

class Login extends Component {
  static navigationOptions = {
    title: Strings.pleaseSignIn,
  };

  constructor(props) {
    super(props);
    this.state = {
      uid: null,
      email: null,
      password: null,
    };
  }

  // NB: URL and URLSearchParams are not yet supported.  We would otherwise do:
  //   const url = new URL(`https://${config.domain}/api${path}`);
  //   url.search = new URLSearchParams({ uid: uid, time: now, hmac: hmac });
  // Also, uid is from Number() applied to user-generated content so should be safe.
  signIn = () => {
    const { uid, email, password } = this.state;
    const token = tokenFromPassword(email, password);
    const now = Date.now();
    const path = '/token/verify';
    const hmac = generateSignature({ uid: uid, time: now, path: path }, token);
    const urlBase = `https://${config.domain}/api${path}`;
    const urlQuery = `uid=${uid}&time=${now}&hmac=${encodeURIComponent(hmac)}`;
    fetch(`${urlBase}?${urlQuery}`).then((res) => {
      if (!res.ok) { throw { code: res.status, message: res.statusText }; }
      return res;
    }).then((res) => {
      sessionStorage.setItem('user:credentials', JSON.stringify({ uid: uid, token: token }));
      this.props.history.replace('/jacket');
    }).catch((err) => {
      alert(Strings.tokenVerifyErrorMessage);
    });
  };

  render() {
    return (
      <div>
        <div><h3>{Strings.pleaseSignIn}</h3></div>
        <PlainTextInput
          keyboardType={'numeric'}
          label={Strings.userID}
          onChangeText={(text) => this.setState({ uid: Number(text) })}
          placeholder={Strings.userID}
        />
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
