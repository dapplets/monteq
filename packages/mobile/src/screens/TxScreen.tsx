import { RouteProp, NavigationProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { type RootStackParamList } from '../App';
import { FontFamily } from '../GlobalStyles';
import {
  BASE_CRYPTO_CURRENCY,
  BASE_CRYPTO_MAX_DIGITS,
  BASE_FIAT_CURRENCY,
} from '../common/constants';
import { addStr, gteStr, mulStr, truncate } from '../common/helpers';
import { ParsedReceipt } from '../common/parseReceipt';
import Checkbox from '../components/Checkbox';
import Navigation from '../components/Navigation';
import PaymentInfo from '../components/PaymentInfo';
import PaymentParameters from '../components/PaymentParameters';
import SwitchBlock from '../components/SwitchBlock';
import Title from '../components/TitlePage';
import TxModal, { TxStatusType } from '../components/TxModal';
import { useMonteqContract } from '../contexts/MonteqContractContext';
import { BusinessInfo, TxStatus } from '../contexts/MonteqContractContext/MonteqContractContext';
import TxStatusModal from '../components/TxStatusModal';

type Props = {
  route: RouteProp<
    { params: { parsedReceipt: ParsedReceipt; businessInfo: BusinessInfo } },
    'params'
  >;
};

enum PaymentType {
  TIPS_ONLY,
  BILL_ONLY,
  BILL_AND_TIPS,
}

const TxScreen: React.FC<Props> = memo(({ route }) => {
  const parsedReceipt = route.params.parsedReceipt;
  const businessInfo = route.params.businessInfo;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.TIPS_ONLY);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    balance,
    isBalanceLoading,
    payReceipt,
    paymentTxStatus,
    paymentTxError,
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
    paymentType === PaymentType.BILL_ONLY || paymentType === PaymentType.BILL_AND_TIPS
      ? mulStr(parsedReceipt.currencyReceipt, rate)
      : '0';

  const tipsAmountInCrypto =
    paymentType === PaymentType.TIPS_ONLY || paymentType === PaymentType.BILL_AND_TIPS
      ? mulStr(mulStr(parsedReceipt.currencyReceipt, '0.1'), rate) // ToDo: 10% tips hardcoded
      : '0';

  const amountInCrypto = addStr(billAmountInCrypto, tipsAmountInCrypto);
  const isEnoughTokens = gteStr(balance, amountInCrypto);

  async function handleSendPress() {
    if (!parsedReceipt) {
      return;
    }

    setModalVisible(true);

    payReceipt(
      parsedReceipt.businessId,
      parsedReceipt.currencyReceipt,
      billAmountInCrypto,
      tipsAmountInCrypto
    );
  }

  return (
    <>
      {paymentType === PaymentType.TIPS_ONLY ? (
        <View style={styles.infoScreenWrapperTxScreen}>
          <Title label="Check your payment" />
          <View style={styles.availableWrapperTxScreen}>
            <Text style={styles.availableTitleTxScreen}>Available</Text>
            <View style={styles.availableBlockTxScreen}>
              <Text style={styles.availableAmountTxScreen}>
                {isBalanceLoading ? '-' : truncate(balance, BASE_CRYPTO_MAX_DIGITS)}
              </Text>
              <Text style={styles.availableCurrencyTxScreen}>{BASE_CRYPTO_CURRENCY}</Text>
              {/* 
              // ToDo: implement hide balance
              <Image
                style={styles.AvailableImg}
                source={require('../assets/eye.png')}
              /> */}
            </View>
          </View>
          <PaymentInfo
            price={truncate(amountInCrypto, BASE_CRYPTO_MAX_DIGITS)}
            title="You are paying tips"
            convert={{
              convertEUR: '1 ' + BASE_FIAT_CURRENCY,
              convertCurrency: truncate(rate, BASE_CRYPTO_MAX_DIGITS) + ' ' + BASE_CRYPTO_CURRENCY,
            }}
          />

          {isEnoughTokens ? (
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linearGradientTxScreen}
              colors={['#7f0dd9', '#5951c0', '#7f0dd9']}>
              <TouchableHighlight
                underlayColor="#5951c0"
                activeOpacity={0.5}
                style={styles.buttonSendTxScreen}
                onPress={handleSendPress}>
                <Text style={styles.buttonTextTxScreen}>Send Tips</Text>
              </TouchableHighlight>
            </LinearGradient>
          ) : (
            <TouchableHighlight disabled style={styles.buttonInsufficientTxScreen}>
              <Text style={styles.buttonInsufficientTextTxScreen}>Insufficient funds</Text>
            </TouchableHighlight>
          )}

          <View style={styles.payInfoTxScreen}>
            <View style={styles.payInfoTitleTxScreen}>
              <Text style={styles.payInfoTitleTextTxScreen}>I’ve got the consent to pay in crypto</Text>
              <Checkbox
                isChecked={false}
                onPress={() => setPaymentType(PaymentType.BILL_AND_TIPS)}
              />
            </View>
            <PaymentParameters
              parameters="Date"
              value={new Date(parsedReceipt.createdAt).toLocaleString()}
            />
            <PaymentParameters parameters="Recipient ID" value={parsedReceipt.businessId} />
            {businessInfo.name && (
              <PaymentParameters parameters="Recipient Name" value={businessInfo.name} />
            )}
            <PaymentParameters
              parameters="Invoice total"
              value={`${parsedReceipt.currencyReceipt} ${BASE_FIAT_CURRENCY}`}
            />
          </View>
        </View>
      ) : (
        <View style={styles.infoScreenWrapperTxScreen}>
          <Title label="Check your payment" />
          <View style={styles.availableWrapperTxScreen}>
            <Text style={styles.availableTitleTxScreen}>Available</Text>
            <View style={styles.availableBlockTxScreen}>
              <Text style={styles.availableAmountTxScreen}>
                {isBalanceLoading ? '-' : truncate(balance, BASE_CRYPTO_MAX_DIGITS)}
              </Text>
              <Text style={styles.availableCurrencyTxScreen}>{BASE_CRYPTO_CURRENCY}</Text>

              {/* <Image
              // ToDo: implement hide balance
                style={styles.AvailableImg}
                source={require('../assets/eye.png')}
              /> */}
            </View>
          </View>
          <PaymentInfo
            price={truncate(amountInCrypto, BASE_CRYPTO_MAX_DIGITS)}
            title="You are paying tips"
            convert={{
              convertEUR: '1 ' + BASE_FIAT_CURRENCY,
              convertCurrency: truncate(rate, BASE_CRYPTO_MAX_DIGITS) + ' ' + BASE_CRYPTO_CURRENCY,
            }}
          />

          {isEnoughTokens ? (
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linearGradientTxScreen}
              colors={['#0dd977', '#1da4ac', '#14c48c']}>
              <TouchableHighlight
                underlayColor="#1da4ac"
                activeOpacity={0.5}
                style={styles.buttonSendTxScreen}
                onPress={handleSendPress}>
                <Text style={styles.buttonTextTxScreen}>Pay invoice in full</Text>
              </TouchableHighlight>
            </LinearGradient>
          ) : (
            <TouchableHighlight disabled style={styles.buttonInsufficientTxScreen}>
              <Text style={styles.buttonInsufficientTextTxScreen}>Insufficient funds</Text>
            </TouchableHighlight>
          )}

          <View style={styles.payInfoTxScreen}>
            <View style={styles.payInfoTitleTxScreen}>
              <Text style={styles.payInfoTitleTextTxScreen}>I’ve got the consent to pay in crypto</Text>
              <Checkbox isChecked onPress={() => setPaymentType(PaymentType.TIPS_ONLY)} />
            </View>
            <SwitchBlock
              parameters="Add 10% tips to this invoice"
              onPress={() =>
                setPaymentType(
                  paymentType === PaymentType.BILL_AND_TIPS
                    ? PaymentType.BILL_ONLY
                    : PaymentType.BILL_AND_TIPS
                )
              }
              isPress={paymentType !== PaymentType.BILL_ONLY}
            />
            <PaymentParameters
              parameters="Date"
              value={new Date(parsedReceipt.createdAt).toLocaleString()}
            />
            <PaymentParameters parameters="Recipient ID" value={parsedReceipt.businessId} />
            {businessInfo.name && (
              <PaymentParameters parameters="Recipient Name" value={businessInfo.name} />
            )}
            <PaymentParameters
              parameters="Invoice total"
              value={`${parsedReceipt.currencyReceipt} ${BASE_FIAT_CURRENCY}`}
            />
          </View>
        </View>
      )}

      {!modalVisible ? <Navigation path="Payment" /> : null}

      <TxStatusModal
        isVisible={modalVisible}
        recipientId={parsedReceipt.businessId}
        recipientName={businessInfo.name}
        date={new Date(parsedReceipt.createdAt).toLocaleString()}
        fiatAmount={parsedReceipt.currencyReceipt}
        cryptoAmount={amountInCrypto}
        onClose={handleCloseButtonPress}
        onRetry={handleSendPress}
        error={paymentTxError}
        txStatus={paymentTxStatus}
      />
    </>
  );
});

