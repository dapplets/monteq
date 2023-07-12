import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Modal,
  ImageSourcePropType,
} from 'react-native';

import PaymentParameters from './PaymentParameters';
import Title from './TitlePage';

import {
  BASE_CRYPTO_CURRENCY,
  BASE_CRYPTO_MAX_DIGITS,
  BASE_FIAT_CURRENCY,
  BASE_FIAT_MAX_DIGITS,
} from '../common/constants';
import { truncate } from '../common/helpers';

export enum TxStatusType {
  Green,
  Yellow,
}

export type TxModalProps = {
  title: string;
  description?: string;
  status?: string;
  type?: TxStatusType;
  recipientId?: string;
  recipientName?: string;
  date?: string;
  fiatAmount?: string;
  cryptoAmount?: string;
  image?: ImageSourcePropType;
  isVisible: boolean;
  primaryButton?: string;
  secondaryButton?: string;
  onRequestClose?: () => void;
  onPrimaryButtonPress?: () => void;
  onSecondaryButtonPress?: () => void;
};

const TxModal: React.FC<TxModalProps> = ({
  title,
  description,
  status,
  type,
  image,
  recipientId,
  recipientName,
  date,
  fiatAmount,
  cryptoAmount,
  isVisible,
  primaryButton,
  secondaryButton,
  onRequestClose,
  onPrimaryButtonPress,
  onSecondaryButtonPress,
}) => {
  const [isDelayTransaction, setDelayTransaction] = useState(false);

  useEffect(() => {
    if (status === 'Signing') {
      const timer = setTimeout(() => {
        setDelayTransaction(true);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <Modal transparent visible={isVisible} animationType="slide" onRequestClose={onRequestClose}>
      <View style={styles.centeredViewTxModal}>
        <View style={styles.modalViewTxModal}>
          <Title isCenter label={title} />

          {image ? (
            <Image resizeMode="contain" style={styles.transactionImgTxModal} source={image} />
          ) : null}

          {description ? <Text style={styles.descriptionTextTxModal}>{description}</Text> : null}

          {status !== undefined && type !== undefined ? (
            <View style={styles.statusBlockTxModal}>
              <Text style={styles.parametersStatusTxModal}>Status</Text>

              <View style={styles.valueStatusTxModal}>
                <Text
                  style={
                    type === TxStatusType.Green
                      ? styles.valueStatusOkTextTxModal
                      : styles.valueStatusTextTxModal
                  }>
                  {status}
                </Text>
                <View
                  style={
                    type === TxStatusType.Green
                      ? styles.valueStatusLabelOkTxModal
                      : styles.valueStatusLabelTxModal
                  }
                />
              </View>
            </View>
          ) : null}

          {recipientId !== undefined ? (
            <PaymentParameters isGray parameters="Recipient ID" value={recipientId} />
          ) : null}

          {recipientName !== undefined && recipientName !== '' ? (
            <PaymentParameters isGray parameters="Recipient Name" value={recipientName} />
          ) : null}

          {fiatAmount !== undefined ? (
            <PaymentParameters
              isGray
              parameters="Amount, fiat"
              value={truncate(fiatAmount, BASE_FIAT_MAX_DIGITS) + ' ' + BASE_FIAT_CURRENCY}
            />
          ) : null}

          {cryptoAmount !== undefined ? (
            <PaymentParameters
              isGray
              parameters="Amount, crypto"
              value={truncate(cryptoAmount, BASE_CRYPTO_MAX_DIGITS) + ' ' + BASE_CRYPTO_CURRENCY}
            />
          ) : null}

          {date !== undefined ? <PaymentParameters isGray parameters="Date" value={date} /> : null}

          {onPrimaryButtonPress !== undefined &&
          primaryButton !== undefined &&
          isDelayTransaction ? (
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linearGradientTxModal}
              colors={['#0dd977', '#1da4ac', '#14c48c']}>
              <TouchableHighlight
                underlayColor="#1da4ac"
                activeOpacity={0.5}
                style={styles.primaryButtonTxModal}
                onPress={onPrimaryButtonPress}>
                <Text style={styles.primaryButtonTextTxModal}>{primaryButton}</Text>
              </TouchableHighlight>
            </LinearGradient>
          ) : null}

          {onSecondaryButtonPress !== undefined && secondaryButton !== undefined ? (
            <TouchableHighlight
              underlayColor="#F6F7F8"
              activeOpacity={0.5}
              style={styles.secondaryButtonTxModal}
              onPress={onSecondaryButtonPress}>
              <Text style={styles.secondaryButtonTextTxModal}>{secondaryButton}</Text>
            </TouchableHighlight>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredViewTxModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalViewTxModal: {
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
  transactionImgTxModal: {
    width: 140,
    height: 70,
    marginBottom: 10,
  },
  statusBlockTxModal: {
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
  parametersStatusTxModal: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '400',
    color: '#222222',
    width: '50%',
  },
  valueStatusTxModal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '50%',
  },

  valueStatusTextTxModal: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    color: '#EBC200',
  },
  valueStatusOkTextTxModal: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    color: '#14C58B',
  },

  valueStatusLabelTxModal: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#EBC200',
    marginLeft: 10,
  },
  valueStatusLabelOkTxModal: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#14C58B',
    marginLeft: 10,
  },
  linearGradientTxModal: {
    display: 'flex',
    borderRadius: 50,
    width: '100%',
    marginBottom: 10,
  },
  primaryButtonTxModal: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  primaryButtonTextTxModal: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,

    color: '#ffffff',
  },
  secondaryButtonTxModal: {
    backgroundColor: '#F6F7F8',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  secondaryButtonTextTxModal: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,

    color: '#222222',
    textDecorationLine: 'underline',
  },
  descriptionTextTxModal: {
    fontSize: 14,
    lineHeight: 21,
    color: '#222222',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    fontWeight: '400',
  },
});

export default TxModal;
