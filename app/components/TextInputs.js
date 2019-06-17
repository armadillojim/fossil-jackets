import React, { Component } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import Autocomplete from 'react-native-autocomplete-input';
import NfcManager, { Ndef } from 'react-native-nfc-manager';

import Strings from './assets/Strings';

const iconHitSlop = { top: 8, left: 8, bottom: 8, right: 8 };

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
    this.noLocation = { elevation: null, lat: null, lng: null };
    this.state = { location: this.noLocation, getting: false };
    this.getLocation = this.getLocation.bind(this);
  }

  static defaultProps = {
    editable: true,
  };

  getLocation() {
    if (this.state.getting) { return; }
    this.setState({ getting: true });
    const fiveMinutes = 5 * 60 * 1000;
    const fifteenSeconds = 15 * 1000;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          elevation: position.coords.altitude,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.setState({ location: location, getting: false });
        this.props.onLocation(location);
      },
      (error) => {
        this.setState({ location: this.noLocation, getting: false });
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
    return `${elevation.toFixed(2)}m`;
  }

  render() {
    const { editable } = this.props;
    const { location, getting } = this.state;
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
          <TouchableOpacity hitSlop={iconHitSlop} onPress={this.getLocation} style={styles.iconTouchable}>
            <Icon
              name={ getting ? 'satellite-variant' : 'compass' }
              size={ (Platform.OS === 'ios') ? 20 : 28 }
            />
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
          <Text style={styles.label}>{Strings.latLng}</Text>
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
    this.state = {
      canRead: false,
      isReading: false,
      tagId: null,
    };
    this.getTag = this.getTag.bind(this);
    this.onTag = this.onTag.bind(this);
    this.onTagId = this.onTagId.bind(this);
    this.validateTag = this.validateTag.bind(this);
  }

  componentDidMount() {
    NfcManager.start({
      onSessionClosedIOS: () => {
        Alert.alert(
          Strings.closedSessionTitle,
          Strings.closedSession,
          [{ text: Strings.OK, onPress: () => { this.setState({ canRead: false }); } }],
          { cancelable: false },
        );
      }
    })
    .then(() => {
      if (Platform.OS === 'android') {
        // On Android, it is possible for NFC to be off, but start() succeeds
        NfcManager.isEnabled()
        .then((enabled) => { this.setState({ canRead: enabled }); })
        .catch(() => { this.setState({ canRead: false }); });
      }
      else {
        // On iOS, NFC is always enabled (if present)
        this.setState({ canRead: true });
      }
    })
    .catch((error) => {
      // either no NFC capability, device's NFC is off, or permission was denied
      this.setState({ canRead: false });
    });
  }

  componentWillUnmount() {
    NfcManager.unregisterTagEvent().then(() => {}).catch(() => {});
    NfcManager.stop().then(() => {}).catch(() => {});
  }

  getTag() {
    if (this.state.isReading) { return; }
    NfcManager.registerTagEvent(this.onTag).then(() => {
      this.setState({ isReading: true });
    }).catch((error) => {
      Alert.alert(
        Strings.tagReadingError,
        JSON.stringify(error),
        [{ text: Strings.OK, onPress: () => { this.setState({ isReading: false }); } }],
        { cancelable: false },
      );
    });
  }

  onTag(tag) {
    NfcManager.unregisterTagEvent().then(() => {}).catch(() => {});
    let tagId = (tag.id && tag.id.length >= 4) ? tag.id : null;
    if (!tagId) {
      try {
        if (!tag.ndefMessage || !tag.ndefMessage.length) {
          throw { message: 'No NDEF records on tag' };
        }
        if (!Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
          throw { message: 'Unknown NDEF record on tag' };
        }
        tagId = Ndef.text.decodePayload(tag.ndefMessage[0].payload);
      }
      catch (error) {
        tagId = null;
        Alert.alert(
          Strings.tagReadingError,
          JSON.stringify(error),
          [{ text: Strings.OK, onPress: () => { this.setState({ isReading: false }); } }],
          { cancelable: false },
        );
      }
    }
    this.onTagId(tagId);
  }

  onTagId(tagId) {
    this.setState({ isReading: false, tagId: tagId });
    this.props.onChangeText(tagId);
  }

  static normalizeTag(s) {
    return s.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
  }

  validateTag(e) {
    const hasInput = e.nativeEvent.text.length > 0;
    s = TagTextInput.normalizeTag(e.nativeEvent.text);
    const isValidTag = ((!hasInput && s.length === 0) || s.length === 14);
    if (!isValidTag) {
      Alert.alert(Strings.badTagFormat, Strings.badTagFormatMessage);
    }
  }

  render() {
    const { onChangeText } = this.props;
    const { canRead, isReading, tagId } = this.state;
    return canRead ? (
      <View style={styles.container}>
        <Text style={styles.label}>{Strings.tid}</Text>
        <TextInput
          defaultValue={tagId}
          editable={false}
          style={styles.input}
          underlineColorAndroid={'transparent'}
        />
        <TouchableOpacity hitSlop={iconHitSlop} onPress={this.getTag} style={styles.iconTouchable}>
          <Icon
            name={ isReading ? 'nfc' : 'nfc-variant' }
            size={ (Platform.OS === 'ios') ? 20 : 28 }
          />
        </TouchableOpacity>
      </View>
    ) : (
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
  iconTouchable: {
    position: 'absolute',
    right: 5,
    top: 11,
  },
});
