import {
  RouteProp,
  NavigationProp,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import {useWeb3Modal} from '@web3modal/react-native';
import React, {memo, useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  Image,
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
import {ParsedEDCON2023Code} from '../common/parseReceipt';
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
import {useEdconContract} from '../contexts/EdconContractContext';
import {
  ParsedUint,
  TokenId,
} from '../contexts/EdconContractContext/EdconContractContext';
import CompanyParameters from '../components/CompanyParameters';
import TokenBlock from '../components/TokenBlock';
import {useUserName} from '../hooks/useUserName';

type Props = {
  route: RouteProp<{params: {parsedQrCode: ParsedEDCON2023Code}}, 'params'>;
};

const testTokens = [{}];

const SendTokenScreen: React.FC<Props> = memo(({route}) => {
  const {parsedQrCode} = route.params;

  const {
    myTokens,
    areMyTokensLoading,
    loadMyTokens,
    transferOrMint,
    transferOrMintTxStatus,
    resetTransferOrMintTxStatus,
  } = useEdconContract();
  const {userName, changeUserName} = useUserName();
  const {provider} = useWeb3Modal();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  const [modalVisible, setModalVisible] = useState(false);
  const [tokenAmountsMap, setTokenAmountsMap] = useState<{
    [tokenId: TokenId]: ParsedUint;
  }>({});

  // const {
  //   balance,
  //   isBalanceLoading,
  //   payReceipt,
  //   paymentTxStatus,
  //   rate,
  //   resetPaymentTxStatus,
  // } = useMonteqContract();

  useEffect(() => {
    resetTransferOrMintTxStatus();
    loadMyTokens();
    parsedQrCode.user && userName.length === 0
      ? changeUserName(parsedQrCode.user)
      : changeUserName(userName);
  }, [isFocused, loadMyTokens, resetTransferOrMintTxStatus]);

  if (!parsedQrCode) {
    // ToDo: invalid receipt
    return null;
  }

  function handleIncrementTokenPress(tokenId: TokenId) {
    setTokenAmountsMap(amount => ({
      ...amount,
      [tokenId]: (amount[tokenId] ?? 0) + 1,
    }));
  }

  function handleSendTokensPress() {
    const tokensToTransfer = Object.entries(tokenAmountsMap).map(
      ([tokenId, amount]) => ({
        tokenId: Number(tokenId),
        amount,
      }),
    );

    transferOrMint(tokensToTransfer, parsedQrCode.to);
  }

  // async function handleCloseButtonPress() {
  //   navigation.navigate('InfoScreen');
  // }

  // async function handleSendPress() {
  //   if (!provider || !parsedQrCode) {
  //     return;
  //   }

  //   setModalVisible(true);

  //   // payReceipt(
  //   //   parsedQrCode.businessId,
  //   //   parsedQrCode.currencyReceipt,
  //   //   billAmountInCrypto,
  //   //   tipsAmountInCrypto,
  //   // );
  // }
  console.log(tokenAmountsMap);
  return (
    <>
      <ScrollView style={styles.InfoScreenWrapper}>
        <Title label={`Sending tokens`} />
        <Text>{`ToDo: send to ${parsedQrCode.to}`}</Text>
        <View>{areMyTokensLoading ? <Text>Loading</Text> : null}</View>

        <View style={styles.tokensBlock}>
          {myTokens.map(token => (
            <>
              <TokenBlock
                key={token.tokenId}
                //${token.ticker}: ${
                //   tokenAmountsMap[token.tokenId] ?? 0
                // }
                children={
                  <View style={styles.imgTokenWrapper}>
                    <Image
                      style={styles.img}
                      resizeMode="contain"
                      source={{uri: `${token.iconUrl}`}}
                    />
                    {tokenAmountsMap && tokenAmountsMap[`${token.tokenId}`] ? (
                      <View style={styles.counter}>
                        <Text style={styles.textCounter}>
                          {tokenAmountsMap[`${token.tokenId}`]}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                }
                title={`${token.balance}`}
                onPress={() => handleIncrementTokenPress(token.tokenId)}
              />
            </>
          ))}

          <Text>TxStatus: {transferOrMintTxStatus}</Text>
        </View>
        <PaymentInfo price={'12'} title={'Your are sending'} />

        {parsedQrCode.user ? (
          <View style={styles.PayInfo}>
            <PaymentParameters parameters={'User'} value={userName} />
          </View>
        ) : null}

        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.linearGradient}
          colors={['#0dd977', '#1da4ac', '#14c48c']}>
          <TouchableHighlight
            underlayColor={'#1da4ac'}
            activeOpacity={0.5}
            onPress={handleSendTokensPress}
            disabled={transferOrMintTxStatus !== TxStatus.Idle}
            style={styles.buttonSend}>
            <>
              <Image
                style={styles.imgBtnSend}
                resizeMode="contain"
                source={require('../assets/ok.png')}
              />
              <Text style={styles.buttonText}>Send tokens</Text>
            </>
          </TouchableHighlight>
        </LinearGradient>
        <TouchableHighlight
          underlayColor={'transparent'}
          activeOpacity={0.5}
          style={styles.buttonSendAmbassador}>
          <Text style={styles.buttonTextAmbassador}>
            Set an ambassador rank
          </Text>
        </TouchableHighlight>
      </ScrollView>

      {!modalVisible ? <Navigation path="Payment" /> : null}

      {/* {paymentTxStatus === TxStatus.Sending ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction signing"
          status={'Signing'}
          type={TxStatusType.Yellow}
          image={require('../assets/inProgress.png')}
          recipientId={parsedQrCode.businessId}
          recipientName={businessInfo.name}
          date={new Date(parsedQrCode.createdAt).toLocaleString()}
          fiatAmount={parsedQrCode.currencyReceipt}
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
          recipientId={parsedQrCode.businessId}
          recipientName={businessInfo.name}
          date={new Date(parsedQrCode.createdAt).toLocaleString()}
          fiatAmount={parsedQrCode.currencyReceipt}
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
          recipientId={parsedQrCode.businessId}
          recipientName={businessInfo.name}
          date={new Date(parsedQrCode.createdAt).toLocaleString()}
          fiatAmount={parsedQrCode.currencyReceipt}
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
      ) : null} */}
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

  PayInfo: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: 10,
    backgroundColor: '#F6F7F8',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
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

  imgBtnSend: {
    marginRight: 5,
  },
  buttonSendAmbassador: {
    display: 'flex',
    borderRadius: 50,
    width: '100%',
    backgroundColor: 'transparent',
    height: 48,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#14C58B',
    marginTop: 10,
  },
  buttonTextAmbassador: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    color: '#14C58B',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  tokensBlock: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imgTokenWrapper: {
    display: 'flex',
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'relative',
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  counter: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    right: 0,
  },
  textCounter: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
    color: '#14C58B',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
});

export default SendTokenScreen;
