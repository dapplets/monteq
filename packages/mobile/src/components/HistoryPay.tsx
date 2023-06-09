import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { FontFamily } from '../GlobalStyles';
import SvgComponentPay from '../icons/SVGPay';

export type HistoryPayType = {
  time: string;
  company: string;
  amount: string;
};

const formatedDate = (_time: string) => {
  const d = new Date(_time);
  const str = d.toLocaleDateString('en-EN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return str;
};

const HistoryPay = ({ time, company, amount }: HistoryPayType) => {
  return (
    <View style={styles.HistoryWrapper}>
      <SvgComponentPay style={styles.ImgHistory} />
      <View style={styles.HistoryPayBlock}>
        <View style={styles.topRow}>
          <Text style={styles.HistoryAmount}>{amount}</Text>
          <Text style={styles.time}>{formatedDate(time)}</Text>
        </View>
        <Text style={styles.company}>{company}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  HistoryWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',

    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    marginTop: 10,
    height: 39,
    paddingLeft: 10,
    paddingRight: 10,
  },
  ImgHistory: {
    width: 24,
    height: 24,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  HistoryPayBlock: {
    display: 'flex',
    flexDirection: 'column',
    width: 'auto',
    height: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    flex: 1,
  },
  HistoryAmount: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 16,
    color: '#222222',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  company: {
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 12,
    color: '#919191',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
  time: {
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 12,
    color: '#919191',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
  topRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default HistoryPay;
