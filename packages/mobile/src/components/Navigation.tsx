import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useWeb3Modal} from '@web3modal/react-native';
import * as React from 'react';
import {
  View,
  Alert,
  StyleSheet,
  TouchableHighlight,
  Platform,
} from 'react-native';
import {type RootStackParamList} from '../App';
import ButtonNavigationDefault from './ButtonNavigationDefault';
import {DomainType, parseQrCodeData} from '../common/parseReceipt';
import {useCamera} from '../contexts/CameraContext';
import SvgComponentUserActive from '../icons/SVGUserActive';
import SvgComponentUserDefault from '../icons/SVGUserDefault';
import SvgComponentExitDefault from '../icons/SVGExitDefault';
import SvgComponentHomeActive from '../icons/SVGHomeActive';
import SvgComponentHomeDefault from '../icons/SVGHomeDefault';
import SvgComponentHowActive from '../icons/SVGHowActive';
import SvgComponentHowDefault from '../icons/SVGHowDefault';
import {useMonteqContract} from '../contexts/MonteqContractContext';
import SvgComponentScan from '../icons/SVGScanBtn';

export type NavigationType = {
  path: string;
};

const Navigation = ({path}: NavigationType) => {
  const {provider} = useWeb3Modal();
  const {scan} = useCamera();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {getBusinessInfoById, updateUserBalance} = useMonteqContract();

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
      const parsedQrCode = parseQrCodeData(url);

      if (parsedQrCode.domain === DomainType.MontenegroFiscalCheck) {
        const businessInfo = await getBusinessInfoById(
          parsedQrCode.payload.businessId,
        );
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
        // @ts-ignore
        Alert.alert('Error', e.message);
      }
    }
  }

  return (
    <View style={styles.NavigationWrapper}>
      <ButtonNavigationDefault
        onPress={navigationMyBusiness}
        isActive={path === 'home' ? true : false}
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
        isActive={path === 'help' ? true : false}
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
        <SvgComponentScan style={styles.scanButtonImg} />
      </TouchableHighlight>
      <ButtonNavigationDefault
        onPress={navigationUserHistory}
        isActive={path === 'user' ? true : false}
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
    paddingStart: Platform.OS === 'ios' || Platform.OS === 'web' ? 21 : 11,
    paddingEnd: 21,
    // paddingBottom: Platform.OS === 'ios' || Platform.OS === 'web' ? 10 : 0,
    bottom: 0,
    left: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: Platform.OS === 'ios' || Platform.OS === 'web' ? 2 : -20,
      height: Platform.OS === 'ios' || Platform.OS === 'web' ? 2 : -20,
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
  },
  scanButtonImg: {
    marginTop: '5%',

    alignSelf: 'center',
  },
});

export default Navigation;
