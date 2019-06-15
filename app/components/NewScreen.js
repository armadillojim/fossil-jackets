import React, { Component } from 'react';
import { Alert, AsyncStorage, Button, KeyboardAvoidingView, ScrollView, View } from 'react-native';

import config from '../config.json';
import { AutoCompleteTextInput, FixedTextInput, GeolocationTextInput, PlainTextInput, TagTextInput } from './TextInputs';
import PhotoInput from './PhotoInput';
import formations from './assets/formations';
import localities from './assets/localities';
import Strings from './assets/Strings';
import { generateSignature } from './lib/TokenService';

class NewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: 2,
      juid: null,
      expedition: config.expedition,
      jacketNumber: '',
      created: Date.now(),
      locality: '',
      lat: null,
      lng: null,
      elevation: null,
      formation: '',
      specimenType: '',
      personnel: '',
      notes: '',
      tid: '',
      primaryPhoto: null,
      secondaryPhotos: [],
      token: null, // removed later before saving
    };
    this.saveJacket = this.saveJacket.bind(this);
    this.fetchCredentials();
  }

  // Fetch credentials from storage and keep them locally
  fetchCredentials = async () => {
    const credentialsString = await AsyncStorage.getItem('user:credentials');
    const { uid, token } = JSON.parse(credentialsString);
    this.setState({ juid: uid, token: token });
  };

  saveJacket = async () => {
    // copy state to a new object we can mutate
    const jacket = {...this.state};
    // check for required jacketNumber
    // NB: all other fields are either not required or generated automatically (expedition and time) or hidden
    if (!jacket.jacketNumber) {
      Alert.alert(Strings.missingJacketNumberTitle, Strings.missingJacketNumberMessage);
      return;
    }
    // segregate photos
    const primaryPhoto = jacket.primaryPhoto;
    delete jacket.primaryPhoto;
    const secondaryPhotos = jacket.secondaryPhotos;
    delete jacket.secondaryPhotos;
    // normalize tag to uppercased hex digits without punctuation
    jacket.tid = TagTextInput.normalizeTag(jacket.tid);
    // remove missing values
    if (!jacket.locality)     { delete jacket.locality; }
    if (jacket.lat === null)  { delete jacket.lat; delete jacket.lng; delete jacket.elevation; }
    if (!jacket.formation)    { delete jacket.formation; }
    if (!jacket.specimenType) { delete jacket.specimenType; }
    if (!jacket.personnel)    { delete jacket.personnel; }
    if (!jacket.notes)        { delete jacket.notes; }
    if (!jacket.tid)          { delete jacket.tid; }
    // store and remove token
    const token = jacket.token;
    delete jacket.token;
    // generate a signature, and paint the jacket data with it
    const hmac = generateSignature(jacket, token);
    jacket.jhmac = hmac;
    // add the photos back for later retrieval
    if (primaryPhoto) { jacket.photos = [primaryPhoto].concat(secondaryPhotos); }
    // store the data, and navigate back to the home screen
    const jid = `jacket:${jacket.created}`;
    await AsyncStorage.setItem(jid, JSON.stringify(jacket));
    Alert.alert(
      Strings.success,
      '✅',
      [{ text: Strings.OK, onPress: () => { this.props.navigation.navigate('Home'); } }],
      { cancelable: false },
    );
  }

  render() {
    return (
      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <FixedTextInput
            label={Strings.expedition}
            value={this.state.expedition}
          />
          <PlainTextInput
            label={Strings.jacketNumber}
            maxLength={256}
            onChangeText={(text) => this.setState({ jacketNumber: text })}
            placeholder={Strings.jacketNumber}
          />
          <FixedTextInput
            label={Strings.dateTime}
            value={new Date(this.state.created).toLocaleString()}
          />
          <AutoCompleteTextInput
            iOSzIndex={2}
            label={Strings.locality}
            maxLength={256}
            onChangeText={(text) => this.setState({ locality: text })}
            placeholder={Strings.locality}
            suggestions={localities}
          />
          <GeolocationTextInput
            onLocation={(location) => this.setState(location)}
          />
          <AutoCompleteTextInput
            iOSzIndex={1}
            label={Strings.formation}
            maxLength={256}
            onChangeText={(text) => this.setState({ formation: text })}
            placeholder={Strings.formation}
            suggestions={formations}
          />
          <PlainTextInput
            label={Strings.specimenType}
            maxLength={256}
            onChangeText={(text) => this.setState({ specimenType: text })}
            placeholder={Strings.specimenType}
          />
          <PlainTextInput
            label={Strings.personnel}
            maxLength={256}
            onChangeText={(text) => this.setState({ personnel: text })}
            placeholder={Strings.personnel}
          />
          <PlainTextInput
            label={Strings.notes}
            maxLength={1024}
            multiline={true}
            onChangeText={(text) => this.setState({ notes: text })}
            placeholder={Strings.notes}
          />
          <TagTextInput
            onChangeText={(text) => this.setState({ tid: text })}
          />
          <PhotoInput
            label={Strings.primaryPhoto}
            maximum={1}
            onChange={(imageState) => this.setState({ primaryPhoto: imageState })}
            preventEmpty={this.state.secondaryPhotos.length}
          />
          { this.state.primaryPhoto &&
          <PhotoInput
            label={Strings.secondaryPhotos}
            maximum={9}
            onChange={(imageState) => this.setState({ secondaryPhotos: imageState })}
            preventEmpty={false}
          />}
        </ScrollView>
        <View style={{ margin: 5, width: '97%' }}>
          <Button title={Strings.saveJacket} onPress={this.saveJacket} color='forestgreen' />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default NewScreen;
