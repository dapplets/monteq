import React from 'react';
import { StyleSheet, TouchableHighlight, View, Modal, Image } from 'react-native';
// import QRCode from 'react-native-qrcode-svg';

type Props = {
  isVisible: boolean;
  children: any;
  onRequestClose?: () => void;
};

const CameraModal: React.FC<Props> = ({ isVisible, children, onRequestClose, ...props }) => {
  return (
    <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onRequestClose}>
      <View style={styles.modalView}>
        <View style={styles.centeredViewShareModal}>
          <View style={styles.modalViewShareModal}>{children}</View>

          <TouchableHighlight
            underlayColor="#1da4ac"
            activeOpacity={0.5}
            style={styles.primaryButtonShareModal}
            onPress={onRequestClose}>
            <Image
              style={styles.primaryButtonModalImg}
              resizeMode="contain"
              source={require('../assets/arrow_camera_modal.png')}
            />
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
  },

  centeredViewShareModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalViewShareModal: {
    width: 260,
    // minHeight: 350,
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

  primaryButtonShareModal: {
    backgroundColor: '#fff',
    opacity: 0.5,
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 30,
    marginTop: 40,
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
  primaryButtonModalImg: {
    width: 24,
    height: 24,
  },
});

export default CameraModal;
