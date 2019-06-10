import React, { Component } from 'react';
import { ActivityIndicator, Alert, AsyncStorage, Button, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';

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
    }).then(async (res) => {
      await AsyncStorage.setItem('user:credentials', JSON.stringify({ uid: res.uid, token: token }));
      this.props.navigation.navigate('App');
    }).catch((err) => {
      Alert.alert(Strings.tokenVerifyErrorTitle, Strings.tokenVerifyErrorMessage);
      this.setState({ waiting: false });
    });
  };

  render() {
    return this.state.waiting ? (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='forestgreen' />
        <Text>{Strings.signingIn}</Text>
      </View>
    ) : (
      <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardView}>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={{ height: 70 }}></View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default SignInScreen;
