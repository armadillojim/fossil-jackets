import React from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';

import AuthLoadingScreen from './components/AuthLoadingScreen';
import HomeScreen from './components/HomeScreen';
import NewScreen from './components/NewScreen';
import SignInScreen from './components/SignInScreen';
import SignOutScreen from './components/SignOutScreen';
import UploadScreen from './components/UploadScreen';
import ViewScreen from './components/ViewScreen';

const AuthStack = createStackNavigator({ SignIn: SignInScreen });
const AppStack = createStackNavigator(
  {
    Home: HomeScreen,
    New: NewScreen,
    SignOut: SignOutScreen,
    Upload: UploadScreen,
    View: ViewScreen,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
  }
);

export default createSwitchNavigator(
  {
    App: AppStack,
    Auth: AuthStack,
    AuthLoading: AuthLoadingScreen,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
