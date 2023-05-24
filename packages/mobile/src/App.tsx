import { useNetInfo } from '@react-native-community/netinfo';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { enableScreens } from 'react-native-screens';

import Router from './Router';
import { ParsedReceipt, ParsedEDCON2023Code } from './common/parseReceipt';
import TxModal from './components/TxModal';
import { BusinessInfo } from './contexts/MonteqContractContext/MonteqContractContext';
import { WalletProvider } from './contexts/WalletContext';
import { useSettings } from './hooks/useSettings';

SplashScreen.preventAutoHideAsync();

enableScreens();

export type RootStackParamList = {
  InfoScreen: undefined;
  CameraScreen: undefined;
  TxScreen: { parsedReceipt: ParsedReceipt; businessInfo: BusinessInfo };
  WelcomeScreen: undefined;
  CodeScanned: undefined;
  MyBusiness: undefined;
  AddingMyBusiness: { parsedReceipt: ParsedReceipt };
  HowUse: undefined;
  RemovingMyBusiness: undefined;
  SendTokenScreen: { parsedQrCode: ParsedEDCON2023Code };
};

function App() {
  const { isConnected: isInternetConnected } = useNetInfo();
  const { isOwnerViewPreferred, isInitializing } = useSettings();

  const [fontsLoaded, error] = useFonts({
    roboto_black_italic: require('./assets/fonts/roboto_black_italic.ttf'),
    roboto_black: require('./assets/fonts/roboto_black.ttf'),
    roboto_bold_italic: require('./assets/fonts/roboto_bold_italic.ttf'),
    roboto_bold: require('./assets/fonts/roboto_bold.ttf'),
    roboto_italic: require('./assets/fonts/roboto_italic.ttf'),
    roboto_light: require('./assets/fonts/roboto_light.ttf'),
    roboto_medium_italic: require('./assets/fonts/roboto_medium_italic.ttf'),
    roboto_medium: require('./assets/fonts/roboto_medium.ttf'),
    roboto_regular: require('./assets/fonts/roboto_regular.ttf'),
    roboto_thin_italic: require('./assets/fonts/roboto_thin_italic.ttf'),
    roboto_thin: require('./assets/fonts/roboto_thin.ttf'),
  });

  useEffect(() => {
    (async () => {
      if (!isInitializing) {
        await SplashScreen.hideAsync();
      }
    })();
  }, [isInitializing]);

  if (!isInternetConnected && !isInitializing) {
    return (
      <View>
        <TxModal
          isVisible
          title="Check your connection"
          description="Try turning on your Wi-Fi or Mobile Data for using the app."
          image={require('./assets/noConnection.png')}
        />
      </View>
    );
  }

  if (isInitializing) {
    return null;
  }

  return (
    <SafeAreaView style={styles.containerApp}>
      <WalletProvider>
        <Router initialRouteName={isOwnerViewPreferred ? 'MyBusiness' : 'InfoScreen'} />
      </WalletProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerApp: {
    flex: 1,
  },
});

export default App;
