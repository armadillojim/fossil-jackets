import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class SignOutScreen extends Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text>This stub is for the sign out screen.  It will eventually live in a separate stack (from a switch).</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default SignOutScreen;
