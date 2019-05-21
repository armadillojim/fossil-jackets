import React, { Component } from 'react';
import { Button, Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { ImagePicker, Permissions } from 'expo';

import Strings from './assets/Strings';

class PhotoInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: true,
      images: [],
    };
    this.replaceImage = this.replaceImage.bind(this);
  }

  async componentDidMount() {
    // CAMERA_ROLL permission is only required on iOS (not Android)
    if (Platform.OS !== 'ios') {
      return;
    }
    // check if we have permission
    const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (permission.status === 'granted') {
      // we're golden
      return;
    }
    // ask if we can have permission
    const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (newPermission.status !== 'granted') {
      // disable the component
      this.setState({ hasPermission: false })
    } // else we're golden
  }

  replaceImage = async (i) => {
    // get an image from the user
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.90,
    });
    // if they cancelled the edit, remove the image (unless it was to be
    // a new image, or it's the last image which we can't remove)
    const { maximum, onChange, preventEmpty } = this.props;
    const { images } = this.state;
    if (result.cancelled) {
      if (i < images.length && (images.length > 1 || !preventEmpty)) {
        const newState = [...images];
        newState.splice(i, 1);
        this.setState({ images: newState });
        onChange(maximum === 1 ? null : newState);
      }
    }
    // we got a new image: replace the image at the current position
    else {
      const newImage = {
        uri: result.uri,
      };
      const newState = [...images];
      newState[i] = newImage;
      this.setState({ images: newState });
      onChange(maximum === 1 ? newState[0] : newState);
    }
  };

  render() {
    const { hasPermission, images } = this.state;
    // if we don't have CAMERA_ROLL permission, display a text warning
    if (!hasPermission) {
      return (
        <View style={{ margin: 5, width: '97%', height: 110 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }} key={`1`}>
            <View style={{ width: 100, height: 100 }} key={'noPhotoPermission'}>
              <Text style={{ fontWeight: 'bold' }}>{Strings.noPhotoPermission}</Text>
            </View>
          </View>
        </View>
      );
    }
    // build some markup for all the items to display
    const that = this;
    const items = images.map((image, i) => { return (
      <View style={{ width: 100, height: 100 }} key={`${i}`}>
        <TouchableOpacity onPress={() => { that.replaceImage(i); }}>
          <Image source={{ uri: images[i].uri }} style={{ width: 100, height: 100 }} />
        </TouchableOpacity>
      </View>
    ); });
    const { label, maximum } = this.props;
    if (images.length < maximum) {
      items.push(
        <View style={{ width: 100, height: 100 }} key={'addPhoto'}>
          <Button
            title={Strings.addPhoto}
            onPress={() => { that.replaceImage(images.length); }}
          />
        </View>
      );
    }
    // break up items into rows
    const itemsPerRow = 3, rows = [];
    var r = 0;
    while (items.length) {
      const rowSlice = items.splice(0, itemsPerRow);
      rows.push(
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }} key={`${r}`}>
          {rowSlice}
        </View>
      );
      r += 1;
    }
    // render the label and rows in a container
    return (
      <View style={{ margin: 5, width: '97%', height: 110 * r }}>
        <Text style={{ fontSize: 8, fontWeight: 'bold' }}>{label}</Text>
        {rows}
      </View>
    );
  }
}

export default PhotoInput;
