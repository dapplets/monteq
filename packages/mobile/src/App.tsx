import { useNetInfo } from '@react-native-community/netinfo';

import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { enableScreens } from 'react-native-screens';

import Router from './Router';
import TxModal from './components/TxModal';
import { WalletProvider } from './contexts/WalletContext';
import { useSettings } from './hooks/useSettings';

SplashScreen.preventAutoHideAsync();

enableScreens();

function App() {
  const { isConnected: isInternetConnected } = useNetInfo();
  const { isOwnerViewPreferred, isInitializing } = useSettings();

  useEffect(() => {
    (async () => {
      if (!isInitializing) {
        await SplashScreen.hideAsync();
      }
    })();
  }, [isInitializing]);

  if (isInitializing) {
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
