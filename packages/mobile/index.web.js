import './expo-crypto-shim.js' // Only for Expo SDK 48+
import "@walletconnect/react-native-compat";
import "@ethersproject/shims";
import { registerRootComponent } from 'expo';
import React from 'react';

window.React = React;

import App from './src/App';

registerRootComponent(App);