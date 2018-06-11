import React, { Component } from 'react';
import { AsyncStorage, Button, StyleSheet, Text, View } from 'react-native';

import Strings from './assets/Strings';

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: Strings.pleaseSignIn,
  };

  _signIn = async () => {
    const credentials = {
      uid: 17,
      token: 'abc',
    };
    await AsyncStorage.setItem('user:credentials', JSON.stringify(credentials));
    this.props.navigation.navigate('App');
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title={Strings.register} onPress={this._signIn} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SignInScreen;
