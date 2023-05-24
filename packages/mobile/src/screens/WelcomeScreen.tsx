import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Padding, Border, Color } from '../GlobalStyles';
import HollowButton from '../components/HollowButton';
import MainButton from '../components/MainButton';
import { useWallet } from '../contexts/WalletContext';
import { WalletTypes } from '../contexts/WalletContext/WalletContext';

const WelcomeScreen = () => {
  const { connect } = useWallet();

  function handleWalletConnectPress() {
    connect(WalletTypes.WalletConnect);
  }

  return (
    <View style={styles.initialLoginWelcomeScreen}>
      <View style={styles.bgWelcomeScreen}>
        <Image
          style={styles.bgWelcomeScreen}
          resizeMode="cover"
          source={require('../assets/appbg.png')}
        />
        <Image
          style={styles.qIconWelcomeScreen}
          resizeMode="contain"
          source={require('../assets/q.png')}
        />
      </View>
      <View
        style={[
          styles.monteqLogo1WrapperWelcomeScreen,
          styles.mainButtonParentFlexBoxWelcomeScreen,
        ]}>
        <Image
          style={styles.monteqLogo1WelcomeScreen}
          resizeMode="center"
          source={require('../assets/monteq-logo-1.png')}
        />
      </View>
      <View
        style={[styles.mainButtonParentWelcomeScreen, styles.mainButtonParentFlexBoxWelcomeScreen]}>
        <MainButton
          onPress={handleWalletConnectPress}
          image={require('../assets/walletConnect.png')}
          label="Start with WalletConnect"
        />
        <HollowButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainButtonParentFlexBoxWelcomeScreen: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },

  bgWelcomeScreen: {
    width: '100%',
    height: '100%',
  },
  qIconWelcomeScreen: {
    width: '200%',
    height: '200%',
    position: 'absolute',
    top: '-32%',
    left: '-63%',
    zIndex: 0,
  },
  monteqLogo1WelcomeScreen: {
    width: 236,
    height: 100,
  },
  monteqLogo1WrapperWelcomeScreen: {
    width: '100%',
    height: '100%',
  },

  startWithWalletconnectWelcomeScreen: {
    color: Color.white,
    marginLeft: 10,
  },

  mainButtonParentWelcomeScreen: {
    marginLeft: -133.5,
    bottom: 0,
    width: 267,
    padding: Padding.p_3xs,
    left: '50%',
  },
  initialLoginWelcomeScreen: {
    borderRadius: Border.br_9xs,
    backgroundColor: Color.whitesmoke,
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    height: '100%',
  },
});

export default WelcomeScreen;
