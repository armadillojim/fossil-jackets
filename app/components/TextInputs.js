import React, { Component } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';

import Strings from './assets/Strings';

// When using an AutoCompleteTextInput inside a ScrollView,
// set the ScrollView's keyboardShouldPersistTaps='always'.
class AutoCompleteTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
    this.renderItem = this.renderItem.bind(this);
  }

  filterSuggestions(text) {
    if (text === '') { return []; }
    const { suggestions } = this.props;
    const textToLower = text.toLowerCase();
    const filteredSuggestions = suggestions.filter(
      (suggestion) => suggestion.startsWith(textToLower)
    );
    const oneExactMatch = filteredSuggestions.length === 1 && textToLower === filteredSuggestions[0];
    return oneExactMatch ? [] : filteredSuggestions;
  }

  renderItem(suggestion) {
    const onPress = () => {
      this.setState({ text: suggestion });
      this.props.onChangeText(suggestion);
    };
    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.suggestion}>{suggestion}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      label,
      keyboardType,
      maxLength,
      onChangeText,
      placeholder,
    } = this.props;
    const { text } = this.state;
    const filteredSuggestions = this.filterSuggestions(text);
    // The styles here are functional, but are less than ideal.
    return (
      <View style={styles.autoContainer}>
        <Text style={styles.label}>{label}</Text>
        <Autocomplete
          data={filteredSuggestions}
          renderItem={this.renderItem}
          inputContainerStyle={styles.inputContainer}
          listStyle={{zIndex: 1, position: 'absolute'}}
          style={styles.inputText}
          autoCapitalize={'none'}
          autoCorrect={false}
          defaultValue={text}
          keyboardType={keyboardType || 'default'}
          maxLength={maxLength || 64}
          onChangeText={(text) => { this.setState({ text: text }); onChangeText(text); }}
          placeholder={placeholder || ''}
          underlineColorAndroid={'transparent'}
        />
      </View>
    );
  }
}

class FixedTextInput extends Component {
  render() {
    const {
      label,
      multiline,
      value,
    } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          defaultValue={value}
          editable={false}
          multiline={multiline || false}
          style={styles.input}
          underlineColorAndroid={'transparent'}
        />
      </View>
    );
  }
}

class GeolocationTextInput extends Component {
  constructor(props) {
    super(props);
    this.compass = require('./assets/compass.png');
    this.satellite = require('./assets/satellite.png');
    this.state = { lat: null, lng: null, gpsIcon: this.compass };
    this.getLocation = this.getLocation.bind(this);
  }

  getLocation() {
    this.setState({ gpsIcon: this.satellite });
    const fiveMinutes = 5 * 60 * 1000;
    const fifteenSeconds = 15 * 1000;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.setState({ lat: lat, lng: lng, gpsIcon: this.compass });
        this.props.onLocation({ lat: lat, lng: lng });
      },
      (error) => {
        this.setState({ lat: null, lng: null, gpsIcon: this.compass });
        Alert.alert(Strings.geolocationError, `${Strings.geolocationMessage}: ${error.message}`);
        this.props.onLocation({ lat: null, lng: null });
      },
      { enableHighAccuracy: true, maximumAge: fiveMinutes, timeout: fifteenSeconds },
    );
  }

  renderLatLng(latLng) {
    const { lat, lng } = this.state;
    if (!lat || !lng) { return ''; }
    const northSouth = lat > 0.0 ? 'N' : 'S';
    const eastWest = lng > 0.0 ? 'E' : 'W';
    return `${Math.abs(lat)} ${northSouth} ${Math.abs(lng)} ${eastWest}`;
  }

  render() {
    const { label, onLocation } = this.props;
    const value = this.renderLatLng(this.state);
    const compassHitSlop = { top: 8, left: 8, bottom: 8, right: 8 };
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          defaultValue={value}
          editable={false}
          style={styles.input}
          underlineColorAndroid={'transparent'}
        />
        <TouchableOpacity hitSlop={compassHitSlop} onPress={this.getLocation} style={styles.compassTouchable}>
          <Image source={this.state.gpsIcon} style={styles.compass} />
        </TouchableOpacity>
      </View>
    );
  }
}

class PlainTextInput extends Component {
  render() {
    const {
      label,
      keyboardType,
      maxLength,
      multiline,
      onChangeText,
      placeholder,
    } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          autoCapitalize={'none'}
          autoCorrect={false}
          keyboardType={keyboardType || 'default'}
          maxLength={maxLength || 64}
          multiline={multiline || false}
          onChangeText={onChangeText}
          placeholder={placeholder || ''}
          style={styles.input}
          underlineColorAndroid={'transparent'}
        />
      </View>
    );
  }
}

export { AutoCompleteTextInput, FixedTextInput, GeolocationTextInput, PlainTextInput };

const styles = StyleSheet.create({
  autoContainer: {
    height:40,
    margin:5,
    width:'97%',
  },
  container: {
    margin: 5,
    width: '97%',
  },
  label: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  inputContainer: {
    borderColor: 'grey',
    borderRadius: 3,
    borderWidth: 1,
  },
  inputText: {
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    borderColor: 'grey',
    borderRadius: 3,
    borderWidth: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  suggestion: {
    fontSize: 16,
  },
  compassTouchable: {
    position: 'absolute',
    right: 4,
    top: 14,
  },
  compass: {
    height: 24,
    width: 24,
  },
});
