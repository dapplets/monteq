import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
import MainButton from '../components/MainButton';
import HollowButton from '../components/HollowButton';
import {Padding, Border, Color} from '../GlobalStyles';

const WelcomeScreen = () => {
  //   const navigation = useNavigation();

  return (
    <View style={styles.initiallogin}>
      <View style={styles.qWrapper}>
        <Image
          style={styles.qIcon}
          resizeMode="center"
          source={require('../assets/q.png')}
        />
      </View>
      <View style={[styles.logoWrapper, styles.logoWrapperFlexBox]}>
        <Image
          style={styles.logoIcon}
          resizeMode="center"
          source={require('../assets/logo.png')}
        />
      </View>
      <View style={[styles.mainbuttonParent, styles.logoWrapperFlexBox]}>
        <MainButton
          //   onMainButtonPress={() => navigation.navigate('UserStartScreen1')}
          frame470={require('../assets/frame-470.png')}
          startWithWalletConnect="Start with WalletConnect"
        />
        <HollowButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoWrapperFlexBox: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  qIcon: {
    left: 0,
    width: 590,
    height: 696,
    top: 0,
    position: 'absolute',
  },
  qWrapper: {
    marginTop: -284,
    marginLeft: -160,
    top: '50%',
    width: 320,
    left: '50%',
    position: 'absolute',
    height: 568,
  },
  logoIcon: {
    width: 222,
    height: 100,
  },
  logoWrapper: {
    left: 10,
    width: 300,
    height: 450,
    top: 0,
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
    height: 568,
  },
});

export default WelcomeScreen;
