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
import {FontFamily} from '../GlobalStyles';

export enum TxStatusType {
  Green,
  Yellow,
}

type Props = {
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
  onRequestClose: () => void;
  onPrimaryButtonPress?: () => void;
  onSecondaryButtonPress?: () => void;
};

const TxModal: React.FC<Props> = ({
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
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onRequestClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Title isCenter label={title} />

          {image ? (
            <Image
              resizeMode="contain"
              style={styles.TransactionImg}
              source={image}
            />
          ) : null}

          {description ? (
            <Text style={styles.DescriptionText}>{description}</Text>
          ) : null}

          {status !== undefined && type !== undefined ? (
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
          ) : null}

          {recipientId !== undefined ? (
            <PaymentParameters
              isGray
              parameters={'Recipient ID'}
              value={recipientId}
            />
          ) : null}

          {recipientName !== undefined && recipientName !== '' ? (
            <PaymentParameters
              isGray
              parameters={'Recipient Name'}
              value={recipientName}
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

          {onPrimaryButtonPress !== undefined && primaryButton !== undefined ? (
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.linearGradient}
              colors={['#0dd977', '#1da4ac', '#14c48c']}>
              <TouchableHighlight
                underlayColor={'#1da4ac'}
                activeOpacity={0.5}
                style={styles.primaryButton}
                onPress={onPrimaryButtonPress}>
                <Text style={styles.primaryButtonText}>{primaryButton}</Text>
              </TouchableHighlight>
            </LinearGradient>
          ) : null}

          {onSecondaryButtonPress !== undefined &&
          secondaryButton !== undefined ? (
            <TouchableHighlight
              underlayColor={'#F6F7F8'}
              activeOpacity={0.5}
              style={styles.secondaryButton}
              onPress={onSecondaryButtonPress}>
              <Text style={styles.secondaryButtonText}>{secondaryButton}</Text>
            </TouchableHighlight>
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
    fontFamily: FontFamily.robotoRegular,
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
    fontFamily: FontFamily.robotoBold,
  },
  ValueStatusTextOk: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    color: '#14C58B',
    fontFamily: FontFamily.robotoBold,
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
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    // textAlign: 'center',
    color: '#ffffff',
    fontFamily: FontFamily.robotoBold,
  },
  secondaryButton: {
    backgroundColor: '#F6F7F8',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    // textAlign: 'center',
    color: '#222222',
    textDecorationLine: 'underline',
    fontFamily: FontFamily.robotoBold,
  },
  DescriptionText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#222222',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    fontFamily: FontFamily.robotoRegular,
  },
});

export default TxModal;
