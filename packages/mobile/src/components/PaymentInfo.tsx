import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { BASE_CRYPTO_CURRENCY } from '../common/constants';

export type PaymentInfoType = {
  price: string;
  title: string;
  isTokens?: boolean;
  convert?: {
    convertEUR: string;
    convertCurrency: string;
  };
};

const PaymentInfo = ({ price, title, convert, isTokens }: PaymentInfoType) => {
  return (
    <View style={styles.paymentWrapper}>
      <Text style={styles.paymentTitle}>{title}</Text>
      <View style={styles.paymentPrice}>
        <Text style={styles.priceTitle}>{price}</Text>
        <Text style={styles.priceSubtitle}>{isTokens ? 'tokens' : `${BASE_CRYPTO_CURRENCY}`}</Text>
      </View>
      {convert ? (
        <>
          <View style={styles.paymentConvert}>
            <Text style={styles.convertEUR}>{convert.convertEUR}</Text>
            <Text style={styles.convertCurrensy}>=</Text>
            <Text style={styles.convertCurrensy}>{convert.convertCurrency}</Text>
          </View>
          <View style={styles.paymentDescription}>
            <Text style={styles.descriptionText}>
              Always get consent from the recepient before you pay in crypto.
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  paymentWrapper: {
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
  paymentTitle: {
    color: '#919191',
    fontSize: 12,
    lineHeight: 14,
    marginBottom: 10,
    fontWeight: '400',
  },
  paymentPrice: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',

    justifyContent: 'center',

    marginBottom: 5,
  },
  priceTitle: {
    fontSize: 32,

    color: '#14C58B',
    fontWeight: '700',
    marginRight: 10,
  },
  priceSubtitle: {
    fontSize: 10,

    color: '#14C58B',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 'auto',
    marginBottom: 6,
  },
  paymentConvert: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',

    justifyContent: 'center',
  },
  convertEUR: {
    fontSize: 10,

    color: '#14C58B',
    textTransform: 'uppercase',
    fontWeight: '400',
  },
  convertCurrensy: {
    fontSize: 10,

    color: '#14C58B',
    textTransform: 'uppercase',
    marginLeft: 5,
    fontWeight: '400',
  },
  paymentDescription: {
    marginTop: 10,
    width: '60%',
  },
  descriptionText: {
    fontSize: 12,
    lineHeight: 14,
    color: '#919191',
    textAlign: 'center',
    fontWeight: '400',
  },
});

export default PaymentInfo;
