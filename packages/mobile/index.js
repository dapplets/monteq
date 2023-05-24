// import "@ethersproject/shims"; // shims for ethers.js https://docs.ethers.org/v5/cookbook/react-native/#cookbook-reactnative
import "./expo-crypto-shim.js"; // Only for Expo SDK 48+
// import "react-native-url-polyfill/auto.js";
// import "@walletconnect/react-native-compat";
// import "@ethersproject/shims";
import { registerRootComponent } from "expo";
import App from "./src/App";
// import React from "react";
// import { Platform } from "react-native";

// if (Platform.OS === "web") {
//   window.React = React;
// } else {
//   // require("react-native-url-polyfill/auto.js");
// }

registerRootComponent(App);
