import './expo-crypto-shim.js'; // Only for Expo SDK 48+
import '@ethersproject/shims'; // shims for ethers.js https://docs.ethers.org/v5/cookbook/react-native/#cookbook-reactnative
import 'react-native-url-polyfill/auto.js'; // for URL parser
import { registerRootComponent } from 'expo';

import App from './src/App';

registerRootComponent(App);
