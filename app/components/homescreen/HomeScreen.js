import React, { Component } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

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
          <Image source={require('./logo.png')} style={{ height: 96, width: 96 }} />
          <Text style={{ fontSize: 32 }}>Fossil Jackets</Text>
        </View>
        <View style={styles.nav}>
          <NavButton title='New Jacket' screen='New' navigate={navigate} />
          <NavButton title='Persist Jackets' screen='Persist' navigate={navigate} />
          <NavButton title='View Jacket' screen='View' navigate={navigate} />
        </View>
        <View style={styles.signOut}>
          <NavButton title='Sign Out' screen='SignOut' navigate={navigate} />
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
