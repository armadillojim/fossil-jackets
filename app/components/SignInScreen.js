import React, { Component } from 'react';
import { Alert, AsyncStorage, Button, KeyboardAvoidingView, ScrollView, View } from 'react-native';

import config from '../config.json';
import { PlainTextInput } from './TextInputs';
import Strings from './assets/Strings';
import { tokenFromPassword, generateSignature } from './lib/TokenService';

class SignInScreen extends Component {
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
          <PlainTextInput
            keyboardType={'email-address'}
            label={Strings.email}
            onChangeText={(text) => this.setState({ email: text })}
            placeholder={Strings.email}
          />
          <PlainTextInput
            label={Strings.password}
            onChangeText={(text) => this.setState({ password: text })}
            placeholder={Strings.password}
            secureTextEntry={true}
          />
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
