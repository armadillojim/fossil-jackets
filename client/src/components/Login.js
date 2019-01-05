import React, { Component } from 'react';

import config from './config.json';
import { AutoCompleteTextInput, PlainTextInput } from './TextInputs.js';
import Strings from './assets/Strings.js';
import words from './assets/words.js';
import { decodeTokenArray, generateSignature } from './lib/TokenService.js';

class TokenInput extends Component {
  render() {
    const { n, onChange } = this.props;
    const label = `${Strings.token} #${n}`;
    return (
      <AutoCompleteTextInput
        label={label}
        onChangeText={onChange}
        placeholder={label}
        suggestions={words}
      />
    );
  }
}

class Login extends Component {
  static navigationOptions = {
    title: Strings.pleaseSignIn,
  };

  constructor(props) {
    super(props);
    this.state = {
      uid: null,
      tokens: Array(6).fill(''),
    };
    this.updateTokens = this.updateTokens.bind(this);
  }

  // NB: URL and URLSearchParams are not yet supported.  We would otherwise do:
  //   const url = new URL(`https://${config.domain}/api${path}`);
  //   url.search = new URLSearchParams({ uid: uid, time: now, hmac: hmac });
  // Also, uid is from Number() applied to user-generated content so should be safe.
  signIn = () => {
    const { uid, tokens } = this.state;
    const token = decodeTokenArray(tokens);
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

  updateTokens(n) {
    return (text) => {
      this.setState((prevState) => {
        const tokens = [...prevState.tokens];
        tokens[n-1] = text.toLowerCase();
        return { tokens: tokens };
      });
    };
  }

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
        <TokenInput n={1} onChange={this.updateTokens(1)} />
        <TokenInput n={2} onChange={this.updateTokens(2)} />
        <TokenInput n={3} onChange={this.updateTokens(3)} />
        <TokenInput n={4} onChange={this.updateTokens(4)} />
        <TokenInput n={5} onChange={this.updateTokens(5)} />
        <TokenInput n={6} onChange={this.updateTokens(6)} />
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