const styles = StyleSheet.create({
  infoScreenWrapperTxScreen: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: 2,
  },
  availableWrapperTxScreen: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F6F7F8',
    borderRadius: 6,
    padding: 10,
  },
  availableTitleTxScreen: {
    color: '#222222',
    fontSize: 14,
    lineHeight: 17,
    width: '60%',
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
  availableBlockTxScreen: {
    display: 'flex',
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  availableAmountTxScreen: {
    color: '#222222',
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    marginRight: 5,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  availableCurrencyTxScreen: {
    color: '#222222',
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    marginRight: 10,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  availableImgTxScreen: {
    width: 20,
    height: 20,
  },
  payInfoTxScreen: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: 10,
    backgroundColor: '#F6F7F8',
    borderRadius: 10,
    marginTop: 10,
  },
  payInfoTitleTxScreen: {
    display: 'flex',
    flexDirection: 'row',

    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  payInfoTitleTextTxScreen: {
    color: '#222222',
    fontSize: 14,
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
  // ToDo: code duplicated in TxModal.tsx
  linearGradientTxScreen: {
    display: 'flex',
    borderRadius: 50,
    width: '100%',
  },
  // ToDo: code duplicated in TxModal.tsx
  buttonSendTxScreen: {
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
  buttonTextTxScreen: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  buttonInsufficientTxScreen: {
    backgroundColor: '#FF3E3E',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  buttonInsufficientTextTxScreen: {
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

export default TxScreen;
