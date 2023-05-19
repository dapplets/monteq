import {
  RouteProp,
  NavigationProp,
  useNavigation,
  useIsFocused,
} from "@react-navigation/native";
import React, { memo, useEffect, useState } from "react";
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
} from "react-native";
import Navigation from "../components/Navigation";
import Title from "../components/TitlePage";
import PaymentInfo from "../components/PaymentInfo";
import { LinearGradient } from "expo-linear-gradient";
import PaymentParameters from "../components/PaymentParameters";
import Checkbox from "../components/Checkbox";
import { type RootStackParamList } from "../App";
import { ParsedEDCON2023Code } from "../common/parseReceipt";
import { useMonteqContract } from "../contexts/MonteqContractContext";
import {
  BASE_CRYPTO_CURRENCY,
  BASE_CRYPTO_MAX_DIGITS,
  BASE_FIAT_CURRENCY,
} from "../common/constants";
import SwitchBlock from "../components/SwitchBlock";
import { addStr, gteStr, mulStr, truncate } from "../common/helpers";
import TxModal, { TxStatusType } from "../components/TxModal";

import { FontFamily } from "../GlobalStyles";
import GeneralPayInfo from "../components/GeneralPayInfo";
import { useEdconContract } from "../contexts/EdconContractContext";
import {
  ParsedUint,
  TokenId,
  TxStatus,
} from "../contexts/EdconContractContext/EdconContractContext";
import CompanyParameters from "../components/CompanyParameters";
import TokenBlock from "../components/TokenBlock";
import { useUserName } from "../hooks/useUserName";

type Props = {
  route: RouteProp<{ params: { parsedQrCode: ParsedEDCON2023Code } }, "params">;
};

