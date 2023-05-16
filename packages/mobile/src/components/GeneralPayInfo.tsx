import * as React from 'react';
import {Text, StyleSheet, View, Platform} from 'react-native';
import {FontFamily} from '../GlobalStyles';

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
    <View style={styles.GeneralPay}>
      <Text style={styles.GeneralPayLabel}>{title}</Text>
      <View style={styles.AmountBlock}>
        <Text style={styles.GeneralPayAmount}>{generalPayAmount}</Text>
        <Text style={styles.GeneralPayAmountSubtitle}>
          {generalPayAmountSubtitle}
        </Text>
      </View>
      {TipsAmount ? (
        <View style={styles.TipsBlock}>
          {TipsSubtitleLeft ? (
            <Text style={styles.TipsSubtitle}>{TipsSubtitleLeft}</Text>
          ) : null}

          <Text style={styles.TipsAmount}>{TipsAmount}</Text>
          {TipsSubtitleRight ? (
            <Text style={styles.TipsSubtitle}>{TipsSubtitleRight}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  GeneralPay: {
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
  GeneralPayLabel: {
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 13,
    color: '#777777',
    fontFamily:
      Platform.OS === 'ios' ? 'roboto_regular.ttf' : FontFamily.robotoRegular,
  },
  AmountBlock: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: 33,
    marginTop: 5,
    marginBottom: 5,
  },
  GeneralPayAmount: {
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 33,
    color: '#222222',
    fontFamily:
      Platform.OS === 'ios' ? 'roboto_bold.ttf' : FontFamily.robotoBold,
  },
  GeneralPayAmountSubtitle: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 17,
    color: '#222222',
    marginTop: 'auto',
    marginLeft: 5,
    marginBottom: 4,
    fontFamily:
      Platform.OS === 'ios' ? 'roboto_bold.ttf' : FontFamily.robotoBold,
  },
  TipsBlock: {
    display: 'flex',
    flexDirection: 'row',
    height: 13,
  },
  TipsSubtitle: {
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 13,
    color: '#777777',
    fontFamily:
      Platform.OS === 'ios' ? 'roboto_regular.ttf' : FontFamily.robotoRegular,
  },
  TipsAmount: {
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 13,
    color: '#222222',
    marginLeft: 3,
    marginRight: 3,
    fontFamily:
      Platform.OS === 'ios' ? 'roboto_bold.ttf' : FontFamily.robotoBold,
  },
});

export default GeneralPayInfo;
