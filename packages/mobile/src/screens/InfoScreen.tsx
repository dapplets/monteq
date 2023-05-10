import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
// import TimeLabel from '../components/TimeLabel';
import {useMonteqContract} from '../contexts/MonteqContractContext';
import {useEffect} from 'react';
import HistoryPay from '../components/HistoryPay';
import GeneralPayInfo from '../components/GeneralPayInfo';
import {BASE_CRYPTO_CURRENCY} from '../common/constants';

const InfoScreen = () => {
  const {outHistory, loadMoreOutHistory} = useMonteqContract();

  useEffect(() => {
    loadMoreOutHistory();
  }, [loadMoreOutHistory]);

  return (
    <>
      <View style={styles.InfoScreenWrapper}>
        <Title label="Payment history" />
        {outHistory && outHistory.length > 0 ? (
          <>
            <GeneralPayInfo
              generalPayAmount={outHistory.reduce(
                (s, i) => (s = s + +i.currencyReceipt),
                0,
              )}
              title={'Spent'}
              generalPayAmountSubtitle={BASE_CRYPTO_CURRENCY}
              TipsSubtitleLeft={'including'}
              TipsAmount={outHistory.reduce(
                (s, i) => (s = s + +i.tipAmount),
                0,
              )}
              TipsSubtitleRight={BASE_CRYPTO_CURRENCY + ' tips'}
            />

            <View style={styles.list}>
              {outHistory.map((x, i) => {
                return (
                  <HistoryPay
                    key={i}
                    time={new Date(x.timestamp * 1000).toISOString()}
                    company={x.businessId}
                    amount={
                      '-' + x.currencyReceipt + ' ' + BASE_CRYPTO_CURRENCY
                    }
                  />
                );
              })}
            </View>
          </>
        ) : null}
      </View>
      <Navigation path="user" />
    </>
  );
};

const styles = StyleSheet.create({
  InfoScreenWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    paddingLeft: 20,
    paddingRight: 20,
  },
  GeneralPay: {
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    width: '100%',
    // height: 60,
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
  },
  AmountBlock: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: 33,
    marginTop: 7,
    marginBottom: 7,
  },

  GeneralPayAmount: {
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 33,
    color: '#222222',
  },
  GeneralPayAmountSubtitle: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 17,
    color: '#222222',
    marginTop: 'auto',
    marginLeft: 5,
    marginBottom: 4,
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
  },
  TipsAmount: {
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 13,
    color: '#222222',
    marginLeft: 3,
    marginRight: 3,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 'auto',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    // marginLeft: 10,
    // marginRight: 40,
  },
  wrapperBorder: {},
  clockIcon: {},
  iconLayout: {},
  logOutWrapper: {},
});
export default InfoScreen;
