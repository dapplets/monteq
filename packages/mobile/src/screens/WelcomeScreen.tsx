import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import MainButton from '../components/MainButton';
import HollowButton from '../components/HollowButton';
import {Padding, Border, FontFamily, FontSize, Color} from '../GlobalStyles';
import {useWeb3Modal} from '@web3modal/react-native';

const WelcomeScreen = () => {
  const {open} = useWeb3Modal();

  return (
    <View style={styles.initiallogin}>
      <View style={styles.bg}>
        <Image
          style={styles.bg}
          resizeMode="cover"
          source={require('../assets/appbg.png')}
        />
        <Image
          style={styles.qIcon}
          resizeMode="contain"
          source={require('../assets/q.png')}
        />
      </View>
      <View style={[styles.monteqLogo1Wrapper, styles.mainbuttonParentFlexBox]}>
        <Image
          style={styles.monteqLogo1}
          resizeMode="center"
          source={require('../assets/monteq-logo-1.png')}
        />
      </View>
      <View style={[styles.mainbuttonParent, styles.mainbuttonParentFlexBox]}>
        <MainButton
          onPress={open}
          image={require('../assets/walletconnect.png')}
          label="Start with WalletConnect"
        />
        <HollowButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainbuttonParentFlexBox: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  mainbuttonFlexBox: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_xl,
    flexDirection: 'row',
    height: 48,
    borderRadius: Border.br_31xl,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  howItWorksTypo: {
    textAlign: 'left',
    fontFamily: FontFamily.robotoBold,
    fontWeight: '700',
    fontSize: FontSize.semibold_size,
  },
  bg: {
    width: '100%',
    height: '100%',
  },
  qIcon: {
    width: '200%',
    height: '200%',
    position: 'absolute',
    top: '-32%',
    left: '-63%',
    zIndex: 0,
  },
  monteqLogo1: {
    width: 236,
    height: 100,
  },
  monteqLogo1Wrapper: {
    width: '100%',
    height: '100%',
  },
  mainbuttonChild: {
    width: 40,
    height: 40,
    overflow: 'hidden',
  },
  startWithWalletconnect: {
    color: Color.white,
    marginLeft: 10,
  },
  mainbutton: {
    backgroundColor: Color.dodgerblue,
  },
  howItWorks: {
    textDecoration: 'underline',
    color: Color.gray_300,
  },
  mainbutton1: {
    marginTop: 10,
  },
  mainbuttonParent: {
    marginLeft: -133.5,
    bottom: 0,
    width: 267,
    padding: Padding.p_3xs,
    left: '50%',
  },
  initiallogin: {
    borderRadius: Border.br_9xs,
    backgroundColor: Color.whitesmoke,
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    height: '100%',
  },
});

export default WelcomeScreen;
