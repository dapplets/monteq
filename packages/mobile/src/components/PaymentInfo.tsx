import * as React from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import {BASE_CRYPTO_CURRENCY} from '../common/constants';
import {FontFamily} from '../GlobalStyles';

export type PaymentInfoType = {
  price: string;
  title: string;
  convert?: {
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
      {convert ? (
        <>
          <View style={styles.PaymentConvert}>
            <Text style={styles.convertEUR}>{convert.convertEUR}</Text>
            <Text style={styles.convertCurrensy}>=</Text>
            <Text style={styles.convertCurrensy}>
              {convert.convertCurrency}
            </Text>
          </View>
          <View style={styles.PaymentDescription}>
            <Text style={styles.DescriptionText}>
              Always get consent from the recepient before you pay in crypto.
            </Text>
          </View>
        </>
      ) : null}
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
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
  PaymentPrice: {
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
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  priceSubtitle: {
    fontSize: 10,

    color: '#14C58B',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 'auto',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  PaymentConvert: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',

    justifyContent: 'center',
  },
  convertEUR: {
    fontSize: 10,

    color: '#14C58B',
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
  convertCurrensy: {
    fontSize: 10,

    color: '#14C58B',
    textTransform: 'uppercase',
    marginLeft: 5,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
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
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
});

export default PaymentInfo;
