import React, { Component } from 'react';
import { Alert, Clipboard, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';

import Strings from './assets/Strings';
import { buildTag } from './lib/TagService';

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
      <View style={styles.autoContainer}>
        <Text style={styles.label}>{label}</Text>
        <Autocomplete
          data={filteredSuggestions}
          hideResults={hideSuggestions}
          inputContainerStyle={styles.inputContainer}
          listStyle={{zIndex: 1, position: 'absolute'}}
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
    this.state = { lat: null, lng: null, gpsIcon: this.compass };
    this.getLocation = this.getLocation.bind(this);
  }

  static defaultProps = {
    editable: true,
  };

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

  render() {
    const { editable, label, latLng, onLocation } = this.props;
    const compassHitSlop = { top: 8, left: 8, bottom: 8, right: 8 };
    return editable ? (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          defaultValue={this.renderLatLng(this.state)}
          editable={false}
          style={styles.input}
          underlineColorAndroid={'transparent'}
        />
        <TouchableOpacity hitSlop={compassHitSlop} onPress={this.getLocation} style={styles.compassTouchable}>
          <Image source={this.state.gpsIcon} style={styles.compass} />
        </TouchableOpacity>
      </View>
    ) : (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          value={this.renderLatLng(this.props.latLng)}
          editable={false}
          style={styles.input}
        />
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

class TagTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { uuid: '' };
    this.getClipboard = this.getClipboard.bind(this);
  }

  stringToSerial(s) {
    const byte = '[0-9A-F]{2}';
    const validSerialRegExp = new RegExp(`^${byte}:${byte}:${byte}:${byte}:${byte}:${byte}:${byte}$`);
    if (!validSerialRegExp.test(s)) { return null; }
    return s.split(':').map(hexByte => parseInt(hexByte, 16));
  }

  getClipboard = async (showAlerts) => {
    // check for clipboard contents, and alert if it's empty
    const serialString = await Clipboard.getString();
    if (!serialString) {
      if (showAlerts) {
        Alert.alert(Strings.emptyClipboard, Strings.emptyClipboardMessage);
      }
      return;
    }
    // check for a valid tag serial number
    const serial = this.stringToSerial(serialString);
    if (!serial) {
      if (showAlerts) {
        Alert.alert(Strings.badFormat, Strings.badFormatMessage);
      }
      return;
    }
    // get the tag data
    const { uid, token } = this.props;
    const { uuid, tagString } = buildTag(serial, uid, token);
    // display the UUID in the TextInput, pass it to the parent, and set the tag payload to the clipboard
    this.setState({ uuid: uuid });
    this.props.onTag(uuid);
    Clipboard.setString(tagString);
    // give the user an alert with instructions on what to do next
    if (showAlerts) { Alert.alert(Strings.returnToNFC, Strings.tagInstructions); }
  };

  componentDidMount() {
    this.getClipboard(false);
  }

  render() {
    const clipboardHitSlop = { top: 8, left: 8, bottom: 8, right: 8 };
    const { label } = this.props;
    const { uuid } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          defaultValue={uuid}
          editable={false}
          style={styles.input}
          underlineColorAndroid={'transparent'}
        />
        <TouchableOpacity hitSlop={clipboardHitSlop} onPress={() => this.getClipboard(true)} style={styles.clipboardTouchable}>
          <Image source={require('./assets/clipboard.png')} style={styles.clipboard} />
        </TouchableOpacity>
      </View>
    );
  }
}

export { AutoCompleteTextInput, FixedTextInput, GeolocationTextInput, PlainTextInput, TagTextInput };

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
  clipboardTouchable: {
    position: 'absolute',
    right: 4,
    top: 14,
  },
  clipboard: {
    height: 24,
    width: 24,
  },
});
