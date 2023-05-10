import * as React from 'react';
import {
  View,
  Alert,
  StyleSheet,
  TouchableHighlight,
  Image,
  Text,
} from 'react-native';
import { BASE_CRYPTO_CURRENCY } from '../common/constants';
export type PaymentInfoType = {
  price: string;
  title: string;
  convert: {
    convertEUR: string;
    convertCurrency: string;
  };
};
const PaymentInfo = ({price, title, convert}: PaymentInfoType) => {
  return (
    <View style={styles.PaymentWrapper}>
      <Text style={styles.PaymentTitle}>{title}</Text>
      <View style={styles.PaymentPrice}>
        <Text style={styles.priceTitle}>{price}</Text>
        <Text style={styles.priceSubtitle}>{BASE_CRYPTO_CURRENCY}</Text>
      </View>
      <View style={styles.PaymentConvert}>
        <Text style={styles.convertEUR}>{convert.convertEUR}</Text>
        <Text style={styles.convertCurrensy}>=</Text>
        <Text style={styles.convertCurrensy}>{convert.convertCurrency}</Text>
      </View>
      <View style={styles.PaymentDescription}>
        <Text style={styles.DescriptionText}>
          Always get consent from the recepient before you pay in crypto.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  PaymentWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#F5F6F7',
    marginTop: 10,
    marginBottom: 10,
  },
  PaymentTitle: {
    color: '#919191',
    fontSize: 12,
    lineHeight: 14,
    marginBottom: 10,
  },
  PaymentPrice: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'flex-end',
    justifyContent: 'center',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#F5F6F7',
    // padding: 10,
    paddingTop: 10,
    marginBottom: 5,
  },
  priceTitle: {
    fontSize: 32,
    // lineHeight: 34,
    color: '#14C58B',
    fontWeight: '700',
    marginRight: 10,
  },
  priceSubtitle: {
    fontSize: 10,
    // lineHeight: 14,
    color: '#14C58B',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 'auto',
    marginBottom: 6,
  },
  PaymentConvert: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'flex-end',
    justifyContent: 'center',
  },
  convertEUR: {
    fontSize: 10,
    // lineHeight: 14,
    color: '#14C58B',
    textTransform: 'uppercase',
    marginRight: 5,
  },
  convertCurrensy: {
    fontSize: 10,
    // lineHeight: 14,
    color: '#14C58B',
    textTransform: 'uppercase',
    marginLeft: 5,
  },
  PaymentDescription: {
    marginTop: 10,
    width: '60%',
  },
  DescriptionText: {
    fontSize: 12,
    lineHeight: 14,
    color: '#919191',
    textAlign: 'center',
  },
});
export default PaymentInfo;
