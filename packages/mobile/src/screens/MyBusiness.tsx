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
import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import {useMonteqContract} from '../contexts/MonteqContractContext';
import { LinearGradient } from 'expo-linear-gradient';
import SwitchBlock from '../components/SwitchBlock';
import {useWeb3Modal} from '@web3modal/react-native';
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import HistoryPay from '../components/HistoryPay';
import GeneralPayInfo from '../components/GeneralPayInfo';
import {
  BASE_CRYPTO_CURRENCY,
  BASE_CRYPTO_MAX_DIGITS,
  BASE_FIAT_CURRENCY,
  BASE_FIAT_MAX_DIGITS,
  IS_OWNER_VIEW_PREFERRED_KEY,
} from '../common/constants';
import {DomainType, parseQrCodeData} from '../common/parseReceipt';
import {mulStr, truncate} from '../common/helpers';
import {FontFamily} from '../GlobalStyles';
import {useCamera} from '../contexts/CameraContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyBusiness = () => {
  const {scan} = useCamera();
  const isFocused = useIsFocused();
  const {
    isInHistoryLoading,
    inHistory,
    loadMoreInHistory,
    earnedTipsCryptoAmount,
    earnedInvoicesCryptoAmount,
    rate,
    myBusiness,
    isMyBusinessLoading,
  } = useMonteqContract();

  const [isRemember, setIsRemember] = React.useState(false);
  const {provider} = useWeb3Modal();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  React.useEffect(() => {
    if (isFocused) {
      loadMoreInHistory();
    }
  }, [isFocused, loadMoreInHistory]);

  React.useEffect(() => {
    (async () => {
      try {
        // ToDo: move to separate hook?
        const isOwnerViewPreferred = await AsyncStorage.getItem(
          IS_OWNER_VIEW_PREFERRED_KEY,
        );
        setIsRemember(isOwnerViewPreferred === 'true');
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  async function handleRememberSwitch(value: boolean) {
    setIsRemember(value);

    try {
      // ToDo: move to separate hook?
      await AsyncStorage.setItem(IS_OWNER_VIEW_PREFERRED_KEY, value.toString());
    } catch (e) {
      console.error(e);
    }
  }

  async function handleGmsScanPressBusiness() {
    if (!provider) {
      return;
    }

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
        // @ts-ignore
        Alert.alert('Error', e.message);
      }
    }
  }

  async function handleGmsScanPressBusinessRemoving() {
    if (!myBusiness) {
      return;
    }

    navigation.navigate('RemovingMyBusiness');
  }

  if (isMyBusinessLoading || (isInHistoryLoading && inHistory.length === 0)) {
    return (
      <>
        <View style={styles.CenterContentWrapper}>
          <ActivityIndicator size="large" color="#919191" />
        </View>
        <Navigation path="home" />
      </>
    );
  }

  return (
    <>
      {myBusiness ? (
        <>
          {inHistory.length === 0 ? (
            <View style={styles.CenterContentWrapper}>
              <Image
                resizeMode="contain"
                style={styles.BusinessImg}
                source={require('../assets/Lines.png')}
              />
              <Text style={styles.DescriptionText}>
                No history of incoming transactions associated to your business
                right now.
              </Text>
            </View>
          ) : (
            <View style={styles.InfoScreenWrapper}>
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
                        BASE_FIAT_MAX_DIGITS,
                      )}
                      title={'Paid for invoices'}
                      generalPayAmountSubtitle={BASE_FIAT_CURRENCY}
                      TipsAmount={truncate(
                        earnedInvoicesCryptoAmount,
                        BASE_CRYPTO_MAX_DIGITS,
                      )}
                      TipsSubtitleRight={BASE_CRYPTO_CURRENCY}
                    />
                    <GeneralPayInfo
                      generalPayAmount={truncate(
                        earnedTipsCryptoAmount,
                        BASE_CRYPTO_MAX_DIGITS,
                      )}
                      title={'Tips'}
                      generalPayAmountSubtitle={BASE_CRYPTO_CURRENCY}
                    />
                    <SwitchBlock
                      parameters={'Always start from this page'}
                      onPress={handleRememberSwitch}
                      isPress={isRemember}
                    />
                    <TouchableHighlight
                      underlayColor={'#ca3131'}
                      activeOpacity={0.5}
                      style={styles.buttonRemove}
                      onPress={handleGmsScanPressBusinessRemoving}>
                      <Text style={styles.buttonRemoveText}>
                        Remove my business
                      </Text>
                    </TouchableHighlight>
                  </>
                }
                // Workaround for:
                // https://stackoverflow.com/questions/61541163/style-the-container-of-react-natives-flatlist-items-separate-from-the-header
                ListFooterComponent={
                  <FlatList
                    style={styles.list}
                    data={inHistory}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                      <HistoryPay
                        time={new Date(item.timestamp * 1000).toISOString()}
                        company={item.payer}
                        amount={
                          '-' +
                          truncate(
                            item.totalCryptoAmount,
                            BASE_CRYPTO_MAX_DIGITS,
                          ) +
                          ' ' +
                          BASE_CRYPTO_CURRENCY
                        }
                      />
                    )}
                    ListFooterComponent={<View style={{height: 30}} />}
                  />
                }
              />
            </View>
          )}
          <Navigation path="home" />
        </>
      ) : (
        <>
          <View style={styles.InfoScreenWrapper}>
            <Title label="Owner’s View" />
            <SwitchBlock
              parameters={'Always start from business page'}
              onPress={handleRememberSwitch}
              isPress={isRemember}
            />
            <View style={styles.CenterContentWrapper}>
              <Image
                resizeMode="contain"
                style={styles.BusinessImg}
                source={require('../assets/Lines.png')}
              />
              <Text style={styles.DescriptionText}>
                No business is associated with this wallet right now. Connect a
                business to start getting paid in cryptocurrency or log in with
                the right wallet.
              </Text>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.linearGradient}
                colors={['#0dd977', '#1da4ac', '#14c48c']}>
                <TouchableHighlight
                  underlayColor={'#1da4ac'}
                  activeOpacity={0.5}
                  style={styles.buttonSend}
                  onPress={handleGmsScanPressBusiness}>
                  <Text style={styles.buttonText}>Connect my business</Text>
                </TouchableHighlight>
              </LinearGradient>
            </View>
          </View>
          <Navigation path="home" />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  InfoScreenWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: '#F6F7F8',
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
  timeNavigation: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 'auto',
  },
  list: {
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
    marginTop: 10,
    marginBottom: 60,
  },
  wrapperBorder: {},
  clockIcon: {},
  iconLayout: {},
  logOutWrapper: {},
  linearGradient: {
    display: 'flex',
    borderRadius: 50,
    width: '100%',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  buttonSend: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  buttonRemove: {
    backgroundColor: '#FF3E3E',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  buttonRemoveText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    textDecorationLine: 'underline',
    textDecorationColor: '#fff',
    textDecorationStyle: 'solid',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
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
});

export default MyBusiness;
