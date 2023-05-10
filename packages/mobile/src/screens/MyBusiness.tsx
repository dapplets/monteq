import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  Image,
  Alert,
} from 'react-native';

import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import {useMonteqContract} from '../contexts/MonteqContractContext';
import LinearGradient from 'react-native-linear-gradient';
import SwitchBlock from '../components/SwitchBlock';
import {useEffect} from 'react';
import BarcodeScannerModule from '../modules/BarcodeScannerModule';
import {useWeb3Modal} from '@web3modal/react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import HistoryPay from '../components/HistoryPay';
import GeneralPayInfo from '../components/GeneralPayInfo';
import {BASE_CRYPTO_CURRENCY, BASE_FIAT_CURRENCY} from '../common/constants';
import {parseReceipt} from '../common/parseReceipt';

const MyBusiness = () => {
  const {inHistory, loadMoreInHistory} = useMonteqContract();
  const [isRemember, setRemember] = React.useState(false);
  const {provider} = useWeb3Modal();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadMoreInHistory();
  }, [loadMoreInHistory]);

  async function handleGmsScanPressBusiness() {
    if (!provider) {
      return;
    }

    try {
      const url = await BarcodeScannerModule.scan();
      const parsedReceipt = parseReceipt(url);
      navigation.navigate('AddingMyBusiness', {parsedReceipt});
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
    if (!provider) {
      return;
    }

    try {
      const url = await BarcodeScannerModule.scan();
      const parsedReceipt = parseReceipt(url);
      navigation.navigate('RemovingMyBusiness', {parsedReceipt});
    } catch (e) {
      console.error(e);

      // @ts-ignore
      if (e.message !== 'User canceled scanning') {
        // @ts-ignore
        Alert.alert('Error', e.message);
      }
    }
  }

  return (
    <>
      {inHistory && inHistory.length > 0 ? (
        <>
          <View style={styles.InfoScreenWrapper}>
            <Title label="Owner’s View" />
            <GeneralPayInfo
              // todo: must be eur
              generalPayAmount={inHistory.reduce(
                (s, i) => (s = s + +i.currencyReceipt),
                0,
              )}
              title={'Paid for invoices'}
              generalPayAmountSubtitle={BASE_FIAT_CURRENCY}
              TipsAmount={inHistory.reduce(
                (s, i) => (s = s + +i.currencyReceipt),
                0,
              )}
              TipsSubtitleRight={BASE_CRYPTO_CURRENCY}
            />
            <GeneralPayInfo
              generalPayAmount={inHistory.reduce(
                (s, i) => (s = s + +i.tipAmount),
                0,
              )}
              title={'Tips'}
              generalPayAmountSubtitle={BASE_CRYPTO_CURRENCY}
            />
            <SwitchBlock
              parameters={'Always start from this page'}
              onPress={setRemember}
              isPress={isRemember}
            />
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.linearGradient}
              colors={['#0dd977', '#1da4ac', '#14c48c']}>
              <TouchableHighlight
                style={styles.buttonSend}
                onPress={handleGmsScanPressBusinessRemoving}>
                <Text style={styles.buttonText}>Remove my business</Text>
              </TouchableHighlight>
            </LinearGradient>
            <View style={styles.list}>
              {inHistory.map((x, i) => {
                return (
                  <HistoryPay
                    key={i}
                    time={new Date(x.timestamp * 1000).toISOString()}
                    company={x.businessId}
                    amount={
                      '+' + x.currencyReceipt + ' ' + BASE_CRYPTO_CURRENCY
                    }
                  />
                );
              })}
            </View>
          </View>
          <Navigation path="home" />
        </>
      ) : (
        <>
          <Title label="Owner’s View" />
          <View style={styles.InfoScreenWrapper}>
            <SwitchBlock
              parameters={'Always start from business page'}
              onPress={setRemember}
              isPress={isRemember}
            />
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
                style={styles.buttonSend}
                onPress={handleGmsScanPressBusiness}>
                <Text style={styles.buttonText}>Connect my business</Text>
              </TouchableHighlight>
            </LinearGradient>
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
    marginTop: 10,
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
    // textAlign: 'center',
    color: '#ffffff',
  },
  buttonSend: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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
  },
});

export default MyBusiness;
