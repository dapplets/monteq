import React from 'react';
import Title from '../components/TitlePage';
import PaymentParameters from '../components/PaymentParameters';
import LinearGradient from 'react-native-linear-gradient';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Modal,
  ImageSourcePropType,
} from 'react-native';
import {
  BASE_CRYPTO_CURRENCY,
  BASE_CRYPTO_MAX_DIGITS,
  BASE_FIAT_CURRENCY,
  BASE_FIAT_MAX_DIGITS,
} from '../common/constants';
import {truncate} from '../common/helpers';

export enum TxStatusType {
  Green,
  Yellow,
}

type Props = {
  title: string;
  status: string;
  type: TxStatusType;
  recipient?: string;
  date?: string;
  fiatAmount?: string;
  cryptoAmount?: string;
  image?: ImageSourcePropType;
  isVisible: boolean;
  onRequestClose: () => void;
  onClosePress?: () => void;
};

const TxModal: React.FC<Props> = ({
  title,
  status,
  type,
  image,
  recipient,
  date,
  fiatAmount,
  cryptoAmount,
  isVisible,
  onRequestClose,
  onClosePress,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onRequestClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Title label={title} />

          {image ? (
            <Image
              resizeMode="contain"
              style={styles.TransactionImg}
              source={image}
            />
          ) : null}

          <View style={styles.StatusBlock}>
            <Text style={styles.ParametersStatus}>Status</Text>

            <View style={styles.ValueStatus}>
              <Text
                style={
                  type === TxStatusType.Green
                    ? styles.ValueStatusTextOk
                    : styles.ValueStatusText
                }>
                {status}
              </Text>
              <View
                style={
                  type === TxStatusType.Green
                    ? styles.ValueStatusLabelOk
                    : styles.ValueStatusLabel
                }
              />
            </View>
          </View>

          {recipient !== undefined ? (
            <PaymentParameters
              isGray
              parameters={'Recipient'}
              value={recipient}
            />
          ) : null}

          {fiatAmount !== undefined ? (
            <PaymentParameters
              isGray
              parameters={'Amount, fiat'}
              value={
                truncate(fiatAmount, BASE_FIAT_MAX_DIGITS) +
                ' ' +
                BASE_FIAT_CURRENCY
              }
            />
          ) : null}

          {cryptoAmount !== undefined ? (
            <PaymentParameters
              isGray
              parameters={'Amount, crypto'}
              value={
                truncate(cryptoAmount, BASE_CRYPTO_MAX_DIGITS) +
                ' ' +
                BASE_CRYPTO_CURRENCY
              }
            />
          ) : null}

          {date !== undefined ? (
            <PaymentParameters isGray parameters={'Date'} value={date} />
          ) : null}

          {onClosePress !== undefined ? (
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.linearGradient}
              colors={['#0dd977', '#1da4ac', '#14c48c']}>
              <TouchableHighlight
                style={styles.buttonSend}
                onPress={onClosePress}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableHighlight>
            </LinearGradient>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    // textAlign: 'center',
    color: '#ffffff',
  },
});

export default TxModal;
