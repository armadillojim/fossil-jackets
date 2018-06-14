import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import config from '../config.json';
import { AutoCompleteTextInput, FixedTextInput, GeolocationTextInput, PlainTextInput } from './TextInputs';
import formations from './assets/formations';
import localities from './assets/localities';
import Strings from './assets/Strings';
import { generateSignature } from './lib/TokenService';

class NewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expedition: config.expedition,
      jacketNumber: '',
      created: Date.now(),
      locality: '',
      lat: null,
      lng: null,
      formation: '',
      specimenType: '',
      personnel: '',
      notes: '',
      tid: '',
    };
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={[styles.container, { flex: 9 }]}>
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
            label={Strings.locality}
            maxLength={256}
            onChangeText={(text) => this.setState({ locality: text })}
            placeholder={Strings.locality}
            suggestions={localities}
          />
          <GeolocationTextInput
            label={Strings.latLng}
            onLocation={(latLng) => this.setState(latLng)}
          />
          <AutoCompleteTextInput
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
          <PlainTextInput
            label={Strings.tid}
            placeholder={Strings.tid}
            onChangeText={(text) => this.setState({ tid: text })}
          />
        </View>
        <View style={styles.container}>
          <Button title={Strings.saveJacket} onPress={() => console.log(this.state)} color='forestgreen' />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default NewScreen;
