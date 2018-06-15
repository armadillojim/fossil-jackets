import React, { Component } from 'react';
import { ActivityIndicator, Alert, AsyncStorage, ProgressBarAndroid, StyleSheet, Text, View } from 'react-native';

import Strings from './assets/Strings';

class UploadScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jacketKeys: null,
      nUploaded: 0,
    };
    this.fetchJacketKeys();
  }

  fetchJacketKeys = async () => {
    const jacketKeys = await AsyncStorage.getAllKeys();
    this.setState({ jacketKeys: jacketKeys.filter((key) => key.startsWith('jacket:')) });
  }

  render() {
    const { navigate } = this.props.navigation;
    const { jacketKeys, nUploaded } = this.state;
    if (jacketKeys === null) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' color='forestgreen' />
          <Text>{Strings.fetchingJackets}</Text>
        </View>
      );
    }
    else if (jacketKeys.length === 0) {
      Alert.alert(
        Strings.noJacketsTitle,
        Strings.noJackets,
        [{ text: Strings.OK, onPress: () => navigate('Home') }],
        { cancelable: false },
      );
      return (
        <View style={styles.container}>
          <Text>{Strings.noJackets}</Text>
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <Text>{Strings.uploadProgress(nUploaded, jacketKeys.length)}</Text>
          <ProgressBarAndroid
            color='forestgreen'
            indeterminate={false}
            progress={nUploaded / jacketKeys.length}
            style={{ width: '80%' }}
            styleAttr='Horizontal'
          />
        </View>
      );
    }
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

export default UploadScreen;
