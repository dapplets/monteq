import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

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

  return (
    <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onRequestClose}>
      <View style={styles.centeredViewShareModal}>
        <View style={styles.modalViewShareModal}>
          <QRCode getRef={ref as any} size={200} value={qrCodeUrl} />

          {username ? (
            <Text {...props} style={styles.nameShareModal}>
              {username}
            </Text>
          ) : null}

          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.linearGradientShareModal}
            colors={['#0dd977', '#1da4ac', '#14c48c']}>
            <TouchableHighlight
              underlayColor="#1da4ac"
              activeOpacity={0.5}
              style={styles.primaryButtonShareModal}
              onPress={onRequestClose}>
              <Text style={styles.primaryButtonTextShareModal}>Close</Text>
            </TouchableHighlight>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredViewShareModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalViewShareModal: {
    width: 240,
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
  linearGradientShareModal: {
    display: 'flex',
    borderRadius: 50,
    width: 200,
    marginTop: 10,
  },
  primaryButtonShareModal: {
    backgroundColor: 'transparent',
    width: 200,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  primaryButtonTextShareModal: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,

    color: '#ffffff',
  },
  nameShareModal: {
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 23,
    textAlign: 'center',
    // todo: only web
    color: '#1da4ac',
    marginTop: 10,
  },
});

export default ShareModal;
