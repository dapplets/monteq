import { NavigationProp, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { View, Alert, StyleSheet, TouchableHighlight, Platform, Image } from 'react-native';

import ButtonNavigationDefault from './ButtonNavigationDefault';
import { type RootStackParamList } from '../App';
import { DomainType, parseQrCodeData } from '../common/parseReceipt';
import { useCamera } from '../contexts/CameraContext';
import { useMonteqContract } from '../contexts/MonteqContractContext';
import { useWallet } from '../contexts/WalletContext';
import SvgComponentExitDefault from '../icons/SVGExitDefault';
import SvgComponentHomeActive from '../icons/SVGHomeActive';
import SvgComponentHomeDefault from '../icons/SVGHomeDefault';
import SvgComponentHowActive from '../icons/SVGHowActive';
import SvgComponentHowDefault from '../icons/SVGHowDefault';
import SvgComponentScan from '../icons/SVGScanBtn';
import SvgComponentUserActive from '../icons/SVGUserActive';
import SvgComponentUserDefault from '../icons/SVGUserDefault';

export type NavigationType = {
  path: string;
};

const Navigation = ({ path }: NavigationType) => {
  const { disconnect } = useWallet();
  const { scan } = useCamera();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { getBusinessInfoById, updateUserBalance } = useMonteqContract();

  function handleDisconnectPress() {
    disconnect();
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
    try {
      const url = await scan();
      const parsedQrCode = parseQrCodeData(url);

      if (parsedQrCode.domain === DomainType.MontenegroFiscalCheck) {
        const businessInfo = await getBusinessInfoById(parsedQrCode.payload.businessId);
        await updateUserBalance();
        navigation.navigate('TxScreen', {
          parsedReceipt: parsedQrCode.payload,
          businessInfo,
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
    <View style={styles.NavigationWrapper}>
      <ButtonNavigationDefault
        onPress={navigationMyBusiness}
        isActive={path === 'home'}
        children={path === 'home' ? <SvgComponentHomeActive /> : <SvgComponentHomeDefault />}
      />
      <ButtonNavigationDefault
        onPress={navigationHowUse}
        isActive={path === 'help'}
        children={path === 'help' ? <SvgComponentHowActive /> : <SvgComponentHowDefault />}
      />
      <TouchableHighlight
        style={styles.scanButton}
        underlayColor="transparent"
        activeOpacity={0.5}
        onPress={handleGmsScanPress}>
        {/* <SvgComponentScan style={styles.scanButtonImg} /> */}
        <Image style={styles.scanButtonImg} source={require('../assets/CircularButton.png')} />
      </TouchableHighlight>
      <ButtonNavigationDefault
        onPress={navigationUserHistory}
        isActive={path === 'user'}
        children={path === 'user' ? <SvgComponentUserActive /> : <SvgComponentUserDefault />}
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
    paddingStart: Platform.OS === 'ios' || Platform.OS === 'web' ? 21 : 11,
    paddingEnd: 21,
    // paddingBottom: Platform.OS === 'ios' || Platform.OS === 'web' ? 10 : 0,
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
  scanButtonImg: {
    marginTop: '5%',
    zIndex: 20,
    alignSelf: 'center',
    // marginLeft:'auto',
    // marginRight:'auto',
    width: 70,
    height: 70,
  },
});

export default Navigation;
