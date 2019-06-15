import React, { Component } from 'react';
import { ActivityIndicator, Alert, AsyncStorage, StyleSheet, Text, View } from 'react-native';

import config from '../config.json';
import ProgressBar from './ProgressBar';
import Strings from './assets/Strings';
import { getDataUriFromFileUri } from './lib/FileService';
import { generateSignature } from './lib/TokenService';

class UploadScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nJackets: null,
      nUploaded: 0,
    };
    this.fetchCredentials();
  }

  fetchCredentials = async () => {
    const credentialsString = await AsyncStorage.getItem('user:credentials');
    this.credentials = JSON.parse(credentialsString);
    this.fetchKeys();
  };

  fetchKeys = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const jacketKeys = keys.filter((key) => key.startsWith('jacket:'));
    this.setState({ nJackets: jacketKeys.length });
    const success = await this.uploadJackets(jacketKeys);
    if (success) { Alert.alert(
      Strings.success,
      '✅',
      [{ text: Strings.OK, onPress: () => { this.props.navigation.navigate('Home'); } }],
      { cancelable: false },
    ); }
  }

  uploadJackets = async (keys) => {
    let failure = 0;
    for (const key of keys) {
      const jacketString = await AsyncStorage.getItem(key);
      const jacket = JSON.parse(jacketString);
      if (jacket.photos) { jacket.photos = await Promise.all(jacket.photos.map((photo) => getDataUriFromFileUri(photo.uri))); }
      const jid = await this.uploadItem(jacket, '/jacket');
      if (jid === null) {
        failure += 1;
      }
      else {
        this.setState((prevState) => ({ nUploaded: prevState.nUploaded + 1 }));
        await AsyncStorage.removeItem(key);
      }
    }
    const { navigate } = this.props.navigation;
    if (!keys.length) {
      Alert.alert(
        Strings.noJacketsTitle,
        Strings.noJackets,
        [{ text: Strings.OK, onPress: () => { navigate('Home'); } }],
        { cancelable: false },
      );
      return false;
    }
    else if (failure) {
      Alert.alert(
        Strings.uploadError,
        failure === keys.length ? Strings.networkError : Strings.unknownError,
        [{ text: Strings.OK, onPress: () => { navigate('Home'); } }],
        { cancelable: false },
      );
      return false;
    }
    else {
      return true;
    }
  }

  uploadItem = (item, path) => {
    const { uid, token } = this.credentials;
    const now = Date.now();
    const hmac = generateSignature({ uid: uid, time: now, path: path, ...item }, token);
    const urlBase = `https://${config.domain}/api${path}`;
    const urlQuery = `uid=${uid}&time=${now}&hmac=${encodeURIComponent(hmac)}`
    return new Promise((resolve, reject) => {
      fetch(`${urlBase}?${urlQuery}`, {
        body: JSON.stringify(item),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      }).then((res) => {
        if (!res.ok) { throw { code: res.status, message: res.statusText }; }
        return res.json();
      }).then((id) => {
        resolve(id);
      }).catch((err) => {
        // Return a "null" to indicate failure (missing ID).
        resolve(null);
      });
    });
  }

  render() {
    const { nJackets, nUploaded } = this.state;
    if (nJackets === null) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' color='forestgreen' />
          <Text>{Strings.fetchingJackets}</Text>
        </View>
      );
    }
    else if (nJackets === 0) {
      return (
        <View style={styles.container}>
          <Text>{Strings.noJackets}</Text>
        </View>
      );
    }
    else {
      return (
        <ProgressBar
          label={Strings.uploadProgress(nUploaded, nJackets)}
          progress={nUploaded / nJackets}
        />
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
