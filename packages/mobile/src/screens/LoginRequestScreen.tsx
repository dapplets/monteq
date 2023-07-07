import * as React from 'react';
import { Image, StyleSheet, View, Text, Platform } from 'react-native';

import { Padding, Border, Color, FontSize, FontFamily } from '../GlobalStyles';
import HollowButton from '../components/HollowButton';
import MainButton from '../components/MainButton';
import { useWallet } from '../contexts/WalletContext';
import { WalletTypes } from '../contexts/WalletContext/WalletContext';

const LoginRequestScreen = () => {
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
      </View>
      {/* <View
        style={[
          styles.monteqLogo1WrapperWelcomeScreen,
          styles.mainButtonParentFlexBoxWelcomeScreen,
        ]}> */}
      <View
        style={[styles.mainButtonParentFlexBoxWelcomeScreen, styles.mainButtonParentWelcomeScreen]}>
        <View style={styles.loginRequestDescriptionBlock}>
          <Text style={styles.loginRequestTitle}>Login requested</Text>
          <Text style={styles.loginRequestDescription}>
            Scenarioname scenario requested you to be logged in for further actions
          </Text>
        </View>
        {/* <MainButton
          // onPress={handleWalletConnectPress}
          image={require('../assets/biometry.png')}
          label="Biometry"
        /> */}
        {/* <MainButton
          // onPress={handleWalletConnectPress}
          image={require('../assets/twitter.png')}
          label="Twitter"
        /> */}
        <MainButton
          onPress={handleWalletConnectPress}
          image={require('../assets/walletConnect.png')}
          label="Log In"
        />
        {/* </View> */}
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
    // position: 'relative',
    marginLeft: -133.5,
    bottom: 200,

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
    zIndex: 100,
  },
  loginRequestDescriptionBlock: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  loginRequestTitle: {
    textAlign: 'center',
    paddingBottom: 40,
    fontSize: 24,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
    color: '#222',
  },
  loginRequestDescription: {
    lineHeight: 16,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
    color: '#222',
  },
});

export default LoginRequestScreen;
