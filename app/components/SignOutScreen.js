import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, StyleSheet, Text, View } from 'react-native';

import Strings from './assets/Strings';

class SignOutScreen extends Component {
  constructor(props) {
    super(props);
    this._eraseCredentials(this.props.navigation.navigate);
  }

  // Wipe out credentials from storage then navigate to sign in screen
  _eraseCredentials = async (navigate) => {
    await AsyncStorage.removeItem('user:credentials');
    navigate('Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='forestgreen' />
        <Text>{Strings.signingOut}</Text>
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

export default SignOutScreen;
