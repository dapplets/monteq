import {
  RouteProp,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {useWeb3Modal} from '@web3modal/react-native';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import PaymentInfo from '../components/PaymentInfo';
import LinearGradient from 'react-native-linear-gradient';
import PaymentParameters from '../components/PaymentParameters';
import Checkbox from '../components/Checkbox';
import {type RootStackParamList} from '../App';
import {parseReceipt} from '../common/parseReceipt';
import {useMonteqContract} from '../contexts/MonteqContractContext';
import {BASE_CRYPTO_CURRENCY, BASE_FIAT_CURRENCY} from '../common/constants';

type Props = {
  route: RouteProp<{params: {url: string}}, 'params'>;
};

const TxScreen: React.FC<Props> = ({route}) => {
  const parsedReceipt = parseReceipt(route.params.url);

  const {provider} = useWeb3Modal();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [currencyAmount, setCurrencyAmount] = useState(
    parsedReceipt?.currencyReceipt ?? '0',
  );
  const [crypto, setCrypto] = useState(false);

  const {payReceipt} = useMonteqContract();

  useEffect(() => {
    if (!parsedReceipt) {
      navigation.goBack();
    } else {
      setCurrencyAmount('0.01');
    }
  }, [parsedReceipt, navigation]);

  async function handleSendPress() {
    if (!provider || !parsedReceipt) {
      return;
    }

    const tokenAmount = '0.01';
    const tipsAmount = '0.005';

    payReceipt(
      parsedReceipt.businessId,
      parsedReceipt.currencyReceipt,
      tokenAmount,
      tipsAmount,
    );
  }

  if (!parsedReceipt) {
    return null;
  }

  return (
    <>
      <View style={styles.InfoScreenWrapper}>
        <Title label="Check your payment" />
        <View style={styles.AvailableWrapper}>
          <Text style={styles.AvailableTitle}>Available</Text>
          <View style={styles.AvailableBlock}>
            <Text style={styles.AvailableAmount}>{currencyAmount}</Text>
            <Text style={styles.AvailableCurrency}>{BASE_CRYPTO_CURRENCY}</Text>
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
            convertEUR: '1 ' + BASE_FIAT_CURRENCY,
            convertCurrency: '1.2 ' + BASE_CRYPTO_CURRENCY,
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
          <PaymentParameters
            parameters={'Recipient'}
            value={parsedReceipt.businessId}
          />
          <PaymentParameters
            parameters={'Invoice total'}
            value={`${parsedReceipt.currencyReceipt} ${BASE_FIAT_CURRENCY}`}
          />
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
