// This screen is not normally accessed by users.  It is provided only as a
// failsafe, a fallback in case an upload fails and data on the device needs
// to be recovered.

// Currently, this code is a clever hack to get data out through the CameraRoll.
// Should we eject in the future, react-native-fs would much more easily allow
// us to write a single file directly to the "Downloads" directory.  On the
// hand, if we do not eject, and this method proves unportable, it would be
// possible to write the records to tEXt chunks of a PNG.  Then the PNG could be
// written to the CameraRoll (and exfiltrated via MMS, Bluetooth, or others).

import React, { Component } from 'react';
import { ActivityIndicator, Alert, AsyncStorage, CameraRoll, ProgressBarAndroid, StyleSheet, Text, View } from 'react-native';
import { FileSystem } from 'expo';

import Strings from './assets/Strings';
import { getDataUriFromFileUri } from './lib/FileService';

class FailsafeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nItems: null,
      nWritten: 0,
    };
    this.fetchKeys();
  }

  fetchKeys = async () => {
    const keys = await AsyncStorage.getAllKeys();
    this.setState({ nItems: keys.length });
    const success = await this.writeItems(keys);
    const { navigate } = this.props.navigation;
    Alert.alert(
      success ? Strings.writeSucceeded : Strings.writeFailed,
      success ? Strings.writeSucceededMessage : Strings.writeFailedMessage,
      [{ text: Strings.OK, onPress: () => { navigate('AuthLoading'); } }],
      { cancelable: false },
    );
  }

  writeItems = async (keys) => {
    let failure = 0;
    for (const key of keys) {
      let itemString = await AsyncStorage.getItem(key);
      if (key.startsWith('photo:')) {
        const photoString = await this.getPhoto(itemString);
        if (photoString) { itemString = photoString; }
        // on failure, do nothing: the image is gone or unreadable so
        // write the file URI and hope that indicates what the photo was
      }
      const success = await this.writeItem(key, itemString);
      if (success) {
        this.setState((prevState) => ({ nWritten: prevState.nWritten + 1 }));
        await AsyncStorage.removeItem(key);
      }
      else {
        failure += 1;
      }
    }
    return failure === 0;
  }

  getPhoto = async (photoString) => {
    try {
      const photo = JSON.parse(photoString);
      photo.image = await getDataUriFromFileUri(photo.image);
      return JSON.stringify(photo);
    }
    catch (err) {
      return false;
    }
  }

  writeItem = async (key, string) => {
    try {
      // the file name cannot contain colons so we replace with underscores
      const fileUri = `${FileSystem.documentDirectory}${key.replace(/:/g, '_')}.json`;
      await FileSystem.writeAsStringAsync(fileUri, string);
      await CameraRoll.saveToCameraRoll(fileUri, 'photo');
      await FileSystem.deleteAsync(fileUri);
      return true;
    }
    catch (err) {
      return false;
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { nItems, nWritten } = this.state;
    if (nItems === null) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' color='forestgreen' />
          <Text>{Strings.fetchingKeys}</Text>
        </View>
      );
    }
    // nItems > 0 always because we cannot navigate here without being logged in
    else {
      return (
        <View style={styles.container}>
          <Text>{Strings.writeProgress(nWritten, nItems)}</Text>
          <ProgressBarAndroid
            color='forestgreen'
            indeterminate={false}
            progress={nWritten / nItems}
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
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FailsafeScreen;
