// import "react-native-reanimated";
import './expo-crypto-shim.js' // Only for Expo SDK 48+
import "react-native-url-polyfill/auto";
import "@walletconnect/react-native-compat";
import "@ethersproject/shims";
import { registerRootComponent } from 'expo';
import App from './src/App';

registerRootComponent(App);