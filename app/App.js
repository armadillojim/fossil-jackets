import React from 'react';
import { createStackNavigator } from 'react-navigation';

import HomeScreen from './components/HomeScreen';
import NewScreen from './components/NewScreen';
import PersistScreen from './components/PersistScreen';
import SignOutScreen from './components/SignOutScreen';
import ViewScreen from './components/ViewScreen';

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
