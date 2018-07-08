import React, { Component } from 'react';
import { Alert, AsyncStorage, Button, KeyboardAvoidingView, ScrollView, View } from 'react-native';

import config from '../config.json';
import { AutoCompleteTextInput, PlainTextInput } from './TextInputs';
import Strings from './assets/Strings';
import words from './assets/words';
import { decodeTokenArray, generateSignature } from './lib/TokenService';

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

class SignInScreen extends Component {
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
    const urlQuery = `uid=${uid}&time=${now}&hmac=${encodeURIComponent(hmac)}`
    fetch(`${urlBase}?${urlQuery}`).then((res) => {
      if (!res.ok) { throw { code: res.status, message: res.statusText }; }
      return res;
    }).then(async (res) => {
      await AsyncStorage.setItem('user:credentials', JSON.stringify({ uid: uid, token: token }));
      this.props.navigation.navigate('App');
    }).catch((err) => {
      Alert.alert(Strings.tokenVerifyErrorTitle, Strings.tokenVerifyErrorMessage);
    });
  };

  updateTokens(n) {
    return (text) => {
      this.setState((prevState) => {
        tokens = [...prevState.tokens];
        tokens[n-1] = text.toLowerCase();
        return { tokens: tokens };
      });
    };
  }

  render() {
    return (
      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={{ height: 70 }}></View>
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
          <View style={{ height: 70 }}></View>
        </ScrollView>
        <View style={{ margin: 5, width: '97%' }}>
          <Button title={Strings.signIn} onPress={this.signIn} color='forestgreen' />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default SignInScreen;
