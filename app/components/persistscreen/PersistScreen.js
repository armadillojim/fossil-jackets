import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class PersistScreen extends Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text>This is a stub for the persist screen.</Text>
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

export default PersistScreen;