const testTokens = [{}];

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
    ambassadorRank,
    setAmbassador,
    isAmbassadorStatus,
  } = useEdconContract();
  const { userName, changeUserName } = useUserName();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  const [modalVisible, setModalVisible] = useState(false);
  const [isVisibleAmbassadorBtn, setVisibleAmbassadorBtn] = useState(false);
  const [tokenAmountsMap, setTokenAmountsMap] = useState<{
    [tokenId: TokenId]: ParsedUint;
  }>({});

  useEffect(() => {
    loadMyTokens();
  }, [
    isFocused,
    loadMyTokens,
    transferOrMintTxStatus,
    setAmbassadorTxStatus,
    isVisibleAmbassadorBtn,
    tokenAmountsMap,
  ]);
  if (!parsedQrCode) {
    // ToDo: invalid receipt
    return null;
  }

  function handleIncrementTokenPress(tokenId: TokenId) {
    if (isVisibleAmbassadorBtn) {
      if (Object.keys(tokenAmountsMap).length === 1) {
        isAmbassadorStatus.map((x, i) => {
          if (x.tokenId === tokenId) {
            if (x.isAmbassador) {
              setVisibleAmbassadorBtn(true);
            } else {
              setVisibleAmbassadorBtn(false);
            }
          }
        });
      } else {
        setVisibleAmbassadorBtn(false);
      }
    } else {
      if (
        isAmbassadorStatus &&
        isAmbassadorStatus.length > 0 &&
        Object.keys(tokenAmountsMap).length === 0
      ) {
        isAmbassadorStatus.map((x, i) => {
          if (x.tokenId === tokenId)
            if (x.isAmbassador) {
              setVisibleAmbassadorBtn(true);
            } else {
              setVisibleAmbassadorBtn(false);
            }
        });
      }
    }

    setTokenAmountsMap((amount) => ({
      ...amount,
      [tokenId]: (amount[tokenId] ?? 0) + 1,
    }));
  }
  function handleLongPress(tokenId: TokenId) {
    delete tokenAmountsMap[`${tokenId}`];

    setTokenAmountsMap(tokenAmountsMap);
    loadMyTokens();
  }

  function handleSendTokensPress() {
    setModalVisible(true);
    const tokensToTransfer = Object.entries(tokenAmountsMap).map(
      ([tokenId, amount]) => ({
        tokenId: Number(tokenId),
        amount,
      })
    );

    transferOrMint(tokensToTransfer, parsedQrCode.to);
  }

  async function handleCloseButtonPress() {
    resetTransferOrMintTxStatus();
    navigation.navigate("InfoScreen");
  }

  async function handleCloseError() {
    resetTransferOrMintTxStatus();
    resetSetAmbassadorTxStatus();
    setModalVisible(false);
  }
  function handleSetAnAmbassadorRank() {
    setModalVisible(true);
    const tokensToTransfer = Object.entries(tokenAmountsMap).map(
      ([tokenId, amount]) => ({
        tokenId: Number(tokenId),
        amount,
      })
    );
    setAmbassador(
      parsedQrCode.to,
      tokensToTransfer[0].tokenId,
      +tokensToTransfer[0].amount
    );
  }
  const parseSending = () => {
    if (Object.keys(tokenAmountsMap).length === 0) {
      return "0";
    } else {
      let amount = 0;
      for (let i of Object.values(tokenAmountsMap)) {
        amount += +i;
      }
      return amount.toString();
    }
  };

  return (
    <>
      <ScrollView style={styles.InfoScreenWrapperSendToken}>
        <Title label={`Sending tokens`} />
        <PaymentInfo
          isTokens
          price={parseSending()}
          title={"Your are sending"}
        />

        <View>{areMyTokensLoading ? <Text>Loading</Text> : null}</View>
        <View style={styles.tokensBlock}>
          {myTokens.map((token) => (
            <TokenBlock
              key={token.tokenId}
              children={
                <View style={styles.imgTokenWrapper}>
                  {isAmbassadorStatus &&
                    isAmbassadorStatus.length > 0 &&
                    isAmbassadorStatus.map((x, i) => {
                      if (x.tokenId === token.tokenId && x.isAmbassador) {
                        return (
                          <Image
                            key={i}
                            style={styles.imgStar}
                            resizeMode="contain"
                            source={require("../assets/star.png")}
                          />
                        );
                      }
                    })}
                  <Image
                    style={styles.img}
                    resizeMode="contain"
                    source={{ uri: `${token.iconUrl}` }}
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
              onLongPress={() => handleLongPress(token.tokenId)}
            />
          ))}
        </View>

        {parsedQrCode.user ? (
          <View style={styles.PayInfo}>
            <PaymentParameters parameters={"User"} value={parsedQrCode.user} />
          </View>
        ) : null}

        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linearGradient}
          colors={["#0dd977", "#1da4ac", "#14c48c"]}
        >
          <TouchableHighlight
            underlayColor={"#1da4ac"}
            activeOpacity={0.5}
            onPress={handleSendTokensPress}
            disabled={transferOrMintTxStatus !== TxStatus.Idle}
            style={styles.buttonSend}
          >
            <>
              <Image
                style={styles.imgBtnSend}
                resizeMode="contain"
                source={require("../assets/ok.png")}
              />
              <Text style={styles.buttonText}>Send tokens</Text>
            </>
          </TouchableHighlight>
        </LinearGradient>
        {isVisibleAmbassadorBtn && (
          <TouchableHighlight
            underlayColor={"transparent"}
            activeOpacity={0.5}
            style={styles.buttonSendAmbassador}
            onPress={handleSetAnAmbassadorRank}
          >
            <Text style={styles.buttonTextAmbassador}>
              Set an ambassador rank
            </Text>
          </TouchableHighlight>
        )}
      </ScrollView>

      {!modalVisible ? <Navigation path="Payment" /> : null}

      {transferOrMintTxStatus === TxStatus.Sending ||
      setAmbassadorTxStatus === TxStatus.Sending ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction signing"
          status={"Signing"}
          type={TxStatusType.Yellow}
          image={require("../assets/inProgress.png")}
          recipientId={parsedQrCode.user!}
          // date={new Date(parsedQrCode.createdAt).toLocaleString()}
          // fiatAmount={parsedQrCode.currencyReceipt}
          onRequestClose={() => setModalVisible(!modalVisible)}
        />
      ) : null}

      {transferOrMintTxStatus === TxStatus.Mining ||
      setAmbassadorTxStatus === TxStatus.Mining ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction sent"
          status={"Mining"}
          type={TxStatusType.Yellow}
          image={require("../assets/inProgress.png")}
          recipientId={parsedQrCode.user!}
          // date={new Date(parsedQrCode.createdAt).toLocaleString()}
          // fiatAmount={parsedQrCode.currencyReceipt}
          onRequestClose={() => setModalVisible(!modalVisible)}
        />
      ) : null}

      {transferOrMintTxStatus === TxStatus.Done ||
      setAmbassadorTxStatus === TxStatus.Done ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction sent"
          status={"Confirmed"}
          type={TxStatusType.Green}
          image={require("../assets/confirmed.png")}
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
          image={require("../assets/errorOccured.png")}
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
    display: "flex",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: 2,
  },

  PayInfo: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: 10,
    backgroundColor: "#F6F7F8",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  // ToDo: code duplicated in TxModal.tsx
  linearGradient: {
    display: "flex",
    borderRadius: 50,
    width: "100%",
  },
  // ToDo: code duplicated in TxModal.tsx
  buttonSend: {
    backgroundColor: "transparent",
    width: "100%",
    height: 48,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 50,
  },
  // ToDo: code duplicated in TxModal.tsx
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 16,
    color: "#ffffff",
    fontFamily: Platform.OS === "ios" ? undefined : FontFamily.robotoBold,
  },

  imgBtnSend: {
    marginRight: 5,
  },
  buttonSendAmbassador: {
    display: "flex",
    borderRadius: 50,
    width: "100%",
    backgroundColor: "transparent",
    height: 48,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#14C58B",
    marginTop: 10,
  },
  buttonTextAmbassador: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 16,
    color: "#14C58B",
    fontFamily: Platform.OS === "ios" ? undefined : FontFamily.robotoBold,
  },
  tokensBlock: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  imgTokenWrapper: {
    display: "flex",
    width: 40,
    height: 40,
    borderRadius: 20,
    position: "relative",
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  counter: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    right: 0,
  },
  textCounter: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
    color: "#14C58B",
    fontFamily: Platform.OS === "ios" ? undefined : FontFamily.robotoBold,
  },
  imgStar: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: -5,
    zIndex: 100,
  },
});

export default SendTokenScreen;
