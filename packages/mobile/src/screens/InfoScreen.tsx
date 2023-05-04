import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useWeb3Modal} from '@web3modal/react-native';
import * as React from 'react';
import {Button, Text, View, Alert} from 'react-native';
import {type RootStackParamList} from '../App';
import BarcodeScannerModule from '../modules/BarcodeScannerModule';

const InfoScreen = () => {
  const {provider} = useWeb3Modal();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  function handleDisconnectPress() {
    provider?.disconnect();
  }

  async function handleScanPress() {
    navigation.navigate('CameraScreen');
  }

  async function handleGmsScanPress() {
    try {
      const data = await BarcodeScannerModule.scan();
      Alert.alert('Success', data);
    } catch (e) {
      // ToDo: catch CANCELED and FAILURE cases
      console.error(e);
      Alert.alert('Failure or canceled');
    }
  }

  return (
    <View>
      <Text>Logged in</Text>
      <Button onPress={handleDisconnectPress} title="Disconnect" />
      <Button onPress={handleScanPress} title="Scan via third-party lib" />
      <Button onPress={handleGmsScanPress} title="Scan via gms (preferred)" />
    </View>
  );
};

export default InfoScreen;
