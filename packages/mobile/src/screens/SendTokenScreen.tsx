import { RouteProp, NavigationProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { type RootStackParamList } from '../App';
import { FontFamily } from '../GlobalStyles';
import { ParsedEDCON2023Code } from '../common/parseReceipt';
import Navigation from '../components/Navigation';
import PaymentInfo from '../components/PaymentInfo';
import PaymentParameters from '../components/PaymentParameters';
import Title from '../components/TitlePage';
import TokenBlock from '../components/TokenBlock';
import TxModal, { TxStatusType } from '../components/TxModal';
import { useEdconContract } from '../contexts/EdconContractContext';
import { TokenId, TxStatus } from '../contexts/EdconContractContext/EdconContractContext';

type Props = {
  route: RouteProp<{ params: { parsedQrCode: ParsedEDCON2023Code } }, 'params'>;
};

const SendTokenScreen: React.FC<Props> = memo(({ route }) => {
  const { parsedQrCode } = route.params;

  const {
    myTokens,
    areMyTokensLoading,
    loadMyTokens,
    transferOrMint,
    transferOrMintTxStatus,
    resetTransferOrMintTxStatus,
    resetSetAmbassadorTxStatus,
    setAmbassadorTxStatus,
    setAmbassador,
  } = useEdconContract();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  const [modalVisible, setModalVisible] = useState(false);
  const [tokenAmountsMap, setTokenAmountsMap] = useState<{
    [tokenId: TokenId]: number;
  }>({});

  useEffect(() => {
    loadMyTokens();
  }, [isFocused, loadMyTokens, transferOrMintTxStatus, setAmbassadorTxStatus]);

  if (!parsedQrCode) {
    // ToDo: invalid receipt
    return null;
  }

  function handleIncrementTokenPress(tokenId: TokenId) {
    setTokenAmountsMap((map) => ({
      ...map,
      [`${tokenId}`]: (map[tokenId] ?? 0) + 1,
    }));
  }

  function handleLongPress(tokenId: TokenId) {
    setTokenAmountsMap((map) => ({ ...map, [tokenId]: 0 }));
  }

  function handleSendTokensPress() {
    setModalVisible(true);

    const tokensToTransfer = Object.entries(tokenAmountsMap).map(([tokenId, amount]) => ({
      tokenId: Number(tokenId),
      amount: Number(amount).toString(),
    }));

    transferOrMint(tokensToTransfer, parsedQrCode.to);
  }

  async function handleCloseButtonPress() {
    resetTransferOrMintTxStatus();
    setModalVisible(false);
    setTokenAmountsMap({});
    resetTransferOrMintTxStatus();
    resetSetAmbassadorTxStatus();
    loadMyTokens();
    navigation.navigate('InfoScreen');
  }

  async function handleCloseError() {
    resetTransferOrMintTxStatus();
    resetSetAmbassadorTxStatus();
    setModalVisible(false);
  }

  function handleSetAnAmbassadorRank() {
    setModalVisible(true);
    const tokensToTransfer = Object.entries(tokenAmountsMap).map(([tokenId, amount]) => ({
      tokenId: Number(tokenId),
      amount,
    }));
    setAmbassador(parsedQrCode.to, tokensToTransfer[0].tokenId, +tokensToTransfer[0].amount);
  }

  // ToDo: memorize
  const parseSending = () => {
    if (Object.keys(tokenAmountsMap).length === 0) {
      return '0';
    } else {
      let amount = 0;
      for (const i of Object.values(tokenAmountsMap)) {
        amount += +i;
      }
      return amount.toString();
    }
  };

  // ToDo: memorize
  const isVisibleAmbassadorBtn = () => {
    let foundTokenId: string | null = null;

    for (const [tokenIdStr, amount] of Object.entries(tokenAmountsMap)) {
      if (amount > 0) {
        if (foundTokenId !== null) return false;
        foundTokenId = tokenIdStr;
      }
    }

    const token = myTokens.find((x) => x.tokenId.toString() === foundTokenId);
    return token?.isAmbassador === true;
  };

  return (
    <>
      <ScrollView style={styles.InfoScreenWrapperSendToken}>
        <Title label="Sending tokens" />
        <PaymentInfo isTokens price={parseSending()} title="You are sending" />

        {areMyTokensLoading ? <ActivityIndicator size="large" color="#919191" /> : null}

        <View style={styles.tokensBlock}>
          {myTokens.map((token) => (
            <TokenBlock
              status={
                transferOrMintTxStatus !== TxStatus.Idle || setAmbassadorTxStatus !== TxStatus.Idle
              }
              key={token.tokenId}
              children={
                <View style={styles.imgTokenWrapper}>
                  {token.isAmbassador ? (
                    <Image
                      style={styles.imgStar}
                      resizeMode="contain"
                      source={require('../assets/star.png')}
                    />
                  ) : null}
                  <Image
                    style={styles.img}
                    resizeMode="contain"
                    source={{ uri: `${token.iconUrl}` }}
                  />
                  {tokenAmountsMap && tokenAmountsMap[`${token.tokenId}`] ? (
                    <View style={styles.counter}>
                      <Text style={styles.textCounter}>{tokenAmountsMap[`${token.tokenId}`]}</Text>
                    </View>
                  ) : null}
                </View>
              }
              title={`${token.balance}`}
              onPress={() => handleIncrementTokenPress(token.tokenId)}
              onLongPress={() => handleLongPress(token.tokenId)}
            />
          ))}
        </View>

        {parsedQrCode.user ? (
          <View style={styles.PayInfo}>
            <PaymentParameters parameters="Recipient" value={parsedQrCode.user} />
          </View>
        ) : null}

        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linearGradient}
          colors={['#0dd977', '#1da4ac', '#14c48c']}>
          <TouchableHighlight
            underlayColor="#1da4ac"
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
        {isVisibleAmbassadorBtn() && (
          <TouchableHighlight
            underlayColor="transparent"
            activeOpacity={0.5}
            style={styles.buttonSendAmbassador}
            onPress={handleSetAnAmbassadorRank}>
            <Text style={styles.buttonTextAmbassador}>Set an ambassador rank</Text>
          </TouchableHighlight>
        )}
      </ScrollView>

      {!modalVisible ? <Navigation path="Payment" /> : null}

      {transferOrMintTxStatus === TxStatus.Sending || setAmbassadorTxStatus === TxStatus.Sending ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction signing"
          status="Signing"
          type={TxStatusType.Yellow}
          image={require('../assets/inProgress.png')}
          recipientId={parsedQrCode.user!}
          // date={new Date(parsedQrCode.createdAt).toLocaleString()}
          // fiatAmount={parsedQrCode.currencyReceipt}
          onRequestClose={() => setModalVisible(!modalVisible)}
        />
      ) : null}

      {transferOrMintTxStatus === TxStatus.Mining || setAmbassadorTxStatus === TxStatus.Mining ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction sent"
          status="Mining"
          type={TxStatusType.Yellow}
          image={require('../assets/inProgress.png')}
          recipientId={parsedQrCode.user!}
          // date={new Date(parsedQrCode.createdAt).toLocaleString()}
          // fiatAmount={parsedQrCode.currencyReceipt}
          onRequestClose={() => setModalVisible(!modalVisible)}
        />
      ) : null}

      {transferOrMintTxStatus === TxStatus.Done || setAmbassadorTxStatus === TxStatus.Done ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction sent"
          status="Confirmed"
          type={TxStatusType.Green}
          image={require('../assets/confirmed.png')}
          recipientId={parsedQrCode.user!}
          // date={new Date(parsedQrCode.createdAt).toLocaleString()}
          // fiatAmount={parsedQrCode.currencyReceipt}
          onRequestClose={() => setModalVisible(!modalVisible)}
          primaryButton="Close"
          onPrimaryButtonPress={() => handleCloseButtonPress()}
        />
      ) : null}

      {transferOrMintTxStatus === TxStatus.Rejected ||
      transferOrMintTxStatus === TxStatus.Failed ||
      setAmbassadorTxStatus === TxStatus.Failed ||
      setAmbassadorTxStatus === TxStatus.Rejected ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction rejected"
          description="You have rejected the transaction in the wallet"
          image={require('../assets/errorOccured.png')}
          onRequestClose={() => setModalVisible(!modalVisible)}
          secondaryButton="Close"
          onSecondaryButtonPress={() => handleCloseError()}
        />
      ) : null}
    </>
  );
});

const styles = StyleSheet.create({
  InfoScreenWrapperSendToken: {
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
    marginBottom: 10,
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
  imgStar: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: -5,
    zIndex: 100,
  },
});

export default SendTokenScreen;
