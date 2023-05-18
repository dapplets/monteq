import "react-native-reanimated";
import './expo-crypto-shim.js' // Only for Expo SDK 48+
import "react-native-url-polyfill/auto";
import "@walletconnect/react-native-compat";
import "@ethersproject/shims";

import App from "./src/App.js";

export default function Index() {
  return <App />;
}
