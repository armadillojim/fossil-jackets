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
      nPhotos: null,
      nUploaded: 0,
      isJacket: true,
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
    const photoKeys = keys.filter((key) => key.startsWith('photo:'));
    photoKeys.sort(); // ensure primary photos come first
    this.setState({ nJackets: jacketKeys.length, nPhotos: photoKeys.length });
    const success = await this.uploadJackets(jacketKeys) && await this.uploadPhotos(photoKeys);
    if (success) { Alert.alert(
      Strings.success,
      '✅',
      [{ text: Strings.OK, onPress: () => { this.props.navigation.navigate('Home'); } }],
      { cancelable: false },
    ); }
  }

  uploadJackets = async (keys) => {
    this.jids = {};
    let failure = 0;
    for (const key of keys) {
      const jacketString = await AsyncStorage.getItem(key);
      const jid = await this.uploadItem(JSON.parse(jacketString), '/jacket');
      if (jid === null) {
        failure += 1;
      }
      else {
        this.setState((prevState) => ({ nUploaded: prevState.nUploaded + 1 }));
        this.jids[key] = jid;
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

  uploadPhotos = async (keys) => {
    // if there are no photos, we're done
    if (!keys.length) {
      return true;
    }
    // reset component state
    this.setState({ nUploaded: 0, isJacket: false });
    // start our uploads
    let failure = 0;
    const { uid, token } = this.credentials;
    for (const key of keys) {
      const photoString = await AsyncStorage.getItem(key);
      const photo = JSON.parse(photoString);
      // modify the photo's associated jacket ID to the database's value
      const jid = this.jids[photo.jid];
      photo.jid = jid;
      // fetch the image contents and encode them
      photo.image = await getDataUriFromFileUri(photo.image);
      // generate a signature, and paint the photo data with it
      const hmac = generateSignature(photo, token);
      photo.phmac = hmac;
      // and upload it
      const pid = await this.uploadItem(photo, `/jacket/${jid}/photo`);
      if (pid === null) {
        failure += 1;
      }
      else {
        this.setState((prevState) => ({ nUploaded: prevState.nUploaded + 1 }));
        await AsyncStorage.removeItem(key);
      }
    }
    if (failure) {
      Alert.alert(
        Strings.uploadError,
        failure === keys.length ? Strings.networkError : Strings.unknownError,
        [{ text: Strings.OK, onPress: () => { this.props.navigation.navigate('Home'); } }],
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
    const { nJackets, nPhotos, nUploaded, isJacket } = this.state;
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
      const nToUpload = isJacket ? nJackets : nPhotos;
      return (
        <ProgressBar
          label={Strings.uploadProgress(nUploaded, nToUpload, isJacket)}
          progress={nUploaded / nToUpload}
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
