import React from 'react';
import { createStackNavigator } from 'react-navigation';

import HomeScreen from './components/homescreen/HomeScreen';
import NewScreen from './components/newscreen/NewScreen';
import PersistScreen from './components/persistscreen/PersistScreen';
import SignOutScreen from './components/signoutscreen/SignOutScreen';
import ViewScreen from './components/viewscreen/ViewScreen';

export default createStackNavigator(
  {
    Home: HomeScreen,
    New: NewScreen,
    Persist: PersistScreen,
    SignOut: SignOutScreen,
    View: ViewScreen,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
  }
);
