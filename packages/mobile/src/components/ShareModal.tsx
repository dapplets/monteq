import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Modal,
} from "react-native";
import { FontFamily } from "../GlobalStyles";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";

// ToDo: move to business logic?
function makeShareUrl(to: string, user: string): string {
  let url = `https://monteq.dapplets.org/edcon2023/#/receive?to=${to}`;

  if (user) {
    url += `&user=${user}`;
  }

  return url;
}

type Props = {
  isVisible: boolean;
  account: string;
  username: string;
  onRequestClose?: () => void;
};

const ShareModal: React.FC<Props> = ({
  isVisible,
  account,
  username,
  onRequestClose,
  ...props
}) => {
  const qrCodeUrl = makeShareUrl(account, username);
  const ref = React.useRef();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(qrCodeUrl);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableHighlight
            underlayColor={"transparent"}
            activeOpacity={0.5}
            onPress={copyToClipboard}
            style={styles.Title}
          >
            <Text>Tap to copy</Text>
          </TouchableHighlight>
          <QRCode getRef={ref as any} size={200} value={qrCodeUrl} />

          {username ? (
            <LinearGradient
              style={styles.linearGradientText}
              colors={["#0dd977", "#1da4ac", "#14c48c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text {...props} style={[styles.name, { opacity: 0 }]}>
                {username}
              </Text>
            </LinearGradient>
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
              style={styles.primaryButton}
              onPress={onRequestClose}
            >
              <Text style={styles.primaryButtonText}>Close</Text>
            </TouchableHighlight>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: 240,
    margin: 0,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  Title: {
    fontFamily: FontFamily.robotoRegular,
    color: "#999999",
    marginBottom: 20,
    fontSize: 14,
    backgroundColor: "transparent",
  },
  linearGradient: {
    display: "flex",
    borderRadius: 50,
    width: 200,
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: "transparent",
    width: 200,
    height: 48,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 50,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 16,

    color: "#ffffff",
    fontFamily: FontFamily.robotoBold,
  },
  name: {
    fontFamily: FontFamily.robotoBold,
    fontSize: 20,
    lineHeight: 23,
    textAlign: "center",
  },
  linearGradientText: {
    display: "flex",

    justifyContent: "center",
    flexDirection: "row",
  },
  maskStyle: {
    marginTop: 10,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: 10,
  },
});

export default ShareModal;
