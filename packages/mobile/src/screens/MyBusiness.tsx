import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  Image,
  Alert,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';

import { FontFamily } from '../GlobalStyles';
import { RootStackParamList } from '../Router';
import {
  BASE_CRYPTO_CURRENCY,
  BASE_CRYPTO_MAX_DIGITS,
  BASE_FIAT_CURRENCY,
  BASE_FIAT_MAX_DIGITS,
} from '../common/constants';
import { mulStr, truncate } from '../common/helpers';
import { DomainType, parseQrCodeData } from '../common/parseReceipt';
import GeneralPayInfo from '../components/GeneralPayInfo';
import HistoryPay from '../components/HistoryPay';
import SwitchBlock from '../components/SwitchBlock';
import Title from '../components/TitlePage';
import { useCamera } from '../contexts/CameraContext';
import { useGetBusinessByOwner } from '../hooks/monteq/useGetBusinessByOwner';
import { useGetInHistory } from '../hooks/monteq/useGetInHistory';
import { useAccount } from '../hooks/useAccount';
import { useCoingecko } from '../hooks/useCoingecko';
import { useSettings } from '../hooks/useSettings';

const MyBusiness = () => {
  const { scan } = useCamera();
  const isFocused = useIsFocused();

  const { address } = useAccount();
  const {
    business: myBusiness,
    isLoading: isMyBusinessLoading,
    refetch,
  } = useGetBusinessByOwner(address);
  const {
    isInHistoryLoading,
    inHistory,
    loadMoreInHistory,
    earnedTipsCryptoAmount,
    earnedInvoicesCryptoAmount,
  } = useGetInHistory(myBusiness?.id);
  const { rate } = useCoingecko();
  const { isOwnerViewPreferred, changeIsOwnerViewPreferred } = useSettings();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  React.useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  React.useEffect(() => {
    loadMoreInHistory();
  }, [myBusiness]);

  async function handleGmsScanPressBusiness() {
    try {
      const url = await scan();
      const parsedReceipt = parseQrCodeData(url);

      if (parsedReceipt.domain === DomainType.MontenegroFiscalCheck) {
        navigation.navigate('AddingMyBusiness', {
          parsedReceipt: parsedReceipt.payload,
        });
      } else {
        throw new Error('Incompatible receipt');
      }
    } catch (e) {
      console.error(e);

      // @ts-ignore
      if (e.message !== 'User canceled scanning') {
        if (Platform.OS === 'web') {
          // @ts-ignore
          alert(e.message);
        } else {
          // @ts-ignore
          Alert.alert('Error', e.message);
        }
      }
    }
  }

  async function handleGmsScanPressBusinessRemoving() {
    if (!myBusiness) {
      return;
    }

    navigation.navigate('RemovingMyBusiness');
  }

  if ((!myBusiness && isMyBusinessLoading) || (isInHistoryLoading && inHistory.length === 0)) {
    return (
      <View style={styles.centerContentWrapperMyBusiness}>
        <ActivityIndicator size="large" color="#919191" />
      </View>
    );
  }

  return (
    <>
      {myBusiness ? (
        <>
          {inHistory.length === 0 ? (
            <View style={styles.centerContentWrapperMyBusiness}>
              <Image
                resizeMode="contain"
                style={styles.businessImgMyBusiness}
                source={require('../assets/lines.png')}
              />
              <Text style={styles.descriptionTextMyBusiness}>
                No history of incoming transactions associated to your business right now.
              </Text>
            </View>
          ) : (
            <View style={styles.infoScreenWrapperMyBusiness}>
              <Title label="Owner’s View" />

              <FlatList
                data={[]}
                renderItem={() => null}
                refreshing={isInHistoryLoading}
                onRefresh={loadMoreInHistory}
                overScrollMode="never"
                ListHeaderComponent={
                  <>
                    <GeneralPayInfo
                      generalPayAmount={truncate(
                        mulStr(earnedInvoicesCryptoAmount, rate),
                        BASE_FIAT_MAX_DIGITS
                      )}
                      title="Paid for invoices"
                      generalPayAmountSubtitle={BASE_FIAT_CURRENCY}
                      TipsAmount={truncate(earnedInvoicesCryptoAmount, BASE_CRYPTO_MAX_DIGITS)}
                      TipsSubtitleRight={BASE_CRYPTO_CURRENCY}
                    />
                    <GeneralPayInfo
                      generalPayAmount={truncate(earnedTipsCryptoAmount, BASE_CRYPTO_MAX_DIGITS)}
                      title="Tips"
                      generalPayAmountSubtitle={BASE_CRYPTO_CURRENCY}
                    />
                    <SwitchBlock
                      parameters="Always start from this page"
                      onPress={changeIsOwnerViewPreferred}
                      isPress={isOwnerViewPreferred}
                    />
                    <TouchableHighlight
                      underlayColor="#ca3131"
                      activeOpacity={0.5}
                      style={styles.buttonRemoveMyBusiness}
                      onPress={handleGmsScanPressBusinessRemoving}>
                      <Text style={styles.buttonRemoveTextMyBusiness}>Remove my business</Text>
                    </TouchableHighlight>
                  </>
                }
                // Workaround for:
                // https://stackoverflow.com/questions/61541163/style-the-container-of-react-natives-flatlist-items-separate-from-the-header
                ListFooterComponent={
                  <FlatList
                    // style={styles.list}
                    data={inHistory}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <HistoryPay
                        time={new Date(item.timestamp * 1000).toISOString()}
                        company={item.payer}
                        amount={
                          '+' +
                          truncate(item.totalCryptoAmount, BASE_CRYPTO_MAX_DIGITS) +
                          ' ' +
                          BASE_CRYPTO_CURRENCY
                        }
                      />
                    )}
                    ListFooterComponent={<View style={{ height: 30 }} />}
                  />
                }
              />
            </View>
          )}
        </>
      ) : (
        <View style={styles.infoScreenWrapperMyBusiness}>
          <Title label="Owner’s View" />
          <SwitchBlock
            parameters="Always start from business page"
            onPress={changeIsOwnerViewPreferred}
            isPress={isOwnerViewPreferred}
          />
          <View style={styles.centerContentWrapperMyBusiness}>
            <Image
              resizeMode="contain"
              style={styles.businessImgMyBusiness}
              source={require('../assets/lines.png')}
            />
            <Text style={styles.descriptionTextMyBusiness}>
              No business is associated with this wallet right now. Connect a business to start
              getting paid in cryptocurrency or log in with the right wallet.
            </Text>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linearGradientMyBusiness}
              colors={['#0dd977', '#1da4ac', '#14c48c']}>
              <TouchableHighlight
                underlayColor="#1da4ac"
                activeOpacity={0.5}
                style={styles.buttonSendMyBusiness}
                onPress={handleGmsScanPressBusiness}>
                <Text style={styles.buttonTextMyBusiness}>Connect my business</Text>
              </TouchableHighlight>
            </LinearGradient>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  infoScreenWrapperMyBusiness: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: '#F6F7F8',
    padding: 10,
    marginBottom: 60,
  },
  centerContentWrapperMyBusiness: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },

  linearGradientMyBusiness: {
    display: 'flex',
    borderRadius: 50,
    width: '100%',
  },
  buttonTextMyBusiness: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  buttonSendMyBusiness: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  buttonRemoveMyBusiness: {
    backgroundColor: '#FF3E3E',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  buttonRemoveTextMyBusiness: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    textDecorationLine: 'underline',
    textDecorationColor: '#fff',
    textDecorationStyle: 'solid',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  businessImgMyBusiness: {
    width: 174,
    height: 158,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 20,
  },
  descriptionTextMyBusiness: {
    fontSize: 12,
    lineHeight: 14,
    color: '#919191',
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
});

export default MyBusiness;
