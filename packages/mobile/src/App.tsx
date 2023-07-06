import { useNetInfo } from '@react-native-community/netinfo';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { enableScreens } from 'react-native-screens';

import Router from './Router';
import TxModal from './components/TxModal';
import { WalletProvider, useWallet } from './contexts/WalletContext';
import { useSettings } from './hooks/useSettings';

SplashScreen.preventAutoHideAsync();

enableScreens();

function App() {
  const { isConnected: isInternetConnected } = useNetInfo();
  const { isOwnerViewPreferred, isInitializing } = useSettings();
  const { isConnected: isWalletConnected } = useWallet();
  const [fontsLoaded] = useFonts({
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
  }, [isInitializing,isWalletConnected]);

  if (isInitializing || !fontsLoaded) {
    return null;
  }

  if (!isInternetConnected && !isInitializing) {
    return (
      <View>
        <StatusBar style="dark" />
        <TxModal
          isVisible
          title="Check your connection"
          description="Try turning on your Wi-Fi or Mobile Data for using the app."
          image={require('./assets/noConnection.png')}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.containerApp}>
      <StatusBar style="dark" />
      <WalletProvider>
        <Router
          initialRouteName={
            isOwnerViewPreferred && isWalletConnected
              ? 'ProfileScreen'
              : isOwnerViewPreferred && !isWalletConnected
              ? 'WelcomeScreen'
              : 'CameraScreen'
          }
        />
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
