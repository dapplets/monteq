import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

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

const HistoryPay = ({time, company, amount}: HistoryPayType) => {
  return (
    <View style={styles.HistoryWrapper}>
      <Image
        resizeMode="cover"
        source={require('../assets/history.png')}
        style={styles.ImgHistory}
      />
      <View style={styles.HistoryPayBlock}>
        <Text style={styles.HistoryAmount}>{amount}</Text>
        <Text style={styles.company}>{company}</Text>
      </View>

      <Text style={styles.time}>{formatedDate(time)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  HistoryWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    // padding: 10,
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
    // justifyContent: 'space-between',
    height: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  HistoryAmount: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 16,
    color: '#222222',
  },
  company: {
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 12,
    color: '#919191',
  },
  time: {
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 12,
    color: '#919191',
    marginLeft: 'auto',
    paddingTop: 5,
    paddingBottom: 5,
  },
});
export default HistoryPay;
