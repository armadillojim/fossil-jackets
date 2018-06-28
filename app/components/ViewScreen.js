import React, { Component } from 'react';
import { Alert, AsyncStorage, ScrollView, Text, View } from 'react-native';

import { FixedTextInput, GeolocationTextInput, PlainTextInput } from './TextInputs';
import config from '../config.json';
import Strings from './assets/Strings';
import { generateSignature } from './lib/TokenService';

class ViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { jacket: null };
    this.credentials = null;
    this.fetchJacket = this.fetchJacket.bind(this);
    this.fetchCredentials();
  }

  fetchCredentials = async () => {
    const credentialsString = await AsyncStorage.getItem('user:credentials');
    this.credentials = JSON.parse(credentialsString);
  };

  fetchJacket = async (tagPayload) => {
    // do nothing for an empty payload
    if (!tagPayload) { return; }
    // check that the tag payload is base64 of length 92
    const b64RegExp = new RegExp('^(?:[A-Za-z0-9+/]{4})*$');
    if (typeof(tagPayload) !== 'string' || tagPayload.length !== 92 || !b64RegExp.test(tagPayload)) {
      Alert.alert(Strings.badPayload, Strings.badPayloadMessage);
      return;
    }
    // fetch the jacket and set state
    try {
      const jacket = await this.fetchItem(`/jacket/${encodeURIComponent(tagPayload)}`);
      this.setState({ jacket: jacket });
    }
    catch (err) {
      Alert.alert(Strings.fetchError, `${Strings.fetchErrorMessage}: ${JSON.stringify(err)}`);
    }
  };

  fetchItem = (path) => {
    const { uid, token } = this.credentials;
    const now = Date.now();
    const hmac = generateSignature({ uid: uid, time: now, path: path }, token);
    const urlBase = `https://${config.domain}/api${path}`;
    const urlQuery = `uid=${uid}&time=${now}&hmac=${encodeURIComponent(hmac)}`
    return new Promise((resolve, reject) => {
      fetch(`${urlBase}?${urlQuery}`).then((res) => {
        if (!res.ok) { throw { code: res.status, message: res.statusText }; }
        return res.json();
      }).then((item) => {
        resolve(item);
      }).catch((err) => {
        reject(err);
      });
    });
  };

  render() {
    const { jacket } = this.state;
    const warnings = jacket ? jacket.warnings.map((warning, i) =>
      <View style={{ backgroundColor: 'yellow', margin: 5, width: '97%' }} key={`${i}`}>
        <Text>{warning}</Text>
      </View>
    ) : null;
    return jacket ? (
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={{ backgroundColor: 'white', height: 35 }} key={'padding'}></View>
        { warnings }
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
      </ScrollView>
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
        <PlainTextInput
          label={Strings.tagPayload}
          maxLength={92}
          onChangeText={this.fetchJacket}
          placeholder={Strings.tagPayload}
        />
      </View>
    );
  }
}

export default ViewScreen;
