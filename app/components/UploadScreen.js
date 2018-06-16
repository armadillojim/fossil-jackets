import React, { Component } from 'react';
import { ActivityIndicator, Alert, AsyncStorage, ProgressBarAndroid, StyleSheet, Text, View } from 'react-native';

import config from '../config.json';
import Strings from './assets/Strings';
import { generateSignature } from './lib/TokenService';

class UploadScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nJackets: null,
      nUploaded: 0,
    };
    this.fetchCredentials();
    this.fetchJacketKeys();
  }

  fetchCredentials = async () => {
    const credentialsString = await AsyncStorage.getItem('user:credentials');
    this.credentials = JSON.parse(credentialsString);
  };

  fetchJacketKeys = async () => {
    let jacketKeys = await AsyncStorage.getAllKeys();
    jacketKeys = jacketKeys.filter((key) => key.startsWith('jacket:'));
    this.setState({ nJackets: jacketKeys.length });
    this.uploadJackets(jacketKeys);
  }

  uploadJackets = async (keys) => {
    const jids = {};
    let failure = 0;
    for (const key of keys) {
      const jacketString = await AsyncStorage.getItem(key);
      const jid = await this.uploadJacket(JSON.parse(jacketString));
      if (jid === null) {
        failure += 1;
      }
      else {
        this.setState((prevState) => ({ nUploaded: prevState.nUploaded + 1 }));
        jids[key] = jid;
        await AsyncStorage.removeItem(key);
      }
    }
    const { navigate } = this.props.navigation;
    if (failure) {
      Alert.alert(
        Strings.uploadError,
        failure === keys.length ? Strings.networkError : Strings.unknownError,
        [{ text: Strings.OK, onPress: () => navigate('Home') }],
        { cancelable: false },
      );
    }
    else {
      navigate('Home');
    }
  }

  uploadJacket = (jacket) => {
    const { uid, token } = this.credentials;
    const now = Date.now();
    const path = '/jacket';
    const hmac = generateSignature({ uid: uid, time: now, path: path, ...jacket }, token);
    const urlBase = `https://${config.domain}/api${path}`;
    const urlQuery = `uid=${uid}&time=${now}&hmac=${encodeURIComponent(hmac)}`
    return new Promise((resolve, reject) => {
      fetch(`${urlBase}?${urlQuery}`, {
        body: JSON.stringify(jacket),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      }).then((res) => {
        if (!res.ok) { throw { code: res.status, message: res.statusText }; }
        return res;
      }).then((res) => {
        return res.json();
      }).then((jid) => {
        resolve(jid);
      }).catch((err) => {
        // Return a "null" to indicate failure (missing JID).
        resolve(null);
      });
    });
  }

  render() {
    const { navigate } = this.props.navigation;
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
          <Text>{Strings.uploadProgress(nUploaded, nJackets)}</Text>
          <ProgressBarAndroid
            color='forestgreen'
            indeterminate={false}
            progress={nUploaded / nJackets}
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
