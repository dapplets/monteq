import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { View, Alert, StyleSheet, TouchableHighlight, Platform, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
import { useEffect, useState } from 'react';
import CameraModal from './CameraModal';
import { FontFamily } from '../GlobalStyles';
import SvgComponentClock from '../icons/SVGClock';

const TEST_BUTTONS = [{ text: 'Pay receipt' }, { text: 'Use reward' }, { text: 'Share table' }];

const Navigation: React.FC<BottomTabBarProps> = ({ navigation, state }) => {
  const { disconnect } = useWallet();
  const { scan, stop: stopScanning, isScanning } = useCamera();
  const { isConnected: isWalletConnected } = useWallet();
  const routeName = state.routeNames[state.index];
  const [isModalCamera, setModalCamera] = useState(false);

  useEffect(() => {
    if (
      isWalletConnected &&
      (routeName === 'WelcomeScreen' || routeName === 'LoginRequestScreen')
    ) {
      navigation.navigate('ProfileScreen');
    }
  }, [isWalletConnected, isModalCamera]);

  function handleDisconnectPress() {
    stopScanning();
    disconnect();
    navigation.navigate('WelcomeScreen');
  }

  async function navigationMyBusiness() {
    stopScanning();
    navigation.navigate('MyBusiness');
  }

  async function navigationHowUse() {
    stopScanning();
    navigation.navigate('HowUse');
  }
  async function navigationLogInRequest() {
    if (isWalletConnected) {
      stopScanning();
      setModalCamera(false);
      navigation.navigate('ProfileScreen');
    } else {
      stopScanning();
      setModalCamera(false);
      navigation.navigate('LoginRequestScreen');
    }
  }
  async function navigationUserHistory() {
    if (isWalletConnected) {
      stopScanning();
      navigation.navigate('ProfileScreen');
    } else {
      stopScanning();
      navigation.navigate('WelcomeScreen');
    }
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
        // navigation.navigate('TxScreen', {
        //   parsedReceipt: parsedQrCode.payload,
        // });
        if (isWalletConnected) {
          setModalCamera(true);
          // navigation.navigate('ProfileScreen', {
          //   parsedReceipt: parsedQrCode.payload,
          // });
          navigation.navigate('CameraScreen', {
            parsedReceipt: parsedQrCode.payload,
          });
        } else {
          setModalCamera(true);
          // navigation.navigate('WelcomeScreen', {
          //   parsedReceipt: parsedQrCode.payload,
          // });
          navigation.navigate('CameraScreen', {
            parsedReceipt: parsedQrCode.payload,
          });
        }
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
    <>
      {routeName === 'WelcomeScreen' || routeName === 'LoginRequestScreen' ? null : (
        <View style={styles.navigationWrapper}>
          {/* <ButtonNavigationDefault
            onPress={navigationMyBusiness}
            isActive={routeName === 'MyBusiness'}
            children={
              routeName === 'MyBusiness' ? <SvgComponentHomeActive /> : <SvgComponentHomeDefault />
            }
          /> */}
          <ButtonNavigationDefault
            onPress={navigationHowUse}
            // isActive={routeName === 'HowUse'}
            children={<SvgComponentHowDefault />}
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
            // isActive={routeName === 'ProfileScreen'}
            children={
              routeName === 'ProfileScreen' ? <SvgComponentClock /> : <SvgComponentUserDefault />
            }
          />
          {/* <ButtonNavigationDefault
            onPress={handleDisconnectPress}
            children={<SvgComponentExitDefault />}
          /> */}
        </View>
      )}
      {isModalCamera ? (
        <CameraModal
          isVisible={isModalCamera}
          onRequestClose={() => setModalCamera(false)}
          children={
            <>
              {TEST_BUTTONS.map((x, i) => (
                <LinearGradient
                  key={i}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.linearGradientShareModal}
                  colors={['#0dd977', '#1da4ac', '#14c48c']}>
                  <TouchableHighlight
                    underlayColor="#1da4ac"
                    activeOpacity={0.5}
                    onPress={navigationLogInRequest}
                    style={styles.primaryButtonShareModal}>
                    <Text style={styles.primaryButtonTextShareModal}>{x.text}</Text>
                  </TouchableHighlight>
                </LinearGradient>
              ))}
            </>
          }
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  viewModal: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 200,
  },
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
    zIndex: 99,
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

  linearGradientShareModal: {
    display: 'flex',
    borderRadius: 50,
    width: 200,
    marginTop: 10,
  },
  primaryButtonShareModal: {
    backgroundColor: 'transparent',
    width: 200,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  primaryButtonTextShareModal: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,

    color: '#ffffff',
    fontFamily: FontFamily.robotoBold,
  },
});

export default Navigation;
