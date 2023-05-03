import {useWeb3Modal} from '@web3modal/react-native';
import * as React from 'react';
import {Button, Text, View} from 'react-native';

const InfoScreen = () => {
  const {provider} = useWeb3Modal();

  function handleDisconnectPress() {
    provider?.disconnect();
  }

  async function handleScanPress() {
    
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
