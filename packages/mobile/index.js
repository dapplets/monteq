import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';
import '@walletconnect/react-native-compat';
import '@ethersproject/shims';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
