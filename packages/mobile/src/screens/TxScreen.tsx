import {RouteProp} from '@react-navigation/native';
import {useWeb3Modal} from '@web3modal/react-native';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {ethers} from 'ethers';
import ERC20ABI from '../Erc20Abi.json';
import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import PaymentInfo from '../components/PaymentInfo';
import LinearGradient from 'react-native-linear-gradient';
import PaymentParameters from '../components/PaymentParameters';
import Checkbox from '../components/Checkbox';

type Props = {
  route: RouteProp<{params: {data: string}}, 'params'>;
};

const TxScreen: React.FC<Props> = ({route}) => {
  const {provider} = useWeb3Modal();
  const [currency, setCurrency] = useState('USDT');
  const [currencyAmount, setCurrencyAmount] = useState('11');
  const [crypto, setCrypto] = useState(false);
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
    <>
      <View style={styles.InfoScreenWrapper}>
        <Title label="Check your payment" />
        <View style={styles.AvailableWrapper}>
          <Text style={styles.AvailableTitle}>Available</Text>
          <View style={styles.AvailableBlock}>
            <Text style={styles.AvailableAmount}>{currencyAmount}</Text>
            <Text style={styles.AvailableCurrency}>{currency}</Text>
            <Image
              style={styles.AvailableImg}
              source={require('../assets/eye.png')}
            />
          </View>
        </View>
        <PaymentInfo
          price={'0.22'}
          title={'You are paying tips'}
          convert={{
            convertEUR: '1 eur',
            convertCurrensy: '1.2 usdt',
          }}
        />

        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.linearGradient}
          colors={['#7f0dd9', '#5951c0', '#7f0dd9']}>
          <TouchableHighlight
            style={styles.buttonSend}
            onPress={handleSendPress}>
            <Text style={styles.buttonText}>Send Tips</Text>
          </TouchableHighlight>
        </LinearGradient>
        <View style={styles.PayInfo}>
          <View style={styles.PayInfoTitle}>
            <Text style={styles.PayInfoTitleText}>
              I’ve got the consent to pay in crypto
            </Text>
            <Checkbox isChecked={crypto} onPress={() => setCrypto(!crypto)} />
          </View>
          <PaymentParameters parameters={'Date'} value={'26/04/2023 11:13'} />
          <PaymentParameters parameters={'Recipient'} value={'bv803pp980'} />
          <PaymentParameters parameters={'Invoice total'} value={'3,80 EUR'} />
        </View>
      </View>
      <Navigation path="Payment" />
    </>
  );
};
const styles = StyleSheet.create({
  InfoScreenWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: 2,
  },
  AvailableWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F6F7F8',
    borderRadius: 6,
    padding: 10,
  },
  AvailableTitle: {
    color: '#222222',
    fontSize: 14,
    lineHeight: 17,
    width: '60%',
    fontWeight: '400',
  },
  AvailableBlock: {
    display: 'flex',
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  AvailableAmount: {
    color: '#222222',
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    marginRight: 5,
  },
  AvailableCurrency: {
    color: '#222222',
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    marginRight: 10,
  },
  AvailableImg: {
    width: 20,
    height: 20,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    // textAlign: 'center',
    color: '#ffffff',
  },
  linearGradient: {
    display: 'flex',
    borderRadius: 50,
    width: '100%',
  },
  buttonSend: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  PayInfo: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: 10,
    backgroundColor: '#F6F7F8',
    borderRadius: 10,
    marginTop: 10,
  },
  PayInfoTitle: {
    display: 'flex',
    flexDirection: 'row',

    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  PayInfoTitleText: {
    color: '#222222',
    fontSize: 14,
    lineHeight: 16,
  },
});
export default TxScreen;
