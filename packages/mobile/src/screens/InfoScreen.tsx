import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { useState } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Image,
  TouchableHighlight,
  Platform,
  TextInput,
} from 'react-native';

import { FontFamily } from '../GlobalStyles';
import { BASE_CRYPTO_CURRENCY, BASE_CRYPTO_MAX_DIGITS } from '../common/constants';
import { truncate } from '../common/helpers';
import GeneralPayInfo from '../components/GeneralPayInfo';
import HistoryPay from '../components/HistoryPay';
import Navigation from '../components/Navigation';
import ShareModal from '../components/ShareModal';
import Title from '../components/TitlePage';
import { useMonteqContract } from '../contexts/MonteqContractContext';
import { useUserName } from '../hooks/useUserName';

const InfoScreen = () => {
  const isFocused = useIsFocused();
  const {
    account,
    outHistory,
    spentTotalCryptoAmount,
    spentTipsCryptoAmount,
    loadMoreOutHistory,
    isOutHistoryLoading,
  } = useMonteqContract();
  const { userName, changeUserName } = useUserName();
  const userNameInputRef = React.useRef<any>();

  const [isModalShareVisible, setIsModalShareVisible] = useState(false);

  React.useEffect(() => {
    if (isFocused) {
      loadMoreOutHistory();
    }
  }, [isFocused, loadMoreOutHistory, userName]);

  const openShareModal = () => {
    setIsModalShareVisible(true);
  };

  const handleEditUserNamePress = () => {
    userNameInputRef.current?.focus();
  };

  if (isOutHistoryLoading && outHistory.length === 0) {
    return (
      <>
        <View style={styles.CenterContentWrapper}>
          <ActivityIndicator size="large" color="#919191" />
        </View>
        <Navigation path="user" />
      </>
    );
  }

  return (
    <>
      <View style={styles.InfoScreenWrapper}>
        {!isOutHistoryLoading && outHistory.length === 0 ? (
          <>
            <View style={styles.wrapperTitle}>
              <Title label="Payment history" />
              <TouchableHighlight
                underlayColor="transparent"
                onPress={openShareModal}
                activeOpacity={0.5}
                style={styles.share}>
                <Image
                  style={styles.shareImg}
                  resizeMode="contain"
                  source={require('../assets/share.png')}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.nameParameters}>
              <TextInput
                ref={userNameInputRef}
                numberOfLines={1}
                placeholder="Enter your name"
                value={userName}
                maxLength={20}
                onChangeText={changeUserName}
                style={styles.Value}
              />
              <TouchableHighlight
                underlayColor="transparent"
                onPress={handleEditUserNamePress}
                activeOpacity={0.5}
                style={styles.share}>
                <Image
                  style={styles.shareImg}
                  resizeMode="contain"
                  source={require('../assets/edit.png')}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.CenterContentWrapper}>
              <Image
                resizeMode="contain"
                style={styles.BusinessImg}
                source={require('../assets/Lines.png')}
              />
              <Text style={styles.DescriptionText}>
                No history of outgoing transactions associated to your wallet right now.
              </Text>
            </View>
          </>
        ) : null}

        {/* ToDo: duplication of code below */}
        {outHistory.length > 0 ? (
          <>
            <View style={styles.wrapperTitle}>
              <Title label="Payment history" />
              <TouchableHighlight
                underlayColor="transparent"
                onPress={openShareModal}
                activeOpacity={0.5}
                style={styles.share}>
                <Image
                  style={styles.shareImg}
                  resizeMode="contain"
                  source={require('../assets/share.png')}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.nameParameters}>
              <TextInput
                ref={userNameInputRef}
                numberOfLines={1}
                placeholder="Enter your name"
                value={userName}
                maxLength={20}
                onChangeText={changeUserName}
                style={styles.Value}
              />
              <TouchableHighlight
                underlayColor="transparent"
                onPress={handleEditUserNamePress}
                activeOpacity={0.5}
                style={styles.share}>
                <Image
                  style={styles.shareImg}
                  resizeMode="contain"
                  source={require('../assets/edit.png')}
                />
              </TouchableHighlight>
            </View>
            <GeneralPayInfo
              generalPayAmount={truncate(spentTotalCryptoAmount, BASE_CRYPTO_MAX_DIGITS)}
              title="Spent"
              generalPayAmountSubtitle={BASE_CRYPTO_CURRENCY}
              TipsSubtitleLeft="including"
              TipsAmount={truncate(spentTipsCryptoAmount, BASE_CRYPTO_MAX_DIGITS)}
              TipsSubtitleRight={BASE_CRYPTO_CURRENCY + ' tips'}
            />

            <FlatList
              // style={styles.listHistory}
              refreshing={isOutHistoryLoading}
              onRefresh={loadMoreOutHistory}
              progressViewOffset={-90}
              data={outHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
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
              // ListFooterComponent={<View style={{ height: 30 }} />}
            />
          </>
        ) : null}
      </View>
      <Navigation path="user" />
      <ShareModal
        account={account}
        username={userName}
        isVisible={isModalShareVisible}
        onRequestClose={() => setIsModalShareVisible(!isModalShareVisible)}
      />
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
  CenterContentWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
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
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
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
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  GeneralPayAmountSubtitle: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 17,
    color: '#222222',
    marginTop: 'auto',
    marginLeft: 5,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
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
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
  TipsAmount: {
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 13,
    color: '#222222',
    marginLeft: 3,
    marginRight: 3,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  listHistory: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    marginBottom: 70,
    marginTop: 10,
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
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
  wrapperTitle: {
    display: 'flex',
    width: '100%',
    paddingRight: 25,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  share: {
    backgroundColor: 'transparent',
    width: 24,
    height: 24,
  },
  shareImg: {
    width: 24,
    height: 24,
  },
  nameParameters: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  Value: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '400',
    color: '#222222',
    backgroundColor: '#fff',
    padding: 0,
    margin: 0,
    textAlign: 'left',
    width: '80%',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
});

export default InfoScreen;
