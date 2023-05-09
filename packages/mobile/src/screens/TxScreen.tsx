import {
  RouteProp,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {useWeb3Modal} from '@web3modal/react-native';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Modal,
  Alert,
} from 'react-native';
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
import SwitchBlock from '../components/SwitchBlock';
import {TxStatus} from '../contexts/MonteqContractContext/MonteqContractContext';

type Props = {
  route: RouteProp<{params: {url: string}}, 'params'>;
};

const TxScreen: React.FC<Props> = memo(({route}) => {
  const parsedReceipt = parseReceipt(route.params.url);

  const {provider} = useWeb3Modal();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [currencyAmount, setCurrencyAmount] = useState(
    parsedReceipt?.currencyReceipt ?? '0',
  );
  const [crypto, setCrypto] = useState(false);
  const [isTips, setTips] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {payReceipt, paymentTxStatus} = useMonteqContract();

  useEffect(() => {
    if (!parsedReceipt) {
      navigation.goBack();
    } else {
      setCurrencyAmount('0.01');
    }
  }, [parsedReceipt, navigation, paymentTxStatus]);

  async function navigationUserHistory() {
    navigation.navigate('InfoScreen');
  }

  async function handleSendPress() {
    if (!provider || !parsedReceipt) {
      return;
    }

    setModalVisible(true);
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
  console.log(paymentTxStatus);
  return (
    <>
      {!crypto ? (
        <View style={styles.InfoScreenWrapper}>
          <Title label="Check your payment" />
          <View style={styles.AvailableWrapper}>
            <Text style={styles.AvailableTitle}>Available</Text>
            <View style={styles.AvailableBlock}>
              <Text style={styles.AvailableAmount}>{currencyAmount}</Text>
              <Text style={styles.AvailableCurrency}>
                {BASE_CRYPTO_CURRENCY}
              </Text>
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
      ) : (
        <View style={styles.InfoScreenWrapper}>
          <Title label="Check your payment" />
          <View style={styles.AvailableWrapper}>
            <Text style={styles.AvailableTitle}>Available</Text>
            <View style={styles.AvailableBlock}>
              <Text style={styles.AvailableAmount}>{currencyAmount}</Text>
              <Text style={styles.AvailableCurrency}>
                {BASE_CRYPTO_CURRENCY}
              </Text>
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
            colors={['#0dd977', '#1da4ac', '#14c48c']}>
            <TouchableHighlight
              style={styles.buttonSend}
              onPress={handleSendPress}>
              <Text style={styles.buttonText}>Pay invoice in full</Text>
            </TouchableHighlight>
          </LinearGradient>
          <View style={styles.PayInfo}>
            <View style={styles.PayInfoTitle}>
              <Text style={styles.PayInfoTitleText}>
                I’ve got the consent to pay in crypto
              </Text>
              <Checkbox isChecked={crypto} onPress={() => setCrypto(!crypto)} />
            </View>
            <SwitchBlock
              parameters={'Add 10% tips to this invoice'}
              onPress={setTips}
              isPress={isTips}
            />
            <PaymentParameters parameters={'Date'} value={'26/04/2023 11:13'} />
            <PaymentParameters
              parameters={'Recipient'}
              value={parsedReceipt.businessId}
            />
          </View>
        </View>
      )}
      {!modalVisible ? <Navigation path="Payment" /> : null}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Title label="Transaction sent" />
            {paymentTxStatus === TxStatus.Done ? (
              <Image
                resizeMode="contain"
                style={styles.TransactionImg}
                source={require('../assets/confirmed.png')}
              />
            ) : paymentTxStatus === TxStatus.Sending ||
              paymentTxStatus === TxStatus.Mining ? (
              <Image
                resizeMode="contain"
                style={styles.TransactionImg}
                source={require('../assets/inProgress.png')}
              />
            ) : (
              <Text>ToDo: rejected</Text>
            )}

            <View style={styles.StatusBlock}>
              <Text style={styles.ParametersStatus}>Status</Text>
              {paymentTxStatus === TxStatus.Done ? (
                <View style={styles.ValueStatus}>
                  <Text style={styles.ValueStatusTextOk}>Confirmed</Text>
                  <View style={styles.ValueStatusLabelOk}></View>
                </View>
              ) : paymentTxStatus === TxStatus.Sending ||
                paymentTxStatus === TxStatus.Mining ? (
                <View style={styles.ValueStatus}>
                  <Text style={styles.ValueStatusText}>In progress</Text>
                  <View style={styles.ValueStatusLabel}></View>
                </View>
              ) : (
                <Text>ToDo: rejected</Text>
              )}
            </View>

            <PaymentParameters
              isGray
              parameters={'Recipient'}
              value={parsedReceipt.businessId}
            />
            <PaymentParameters
              isGray
              parameters={'Amount, fiat'}
              value={'3,80 EUR'}
            />
            <PaymentParameters
              isGray
              parameters={'Amount, crypto'}
              value={currencyAmount + ' ' + BASE_CRYPTO_CURRENCY}
            />
            <PaymentParameters
              isGray
              parameters={'Date'}
              value={'26/04/2023 11:13'}
            />
            {/* {transactionStatusOk ? ( */}
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.linearGradient}
              colors={['#0dd977', '#1da4ac', '#14c48c']}>
              <TouchableHighlight
                style={styles.buttonSend}
                onPress={navigationUserHistory}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableHighlight>
            </LinearGradient>
            {/* ) : null} */}
          </View>
        </View>
      </Modal>
    </>
  );
});

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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '90%',
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  TransactionImg: {
    width: 140,
    height: 70,
    marginBottom: 10,
  },
  StatusBlock: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#F6F7F8',
    marginBottom: 10,
    borderRadius: 4,
  },
  ParametersStatus: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '400',
    color: '#222222',
    width: '50%',
  },
  ValueStatus: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '50%',
  },
  ValueStatusText: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    color: '#EBC200',
  },
  ValueStatusTextOk: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    color: '#14C58B',
  },
  ValueStatusLabel: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#EBC200',
    marginLeft: 10,
  },
  ValueStatusLabelOk: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#14C58B',
    marginLeft: 10,
  },
});

export default TxScreen;
