import React, { Component } from 'react';
import { Alert, AsyncStorage, Image, ScrollView, Text, View } from 'react-native';

import { FixedTextInput, GeolocationTextInput, TagTextInput } from './TextInputs';
import config from '../config.json';
import Strings from './assets/Strings';
import { generateSignature } from './lib/TokenService';

class ViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { jacket: null, pids: [] };
    this.credentials = null;
    this.fetchJacket = this.fetchJacket.bind(this);
    this.fetchCredentials();
  }

  fetchCredentials = async () => {
    const credentialsString = await AsyncStorage.getItem('user:credentials');
    this.credentials = JSON.parse(credentialsString);
  };

  fetchJacket = async (tid) => {
    // normalize tag to uppercased hex digits without punctuation
    tid = TagTextInput.normalizeTag(tid);
    // silently do nothing for a malformatted ID
    if (tid.length !== 14) { return; }
    // fetch the jacket and set state
    try {
      const jacket = await this.fetchItem(`/jacket/${tid}`);
      this.setState({ jacket: jacket });
      const pids = await this.fetchItem(`/jacket/${jacket.jid}/photo`);
      this.setState({ pids: pids });
    }
    catch (err) {
      Alert.alert(Strings.fetchError, `${Strings.fetchErrorMessage}: ${JSON.stringify(err)}`);
    }
  };

  itemUrl = (path) => {
    const { uid, token } = this.credentials;
    const now = Date.now();
    const hmac = generateSignature({ uid: uid, time: now, path: path }, token);
    const urlBase = `https://${config.domain}/api${path}`;
    const urlQuery = `uid=${uid}&time=${now}&hmac=${encodeURIComponent(hmac)}`;
    return `${urlBase}?${urlQuery}`;
  };

  fetchItem = (path) => {
    return new Promise((resolve, reject) => {
      fetch(this.itemUrl(path)).then((res) => {
        if (!res.ok) { throw { code: res.status, message: res.statusText }; }
        return res.json();
      }).then((item) => {
        resolve(item);
      }).catch((err) => {
        reject(err);
      });
    });
  };

  photoComponent = (jid, pid) => {
    const path = `/jacket/${jid}/photo/${pid}`;
    const url = this.itemUrl(path);
    return (
      <View style={{ backgroundColor: 'white', margin: 5, width: '97%', height: 200 }} key={`photo:${pid}`}>
        <Image
          resizeMode={'contain'}
          source={{uri: url}}
          style={{ flex: 1, justifyContent: 'center', width: '100%', height: '100%' }}
        />
      </View>
    );
  };

  render() {
    const { jacket, pids } = this.state;
    const photos = pids.map((pid) => this.photoComponent(jacket.jid, pid));
    return jacket ? (
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={{ backgroundColor: 'white', height: 35 }} key={'padding'}></View>
        <FixedTextInput
          label={Strings.expedition}
          value={jacket.expedition}
        />
        <FixedTextInput
          label={Strings.jacketNumber}
          value={jacket.jacketNumber}
        />
        <FixedTextInput
          label={Strings.dateTime}
          value={new Date(jacket.created).toLocaleString()}
        />
        <FixedTextInput
          label={Strings.locality}
          value={jacket.locality}
        />
        <GeolocationTextInput
          editable={false}
          label={Strings.latLng}
          latLng={{ lat: jacket.lat, lng: jacket.lng }}
        />
        <FixedTextInput
          label={Strings.formation}
          value={jacket.formation}
        />
        <FixedTextInput
          label={Strings.specimenType}
          value={jacket.specimenType}
        />
        <FixedTextInput
          label={Strings.personnel}
          value={jacket.personnel}
        />
        <FixedTextInput
          label={Strings.notes}
          multiline={true}
          value={jacket.notes}
        />
        <FixedTextInput
          label={Strings.tid}
          value={jacket.tid}
        />
        { photos }
      </ScrollView>
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
        <TagTextInput
          onChangeText={this.fetchJacket}
        />
      </View>
    );
  }
}

export default ViewScreen;
