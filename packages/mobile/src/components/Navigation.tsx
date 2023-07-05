import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { View, Alert, StyleSheet, TouchableHighlight, Platform, Image } from 'react-native';

import ButtonNavigationDefault from './ButtonNavigationDefault';
import { DomainType, parseQrCodeData } from '../common/parseReceipt';
import { useCamera } from '../contexts/CameraContext';
import { useWallet } from '../contexts/WalletContext';
import SvgComponentExitDefault from '../icons/SVGExitDefault';
import SvgComponentHomeActive from '../icons/SVGHomeActive';
import SvgComponentHomeDefault from '../icons/SVGHomeDefault';
import SvgComponentHowActive from '../icons/SVGHowActive';
import SvgComponentHowDefault from '../icons/SVGHowDefault';
import SvgComponentUserActive from '../icons/SVGUserActive';
import SvgComponentUserDefault from '../icons/SVGUserDefault';

const Navigation: React.FC<BottomTabBarProps> = ({ navigation, state }) => {
  const { disconnect } = useWallet();
  const { scan, stop: stopScanning, isScanning } = useCamera();

  const routeName = state.routeNames[state.index];

  function handleDisconnectPress() {
    stopScanning();
    disconnect();
  }

  async function navigationMyBusiness() {
    stopScanning();
    navigation.navigate('MyBusiness');
  }

  async function navigationHowUse() {
    stopScanning();
    navigation.navigate('HowUse');
  }

  async function navigationUserHistory() {
    stopScanning();
    navigation.navigate('Profile');
  }

  async function handleGmsScanPress() {
    if (isScanning) {
      stopScanning();
      return;
    }

    try {
      const url = await scan();
      const parsedQrCode = parseQrCodeData(url);

      if (parsedQrCode.domain === DomainType.MontenegroFiscalCheck) {
        navigation.navigate('TxScreen', {
          parsedReceipt: parsedQrCode.payload,
        });
      } else if (parsedQrCode.domain === DomainType.EDCON2023) {
        navigation.navigate('SendTokenScreen', {
          parsedQrCode: parsedQrCode.payload,
        });
      } else {
        throw new Error('Not implemented domain');
      }
    } catch (e) {
      console.error(e);

      // @ts-ignore
      if (e.message !== 'User canceled scanning') {
        if (Platform.OS === 'web') {
          // @ts-ignore
          alert(e.message);
        } else {
          // @ts-ignore
          Alert.alert('Error', e.message);
        }
      }
    }
  }

  return (
    <View style={styles.navigationWrapper}>
      <ButtonNavigationDefault
        onPress={navigationMyBusiness}
        isActive={routeName === 'MyBusiness'}
        children={
          routeName === 'MyBusiness' ? <SvgComponentHomeActive /> : <SvgComponentHomeDefault />
        }
      />
      <ButtonNavigationDefault
        onPress={navigationHowUse}
        isActive={routeName === 'HowUse'}
        children={routeName === 'HowUse' ? <SvgComponentHowActive /> : <SvgComponentHowDefault />}
      />
      <TouchableHighlight
        disabled={isScanning}
        style={isScanning ? styles.scanButtonCamera : styles.scanButton}
        underlayColor="transparent"
        activeOpacity={0.5}
        onPress={handleGmsScanPress}>
        <Image
          style={styles.scanButtonImg}
          source={
            isScanning
              ? require('../assets/circularButtonDisabled.png')
              : require('../assets/circularButton.png')
          }
        />
      </TouchableHighlight>
      <ButtonNavigationDefault
        onPress={navigationUserHistory}
        isActive={routeName === 'InfoScreen'}
        children={
          routeName === 'InfoScreen' ? <SvgComponentUserActive /> : <SvgComponentUserDefault />
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
  navigationWrapper: {
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
    paddingStart: Platform.OS === 'ios' || Platform.OS === 'web' ? 21 : 11,
    paddingEnd: 21,
    bottom: 0,
    left: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
  scanButton: {
    width: 70,
    height: 70,
    backgroundColor: '#F6F7F8',
    display: 'flex',

    marginBottom: 50,
    borderRadius: 45,
    zIndex: 101,
    padding: 5,
  },
  scanButtonCamera: {
    width: 70,
    height: 70,
    backgroundColor: '#000',
    display: 'flex',

    marginBottom: 50,
    borderRadius: 45,
    zIndex: 101,
    padding: 5,
  },

  scanButtonImg: {
    marginTop: '5%',
    zIndex: 20,
    alignSelf: 'center',
    width: 70,
    height: 70,
  },
});

export default Navigation;
