import React, { Component } from 'react';
import { Platform, ProgressBarAndroid, ProgressViewIOS, StyleSheet, Text, View } from 'react-native';

class ProgressBar extends Component {
  render() {
    const { label, progress } = this.props;
    return (Platform.OS === 'ios') ? (
      <View style={styles.container}>
        <Text>{label}</Text>
        <ProgressViewIOS
          progress={progress}
          progressTintColor='forestgreen'
          style={styles.progressBar}
        />
      </View>
    ) : (
      <View style={styles.container}>
        <Text>{label}</Text>
        <ProgressBarAndroid
          color='forestgreen'
          indeterminate={false}
          progress={progress}
          style={styles.progressBar}
          styleAttr='Horizontal'
        />
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
  progressBar: {
    width: '80%',
  },
});

export default ProgressBar;
