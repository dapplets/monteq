import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useWeb3Modal} from '@web3modal/react-native';
import * as React from 'react';
import {Button, Text, View} from 'react-native';
import {type RootStackParamList} from '../App';

const InfoScreen = () => {
  const {provider} = useWeb3Modal();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  function handleDisconnectPress() {
    provider?.disconnect();
  }

  async function handleScanPress() {
    navigation.navigate('CameraScreen');
  }

  return (
    <View>
      <Text>Logged in</Text>
      <Button onPress={handleDisconnectPress} title="Disconnect" />
      <Button onPress={handleScanPress} title="Scan" />
    </View>
  );
};

export default InfoScreen;
