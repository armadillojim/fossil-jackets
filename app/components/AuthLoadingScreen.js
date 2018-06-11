import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, StyleSheet, Text, View } from 'react-native';

import Strings from './assets/Strings';

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this._checkCredentials(this.props.navigation.navigate);
  }

  // Fetch credentials from storage then navigate to home or sign in screen
  _checkCredentials = async (navigate) => {
    const uid = await AsyncStorage.getItem('user:uid');
    const token = await AsyncStorage.getItem('user:token');
    navigate(uid && token ? 'App' : 'Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='forestgreen' />
        <Text>{Strings.signingIn}</Text>
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

export default AuthLoadingScreen;
