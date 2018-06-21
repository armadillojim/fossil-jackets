import React, { Component } from 'react';
import { Button, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import Strings from './assets/Strings';

class NavButton extends Component {
  render() {
    const { title, screen, navigate } = this.props;
    return (
      <View style={styles.button}>
        <Button title={title} onPress={() => navigate(screen)} color='forestgreen' />
      </View>
    );
  }
}

class HomeScreen extends Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <TouchableWithoutFeedback delayLongPress={3000} onLongPress={() => { navigate('Failsafe'); }}>
            <Image source={require('./assets/logo.png')} style={{ height: 96, width: 96 }} />
          </TouchableWithoutFeedback>
          <Text style={{ fontSize: 32 }}>{Strings.appName}</Text>
        </View>
        <View style={styles.nav}>
          <NavButton title={Strings.newJacket} screen='New' navigate={navigate} />
          <NavButton title={Strings.uploadJackets} screen='Upload' navigate={navigate} />
          <NavButton title={Strings.viewJacket} screen='View' navigate={navigate} />
        </View>
        <View style={styles.signOut}>
          <NavButton title={Strings.signOut} screen='SignOut' navigate={navigate} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOut: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '80%',
    margin: 8
  },
});

export default HomeScreen;
