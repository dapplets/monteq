import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useWeb3Modal} from '@web3modal/react-native';
import * as React from 'react';
import {View, Alert, StyleSheet, TouchableHighlight, Image} from 'react-native';
import {type RootStackParamList} from '../App';
import BarcodeScannerModule from '../modules/BarcodeScannerModule';
import ButtonNavigationDefault from './ButtonNavigationDefault';

export type NavigationType = {
  path: string;
};
const Navigation = ({path}: NavigationType) => {
  const {provider} = useWeb3Modal();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  function handleDisconnectPress() {
    provider?.disconnect();
  }

  // async function handleScanPress() {
  //   navigation.navigate('CameraScreen');
  // }
  async function navigationUserHistory() {
    navigation.navigate('InfoScreen');
  }

  async function handleGmsScanPress() {
    if (!provider) {
      return;
    }

    try {
      const data = await BarcodeScannerModule.scan();
      navigation.navigate('TxScreen', {data});
    } catch (e) {
      // ToDo: catch CANCELED and FAILURE cases
      console.error(e);
      Alert.alert('Failure or canceled');
    }
  }

  return (
    <View style={styles.NavigationWrapper}>
      <ButtonNavigationDefault
        image={
          path === 'home'
            ? require('../assets/homeGreen.png')
            : require('../assets/busness.png')
        }
      />
      <ButtonNavigationDefault
        image={
          path === 'help'
            ? require('../assets/helpGreen.png')
            : require('../assets/helpcircle.png')
        }
      />
      {/* <Button onPress={handleScanPress} title="Scan via third-party lib" />
      <Button onPress={handleGmsScanPress} title="Scan via gms (preferred)" /> */}
      <TouchableHighlight
        style={styles.scanButton}
        underlayColor="#2261a5"
        onPress={handleGmsScanPress}>
        <Image
          style={styles.scanButtonImg}
          resizeMode="contain"
          source={require('../assets/scan.png')}
        />
      </TouchableHighlight>
      <ButtonNavigationDefault
        onPress={navigationUserHistory}
        image={
          path === 'user'
            ? require('../assets/userGreen.png')
            : require('../assets/user.png')
        }
      />
      <ButtonNavigationDefault
        onPress={handleDisconnectPress}
        image={require('../assets/logout.png')}
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
