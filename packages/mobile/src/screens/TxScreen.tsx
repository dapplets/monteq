import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {useWeb3Modal} from '@web3modal/react-native';
import * as React from 'react';
import {Button, Text, View} from 'react-native';
import {ethers} from 'ethers';
import ERC20ABI from '../Erc20Abi.json';

type Props = {
  route: RouteProp<{params: {data: string}}, 'params'>;
};

const TxScreen: React.FC<Props> = ({route}) => {
  const {provider} = useWeb3Modal();

  function handleSendPress() {
    if (!provider) {
      return;
    }

    const web3Provider = new ethers.providers.Web3Provider(provider);
    const contract = new ethers.Contract(
      '0x6b175474e89094c44da98b954eedeac495271d0f',
      ERC20ABI,
      web3Provider.getSigner(),
    );

    contract.transfer('0x6b175474e89094c44da98b954eedeac495271d0f', '0');
  }

  return (
    <View>
      <Text>{route.params.data}</Text>
      <Button onPress={handleSendPress} title="Send transaction" />
    </View>
  );
};

export default TxScreen;
