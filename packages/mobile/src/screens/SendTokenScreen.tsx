import {
  RouteProp,
  NavigationProp,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import {useWeb3Modal} from '@web3modal/react-native';
import React, {memo, useEffect, useState} from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import PaymentInfo from '../components/PaymentInfo';
import LinearGradient from 'react-native-linear-gradient';
import PaymentParameters from '../components/PaymentParameters';
import Checkbox from '../components/Checkbox';
import {type RootStackParamList} from '../App';
import {ParsedReceipt} from '../common/parseReceipt';
import {useMonteqContract} from '../contexts/MonteqContractContext';
import {
  BASE_CRYPTO_CURRENCY,
  BASE_CRYPTO_MAX_DIGITS,
  BASE_FIAT_CURRENCY,
} from '../common/constants';
import SwitchBlock from '../components/SwitchBlock';
import {addStr, gteStr, mulStr, truncate} from '../common/helpers';
import TxModal, {TxStatusType} from '../components/TxModal';
import {
  BusinessInfo,
  TxStatus,
} from '../contexts/MonteqContractContext/MonteqContractContext';
import {FontFamily} from '../GlobalStyles';
import GeneralPayInfo from '../components/GeneralPayInfo';

type Props = {
  route: RouteProp<
    {params: {parsedReceipt: ParsedReceipt; businessInfo: BusinessInfo}},
    'params'
  >;
};

enum PaymentType {
  TIPS_ONLY,
  BILL_ONLY,
  BILL_AND_TIPS,
}
const testTokens = [{}];

const SendTokenScreen: React.FC<Props> = memo(({route}) => {
  const parsedReceipt = route.params.parsedReceipt;
  const businessInfo = route.params.businessInfo;

  const {provider} = useWeb3Modal();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  const [paymentType, setPaymentType] = useState<PaymentType>(
    PaymentType.TIPS_ONLY,
  );
  const [modalVisible, setModalVisible] = useState(false);

  const {
    balance,
    isBalanceLoading,
    payReceipt,
    paymentTxStatus,
    rate,
    resetPaymentTxStatus,
  } = useMonteqContract();

  useEffect(() => {
    resetPaymentTxStatus();
  }, [isFocused, resetPaymentTxStatus]);

  if (!parsedReceipt) {
    // ToDo: invalid receipt
    return null;
  }

  async function handleCloseButtonPress() {
    navigation.navigate('InfoScreen');
  }

  // ToDo: move the calculations into business logic hook
  const billAmountInCrypto =
    paymentType === PaymentType.BILL_ONLY ||
    paymentType === PaymentType.BILL_AND_TIPS
      ? mulStr(parsedReceipt.currencyReceipt, rate)
      : '0';

  const tipsAmountInCrypto =
    paymentType === PaymentType.TIPS_ONLY ||
    paymentType === PaymentType.BILL_AND_TIPS
      ? mulStr(mulStr(parsedReceipt.currencyReceipt, '0.1'), rate) // ToDo: 10% tips hardcoded
      : '0';

  const amountInCrypto = addStr(billAmountInCrypto, tipsAmountInCrypto);
  const isEnoughTokens = gteStr(balance, amountInCrypto);

  async function handleSendPress() {
    if (!provider || !parsedReceipt) {
      return;
    }

    setModalVisible(true);

    payReceipt(
      parsedReceipt.businessId,
      parsedReceipt.currencyReceipt,
      billAmountInCrypto,
      tipsAmountInCrypto,
    );
  }

  return (
    <>
      <ScrollView>
        <Title label="Sending tokens" />
        <GeneralPayInfo
          generalPayAmount={'12'}
          title={'Your are sending'}
          generalPayAmountSubtitle={'ABC'}
        />
        <View>
          <PaymentParameters parameters={'User'} value={'@SomeUsername'} />
        </View>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.linearGradient}
          colors={['#0dd977', '#1da4ac', '#14c48c']}>
          <TouchableHighlight
            underlayColor={'#1da4ac'}
            activeOpacity={0.5}
            style={styles.buttonSend}>
            <Text style={styles.buttonText}>Send tokens</Text>
          </TouchableHighlight>
        </LinearGradient>
      </ScrollView>

      {!modalVisible ? <Navigation path="Payment" /> : null}

      {paymentTxStatus === TxStatus.Sending ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction signing"
          status={'Signing'}
          type={TxStatusType.Yellow}
          image={require('../assets/inProgress.png')}
          recipientId={parsedReceipt.businessId}
          recipientName={businessInfo.name}
          date={new Date(parsedReceipt.createdAt).toLocaleString()}
          fiatAmount={parsedReceipt.currencyReceipt}
          cryptoAmount={amountInCrypto}
          onRequestClose={() => setModalVisible(!modalVisible)}
        />
      ) : null}

      {paymentTxStatus === TxStatus.Mining ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction sent"
          status={'Mining'}
          type={TxStatusType.Yellow}
          image={require('../assets/inProgress.png')}
          recipientId={parsedReceipt.businessId}
          recipientName={businessInfo.name}
          date={new Date(parsedReceipt.createdAt).toLocaleString()}
          fiatAmount={parsedReceipt.currencyReceipt}
          cryptoAmount={amountInCrypto}
          onRequestClose={() => setModalVisible(!modalVisible)}
        />
      ) : null}

      {paymentTxStatus === TxStatus.Done ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction sent"
          status={'Confirmed'}
          type={TxStatusType.Green}
          image={require('../assets/confirmed.png')}
          recipientId={parsedReceipt.businessId}
          recipientName={businessInfo.name}
          date={new Date(parsedReceipt.createdAt).toLocaleString()}
          fiatAmount={parsedReceipt.currencyReceipt}
          cryptoAmount={amountInCrypto}
          onRequestClose={() => setModalVisible(!modalVisible)}
          primaryButton="Close"
          onPrimaryButtonPress={handleCloseButtonPress}
        />
      ) : null}

      {paymentTxStatus === TxStatus.Rejected ||
      paymentTxStatus === TxStatus.Failed ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction rejected"
          description="You have rejected the transaction in the wallet"
          image={require('../assets/errorOccured.png')}
          onRequestClose={() => setModalVisible(!modalVisible)}
          primaryButton="Retry"
          onPrimaryButtonPress={handleSendPress}
          secondaryButton="Close"
          onSecondaryButtonPress={handleCloseButtonPress}
        />
      ) : null}
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
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
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
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  AvailableCurrency: {
    color: '#222222',
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    marginRight: 10,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  AvailableImg: {
    width: 20,
    height: 20,
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
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
  // ToDo: code duplicated in TxModal.tsx
  linearGradient: {
    display: 'flex',
    borderRadius: 50,
    width: '100%',
  },
  // ToDo: code duplicated in TxModal.tsx
  buttonSend: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  // ToDo: code duplicated in TxModal.tsx
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  buttonInsufficient: {
    backgroundColor: '#FF3E3E',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  buttonInsufficientText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    textDecorationLine: 'underline',
    textDecorationColor: '#fff',
    textDecorationStyle: 'solid',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
});

export default SendTokenScreen;
