import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class ViewScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>This is a stub for the view screen.</Text>
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

export default ViewScreen;
