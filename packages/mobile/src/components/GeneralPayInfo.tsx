import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';

export type GeneralPayInfoType = {
  generalPayAmount: string | number;
  title: string;
  generalPayAmountSubtitle: string;
  TipsSubtitleLeft?: string;
  TipsAmount?: string | number;
  TipsSubtitleRight?: string;
};

const GeneralPayInfo = ({
  generalPayAmount,
  title,
  generalPayAmountSubtitle,
  TipsSubtitleLeft,
  TipsAmount,
  TipsSubtitleRight,
}: GeneralPayInfoType) => {
  return (
    <View style={styles.generalPay}>
      <Text style={styles.generalPayLabel}>{title}</Text>
      <View style={styles.amountBlock}>
        <Text style={styles.generalPayAmount}>{generalPayAmount}</Text>
        <Text style={styles.generalPayAmountSubtitle}>{generalPayAmountSubtitle}</Text>
      </View>
      {TipsAmount ? (
        <View style={styles.tipsBlock}>
          {TipsSubtitleLeft ? <Text style={styles.tipsSubtitle}>{TipsSubtitleLeft}</Text> : null}

          <Text style={styles.tipsAmount}>{TipsAmount}</Text>
          {TipsSubtitleRight ? <Text style={styles.tipsSubtitle}>{TipsSubtitleRight}</Text> : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  generalPay: {
    display: 'flex',
    flexDirection: 'column',

    width: '100%',

    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#0dd977',
    marginBottom: 10,
    padding: 10,
  },
  generalPayLabel: {
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 13,
    color: '#777777',
  },
  amountBlock: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: 33,
    marginTop: 5,
    marginBottom: 5,
  },
  generalPayAmount: {
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 33,
    color: '#222222',
  },
  generalPayAmountSubtitle: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 17,
    color: '#222222',
    marginTop: 'auto',
    marginLeft: 5,
    marginBottom: 4,
  },
  tipsBlock: {
    display: 'flex',
    flexDirection: 'row',
    height: 13,
  },
  tipsSubtitle: {
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 13,
    color: '#777777',
  },
  tipsAmount: {
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 13,
    color: '#222222',
    marginLeft: 3,
    marginRight: 3,
  },
});

export default GeneralPayInfo;
