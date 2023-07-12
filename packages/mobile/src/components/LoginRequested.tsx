import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';

import { Border, Color, Padding } from '../GlobalStyles';
import MainButton from './MainButton';

export type LoginRequestedType = {
  handleWalletConnectPress: any;
  closeLoginRequest: any;
};

const LoginRequested = ({ handleWalletConnectPress, closeLoginRequest }: LoginRequestedType) => {
  return (
    <View style={styles.initialLoginWelcomeScreen}>
      <TouchableHighlight
        underlayColor="transparent"
        activeOpacity={0.5}
        onPress={closeLoginRequest}
        style={styles.initialLoginClose}>
        <Image
          style={styles.initialLoginClose}
          resizeMode="cover"
          source={require('../assets/new_close.png')}
        />
      </TouchableHighlight>

      <View style={styles.bgWelcomeScreen}>
        <Image
          style={styles.bgWelcomeScreen}
          resizeMode="cover"
          source={require('../assets/appbg.png')}
        />
      </View>

      <View
        style={[styles.mainButtonParentFlexBoxWelcomeScreen, styles.mainButtonParentWelcomeScreen]}>
        <View style={styles.loginRequestDescriptionBlock}>
          <Text style={styles.loginRequestTitle}>Login requested</Text>
          <Text style={styles.loginRequestDescription}>
            Scenarioname scenario requested you to be logged in for further actions
          </Text>
        </View>

        <MainButton
          onPress={handleWalletConnectPress}
          image={require('../assets/walletConnect.png')}
          label="Log In"
        />
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
    // flex: 1,
    width: '100%',
    overflow: 'hidden',
    height: '100%',
    zIndex: 99,
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

    color: '#222',
  },
  loginRequestDescription: {
    lineHeight: 16,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',

    color: '#222',
  },
  initialLoginClose: {
    position: 'absolute',
    right: 5,
    top: 10,
    width: 24,
    height: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});
export default LoginRequested;
