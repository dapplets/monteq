import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useWeb3Modal} from '@web3modal/react-native';
import * as React from 'react';
import {View, Alert, StyleSheet, TouchableHighlight, Image} from 'react-native';
import {type RootStackParamList} from '../App';
import ButtonNavigationDefault from './ButtonNavigationDefault';
import {parseReceipt} from '../common/parseReceipt';
import {useCamera} from '../contexts/CameraContext';
import SvgComponentUserActive from '../components/SVGUserActive';
import SvgComponentUserDefault from '../components/SVGUserDefault';
import SvgComponentExitActive from '../components/SVGExitActive';
import SvgComponentExitDefault from '../components/SVGExitDefault';
import SvgComponentHomeActive from '../components/SVGHomeActive';
import SvgComponentHomeDefault from '../components/SVGHomeDefault';
import SvgComponentHowActive from '../components/SVGHowActive';
import SvgComponentHowDefault from '../components/SVGHowDefault';
export type NavigationType = {
  path: string;
};

const Navigation = ({path}: NavigationType) => {
  const {provider} = useWeb3Modal();
  const {scan} = useCamera();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  function handleDisconnectPress() {
    provider?.disconnect();
  }

  async function navigationMyBusiness() {
    navigation.navigate('MyBusiness');
  }

  async function navigationHowUse() {
    navigation.navigate('HowUse');
  }

  async function navigationUserHistory() {
    navigation.navigate('InfoScreen');
  }

  async function handleGmsScanPress() {
    if (!provider) {
      return;
    }

    try {
      const url = await scan();
      const parsedReceipt = parseReceipt(url);
      navigation.navigate('TxScreen', {parsedReceipt});
    } catch (e) {
      console.error(e);

      // @ts-ignore
      if (e.message !== 'User canceled scanning') {
        // @ts-ignore
        Alert.alert('Error', e.message);
      }
    }
  }

  return (
    <View style={styles.NavigationWrapper}>
      <ButtonNavigationDefault
        onPress={navigationMyBusiness}
        children={
          path === 'home' ? (
            <SvgComponentHomeActive />
          ) : (
            <SvgComponentHomeDefault />
          )
        }
      />
      <ButtonNavigationDefault
        onPress={navigationHowUse}
        children={
          path === 'help' ? (
            <SvgComponentHowActive />
          ) : (
            <SvgComponentHowDefault />
          )
        }
      />
      <TouchableHighlight
        style={styles.scanButton}
        underlayColor={'transparent'}
        activeOpacity={0.5}
        onPress={handleGmsScanPress}>
        <Image
          style={styles.scanButtonImg}
          resizeMode="contain"
          source={require('../assets/scan.png')}
        />
      </TouchableHighlight>
      <ButtonNavigationDefault
        onPress={navigationUserHistory}
        children={
          path === 'user' ? (
            <SvgComponentUserActive />
          ) : (
            <SvgComponentUserDefault />
          )
        }
      />
      <ButtonNavigationDefault
        onPress={handleDisconnectPress}
        children={<SvgComponentExitDefault />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  NavigationWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
    height: 60,
    position: 'absolute',
    backgroundColor: '#fff',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    paddingStart: 11,
    paddingEnd: 21,
    // paddingBottom: 20,
    bottom: 0,
    left: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: -20,
      height: -20,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
  scanButton: {
    // position: 'absolute',
    width: 70,
    height: 70,
    backgroundColor: '#F6F7F8',
    display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    marginBottom: 50,
    borderRadius: 45,
  },
  scanButtonImg: {
    // marginTop: 20,
    // marginBottom: 'auto',
    marginTop: '10%',
    width: 70,
    height: 70,
  },
  clockIcon: {},
  iconLayout: {},
  logOutWrapper: {},
});

export default Navigation;
