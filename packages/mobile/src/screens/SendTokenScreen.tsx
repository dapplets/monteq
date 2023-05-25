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
import TxStatusModal from '../components/TxStatusModal';
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
    transferOrMintTxError,
    resetTransferOrMintTxStatus,
    resetSetAmbassadorTxStatus,
    setAmbassadorTxStatus,
    setAmbassadorTxError,
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
    // const token = myTokens.find((x) => x.tokenId.toString() === tokenId.toString());
    // if (!token) return;
    // if (Number(token.balance) <= tokenAmountsMap[tokenId]) return;

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

  function handleSetAnAmbassadorRank() {
    setModalVisible(true);
    const tokensToTransfer = Object.entries(tokenAmountsMap).map(([tokenId, amount]) => ({
      tokenId: Number(tokenId),
      amount,
    }));
    setAmbassador(parsedQrCode.to, tokensToTransfer[0].tokenId, +tokensToTransfer[0].amount);
  }

  // ToDo: memorize
  const totalAmount = () => {
    if (Object.keys(tokenAmountsMap).length === 0) {
      return 0;
    } else {
      let amount = 0;
      for (const i of Object.values(tokenAmountsMap)) {
        amount += +i;
      }
      return amount;
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

  const isSendTokensButtonDisabled =
    totalAmount() === 0 || transferOrMintTxStatus !== TxStatus.Idle;

  return (
    <>
      <ScrollView style={styles.infoScreenWrapperSendTokenSendTokenScreen}>
        <Title label="Sending tokens" />
        <PaymentInfo isTokens price={totalAmount().toString()} title="You are sending" />

        {areMyTokensLoading ? (
          <ActivityIndicator
            style={styles.tokensLoaderSendTokenScreen}
            size="large"
            color="#919191"
          />
        ) : (
          <View style={styles.tokensBlockSendTokenScreen}>
            {myTokens.map((token) => (
              <TokenBlock
                status={
                  transferOrMintTxStatus !== TxStatus.Idle ||
                  setAmbassadorTxStatus !== TxStatus.Idle
                }
                key={token.tokenId}
                children={
                  <View style={styles.imgTokenWrapperSendTokenScreen}>
                    {token.isAmbassador ? (
                      <Image
                        style={styles.imgStarSendTokenScreen}
                        resizeMode="contain"
                        source={require('../assets/star.png')}
                      />
                    ) : null}
                    <Image
                      style={styles.imgSendTokenScreen}
                      resizeMode="contain"
                      source={{ uri: `${token.iconUrl}` }}
                    />
                    {tokenAmountsMap && tokenAmountsMap[`${token.tokenId}`] ? (
                      <View style={styles.counterSendTokenScreen}>
                        <Text style={styles.textCounterSendTokenScreen}>
                          {tokenAmountsMap[`${token.tokenId}`]}
                        </Text>
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
        )}

        {parsedQrCode.user ? (
          <View style={styles.payInfoSendTokenScreen}>
            <PaymentParameters parameters="Recipient" value={parsedQrCode.user} />
          </View>
        ) : null}

        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={
            isSendTokensButtonDisabled
              ? [styles.linearGradientSendTokenScreen, styles.disabledOpacitySendTokenScreen]
              : [styles.linearGradientSendTokenScreen]
          }
          colors={['#0dd977', '#1da4ac', '#14c48c']}>
          <TouchableHighlight
            underlayColor="#1da4ac"
            activeOpacity={0.5}
            onPress={handleSendTokensPress}
            disabled={isSendTokensButtonDisabled}
            style={styles.buttonSendSendTokenScreen}>
            <>
              <Image
                style={styles.imgBtnSendSendTokenScreen}
                resizeMode="contain"
                source={require('../assets/ok.png')}
              />
              <Text style={styles.buttonTextSendTokenScreen}>Send tokens</Text>
            </>
          </TouchableHighlight>
        </LinearGradient>

        {isVisibleAmbassadorBtn() ? (
          <TouchableHighlight
            underlayColor="transparent"
            activeOpacity={0.5}
            style={styles.buttonSendAmbassadorSendTokenScreen}
            onPress={handleSetAnAmbassadorRank}>
            <Text style={styles.buttonTextAmbassadorSendTokenScreen}>Set an ambassador rank</Text>
          </TouchableHighlight>
        ) : null}
      </ScrollView>

      {/* {!modalVisible ? <Navigation path="Payment" /> : null} */}

      <TxStatusModal
        isVisible={modalVisible}
        recipientId={parsedQrCode.user!}
        onClose={handleCloseButtonPress}
        onRetry={handleSendTokensPress}
        error={transferOrMintTxError}
        txStatus={transferOrMintTxStatus}
      />

      <TxStatusModal
        isVisible={modalVisible}
        recipientId={parsedQrCode.user!}
        onClose={handleCloseButtonPress}
        onRetry={handleSetAnAmbassadorRank}
        error={setAmbassadorTxError}
        txStatus={setAmbassadorTxStatus}
      />
    </>
  );
});

const styles = StyleSheet.create({
  infoScreenWrapperSendTokenSendTokenScreen: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: 2,
  },

  payInfoSendTokenScreen: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: 10,
    backgroundColor: '#F6F7F8',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  linearGradientSendTokenScreen: {
    display: 'flex',
    borderRadius: 50,
    width: '100%',
  },
  disabledOpacitySendTokenScreen: {
    opacity: 0.6,
  },

  buttonSendSendTokenScreen: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },

  buttonTextSendTokenScreen: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },

  imgBtnSendSendTokenScreen: {
    marginRight: 5,
  },
  buttonSendAmbassadorSendTokenScreen: {
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
  buttonTextAmbassadorSendTokenScreen: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    color: '#14C58B',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  tokensBlockSendTokenScreen: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imgTokenWrapperSendTokenScreen: {
    display: 'flex',
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'relative',
  },
  imgSendTokenScreen: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  counterSendTokenScreen: {
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
  textCounterSendTokenScreen: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
    color: '#14C58B',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  imgStarSendTokenScreen: {
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
  tokensLoaderSendTokenScreen: {
    marginTop: 22,
    marginBottom: 22,
  },
});

export default SendTokenScreen;
