import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
    <View style={styles.historyWrapper}>
      <SvgComponentPay style={styles.imgHistory} />
      <View style={styles.historyPayBlock}>
        <View style={styles.topRow}>
          <Text style={styles.historyAmount}>{amount}</Text>
          <Text style={styles.timeHistory}>{formatedDate(time)}</Text>
        </View>
        <Text style={styles.companyHistory}>{company}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  historyWrapper: {
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
  imgHistory: {
    width: 24,
    height: 24,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  historyPayBlock: {
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
  historyAmount: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 16,
    color: '#222222',
  },
  companyHistory: {
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 12,
    color: '#919191',
  },
  timeHistory: {
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 12,
    color: '#919191',
  },
  topRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default HistoryPay;
