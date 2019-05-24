import React, { Component } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';

import Strings from './assets/Strings';

// When using an AutoCompleteTextInput inside a ScrollView,
// set the ScrollView's keyboardShouldPersistTaps='always'.
class AutoCompleteTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '', hideSuggestions: true };
    this.renderItem = this.renderItem.bind(this);
  }

  filterSuggestions(text) {
    if (text === '') { return []; }
    const { suggestions } = this.props;
    const textToLower = text.toLowerCase();
    const filteredSuggestions = suggestions.filter(
      (suggestion) => suggestion.toLowerCase().startsWith(textToLower)
    );
    const oneExactMatch = filteredSuggestions.length === 1 && text === filteredSuggestions[0];
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
      iOSzIndex,
      label,
      keyboardType,
      maxLength,
      onChangeText,
      placeholder,
    } = this.props;
    const { text, hideSuggestions } = this.state;
    const filteredSuggestions = this.filterSuggestions(text);
    // The styles here are functional, but are less than ideal.
    return (
      <View style={[styles.autoContainer, (Platform.OS === 'ios') ? {zIndex: iOSzIndex || 1} : {}]}>
        <Text style={styles.label}>{label}</Text>
        <Autocomplete
          data={filteredSuggestions}
          hideResults={hideSuggestions}
          inputContainerStyle={styles.inputContainer}
          listStyle={ (Platform.OS === 'ios') ? {} : {zIndex: 1, position: 'absolute'} }
          renderItem={this.renderItem}
          style={styles.inputText}
          autoCapitalize={'none'}
          autoCorrect={false}
          defaultValue={text}
          keyboardType={keyboardType || 'default'}
          maxLength={maxLength || 64}
          onBlur={() => this.setState({ hideSuggestions: true })}
          onChangeText={(text) => { this.setState({ text: text }); onChangeText(text); }}
          onFocus={() => this.setState({ hideSuggestions: false })}
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
    this.noLocation = { elevation: null, lat: null, lng: null };
    this.state = { location: this.noLocation, gpsIcon: this.compass, getting: false };
    this.getLocation = this.getLocation.bind(this);
  }

  static defaultProps = {
    editable: true,
  };

  getLocation() {
    if (this.state.getting) { return; }
    this.setState({ gpsIcon: this.satellite, getting: true });
    const fiveMinutes = 5 * 60 * 1000;
    const fifteenSeconds = 15 * 1000;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          elevation: position.coords.altitude,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.setState({ location: location, gpsIcon: this.compass, getting: false });
        this.props.onLocation(location);
      },
      (error) => {
        this.setState({ location: this.noLocation, gpsIcon: this.compass, getting: false });
        Alert.alert(Strings.geolocationError, `${Strings.geolocationMessage}: ${error.message}`);
        this.props.onLocation(this.noLocation);
      },
      { enableHighAccuracy: true, maximumAge: fiveMinutes, timeout: fifteenSeconds },
    );
  }

  renderDegrees(x) {
    x = Math.abs(x);
    d = Math.floor(x);
    x -= d;
    x *= 60.0;
    m = Math.floor(x);
    x -= m;
    x *= 60.0;
    s = x;
    return `${d}° ${m}′ ${s.toFixed(1)}″`;
  }

  renderLatLng(latLng) {
    const { lat, lng } = latLng;
    if (!lat || !lng) { return ''; }
    const northSouth = lat > 0.0 ? Strings.north : Strings.south;
    const eastWest = lng > 0.0 ? Strings.east : Strings.west;
    return `${this.renderDegrees(lat)} ${northSouth} ${this.renderDegrees(lng)} ${eastWest}`;
  }

  renderElevation(location) {
    const { elevation } = location;
    if (!(elevation || elevation === 0)) { return ''; }
    return `${elevation}m`;
  }

  render() {
    const { editable } = this.props;
    const { location, gpsIcon } = this.state;
    const compassHitSlop = { top: 8, left: 8, bottom: 8, right: 8 };
    return editable ? (
      <View>
        <View style={styles.container}>
          <Text style={styles.label}>{Strings.latLng}</Text>
          <TextInput
            defaultValue={this.renderLatLng(location)}
            editable={false}
            style={styles.input}
            underlineColorAndroid={'transparent'}
          />
          <TouchableOpacity hitSlop={compassHitSlop} onPress={this.getLocation} style={styles.compassTouchable}>
            <Image source={gpsIcon} style={styles.compass} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.label}>{Strings.elevation}</Text>
          <TextInput
            defaultValue={this.renderElevation(location)}
            editable={false}
            style={styles.input}
            underlineColorAndroid={'transparent'}
          />
        </View>
      </View>
    ) : (
      <View>
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            value={this.renderLatLng(this.props.location)}
            editable={false}
            style={styles.input}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.label}>{Strings.elevation}</Text>
          <TextInput
            value={this.renderElevation(this.props.location)}
            editable={false}
            style={styles.input}
          />
        </View>
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
      secureTextEntry,
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
          secureTextEntry={secureTextEntry || false}
          style={styles.input}
          underlineColorAndroid={'transparent'}
        />
      </View>
    );
  }
}

class TagTextInput extends Component {
  constructor(props) {
    super(props);
    this.validateTag = this.validateTag.bind(this);
  }

  static normalizeTag(s) {
    return s.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
  }

  validateTag(e) {
    s = TagTextInput.normalizeTag(e.nativeEvent.text);
    const isValidTag = (s.length === 0 || s.length === 14);
    if (!isValidTag) {
      Alert.alert(Strings.badTagFormat, Strings.badTagFormatMessage);
    }
  }

  render() {
    const { onChangeText } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{Strings.tid}</Text>
        <TextInput
          autoCapitalize={'none'}
          autoCorrect={false}
          maxLength={20}
          onEndEditing={this.validateTag}
          onChangeText={onChangeText}
          placeholder={Strings.tid}
          style={styles.input}
          underlineColorAndroid={'transparent'}
        />
      </View>
    );
  }
}

export { AutoCompleteTextInput, FixedTextInput, GeolocationTextInput, PlainTextInput, TagTextInput };

const styles = StyleSheet.create({
  autoContainer: {
    height: 40,
    margin: 5,
    width: '97%',
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
