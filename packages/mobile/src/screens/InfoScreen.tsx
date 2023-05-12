import * as React from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Image,
} from 'react-native';
import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import {useMonteqContract} from '../contexts/MonteqContractContext';
import HistoryPay from '../components/HistoryPay';
import GeneralPayInfo from '../components/GeneralPayInfo';
import {
  BASE_CRYPTO_CURRENCY,
  BASE_CRYPTO_MAX_DIGITS,
} from '../common/constants';
import {truncate} from '../common/helpers';
import {useIsFocused} from '@react-navigation/native';
import {FontFamily} from '../GlobalStyles';

const InfoScreen = () => {
  const isFocused = useIsFocused();
  const {
    outHistory,
    spentTotalCryptoAmount,
    spentTipsCryptoAmount,
    loadMoreOutHistory,
    isOutHistoryLoading,
  } = useMonteqContract();

  React.useEffect(() => {
    if (isFocused) {
      loadMoreOutHistory();
    }
  }, [isFocused, loadMoreOutHistory]);

  if (isOutHistoryLoading && outHistory.length === 0) {
    return (
      <View style={styles.InfoScreenWrapper}>
        <Title label="Payment history" />
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.InfoScreenWrapper}>
        <Title label="Payment history" />

        {!isOutHistoryLoading && outHistory.length === 0 ? (
          <>
            <Image
              resizeMode="contain"
              style={styles.BusinessImg}
              source={require('../assets/Lines.png')}
            />
            <Text style={styles.DescriptionText}>
              No history is associated with this wallet right now.
            </Text>
          </>
        ) : null}

        {outHistory.length > 0 ? (
          <>
            <GeneralPayInfo
              generalPayAmount={truncate(
                spentTotalCryptoAmount,
                BASE_CRYPTO_MAX_DIGITS,
              )}
              title={'Spent'}
              generalPayAmountSubtitle={BASE_CRYPTO_CURRENCY}
              TipsSubtitleLeft={'including'}
              TipsAmount={truncate(
                spentTipsCryptoAmount,
                BASE_CRYPTO_MAX_DIGITS,
              )}
              TipsSubtitleRight={BASE_CRYPTO_CURRENCY + ' tips'}
            />

            <FlatList
              style={styles.list}
              refreshing={isOutHistoryLoading}
              onRefresh={loadMoreOutHistory}
              progressViewOffset={-90}
              data={outHistory}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <HistoryPay
                  time={new Date(item.timestamp * 1000).toISOString()}
                  company={item.businessId}
                  amount={
                    '-' +
                    truncate(item.totalCryptoAmount, BASE_CRYPTO_MAX_DIGITS) +
                    ' ' +
                    BASE_CRYPTO_CURRENCY
                  }
                />
              )}
              ListFooterComponent={<View style={{height: 30}} />}
            />
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
    padding: 10,
    marginBottom: 60,
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
    fontFamily: FontFamily.robotoRegular,
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
    fontFamily: FontFamily.robotoBold,
  },
  GeneralPayAmountSubtitle: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 17,
    color: '#222222',
    marginTop: 'auto',
    marginLeft: 5,
    marginBottom: 4,
    fontFamily: FontFamily.robotoBold,
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
    fontFamily: FontFamily.robotoRegular,
  },
  TipsAmount: {
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 13,
    color: '#222222',
    marginLeft: 3,
    marginRight: 3,
    fontFamily: FontFamily.robotoBold,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    // marginBottom: 'auto',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    marginBottom: 70,
    // marginLeft: 10,
    // marginRight: 40,
  },
  BusinessImg: {
    width: 174,
    height: 158,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 20,
  },
  DescriptionText: {
    fontSize: 12,
    lineHeight: 14,
    color: '#919191',
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
    fontFamily: FontFamily.robotoRegular,
  },
});

export default InfoScreen;
