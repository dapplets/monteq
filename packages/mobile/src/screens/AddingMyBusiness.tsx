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
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {memo, useEffect, useState} from 'react';
import {parseReceipt} from '../common/parseReceipt';
import {RootStackParamList} from '../App';
import PaymentParameters from '../components/PaymentParameters';
import {BASE_FIAT_CURRENCY} from '../common/constants';
import CompanyParameters from '../components/CompanyParameters';
import {useWeb3Modal} from '@web3modal/react-native';
type Props = {
  route: RouteProp<{params: {url: string}}, 'params'>;
};

const AddingMyBusiness: React.FC<Props> = memo(({route}) => {
  const parsedReceipt = parseReceipt(route.params.url);
  const [nameCompany, setNameCompany] = useState('Name Company');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {provider} = useWeb3Modal();
  const {addBusiness, addBusinessTxStatus} = useMonteqContract();
  const [currencyAmount, setCurrencyAmount] = useState(
    parsedReceipt?.currencyReceipt ?? '0',
  );

  useEffect(() => {
    if (!parsedReceipt) {
      navigation.goBack();
    } else {
      setCurrencyAmount('0.01');
    }
  }, [parsedReceipt, navigation]);

  async function handleSendPress() {
    if (!provider || !parsedReceipt) {
      return;
    }
    try {
      addBusiness(parsedReceipt.businessId, nameCompany);
    } catch (error) {
      Alert.alert(error as string);
    } finally {
      //   if (addBusinessTxStatus === 3) {
      navigation.navigate('MyBusiness');
      //   }
    }
  }
  if (!parsedReceipt) {
    return null;
  }
  console.log(nameCompany);
  return (
    <>
      <Title label="Adding my business" />
      <View style={styles.InfoScreenWrapper}>
        <View style={styles.PayInfo}>
          <CompanyParameters
            parameters={'Company'}
            value={nameCompany}
            onChangeValue={setNameCompany}
          />
          <PaymentParameters
            parameters={'Business unit'}
            value={parsedReceipt.businessId}
          />
          <PaymentParameters
            parameters={'Amount'}
            value={`${parsedReceipt.currencyReceipt} ${BASE_FIAT_CURRENCY}`}
          />
          <PaymentParameters parameters={'Date'} value={'26/04/2023 11:13'} />
        </View>

        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.linearGradient}
          colors={['#0dd977', '#1da4ac', '#14c48c']}>
          <TouchableHighlight
            style={styles.buttonSend}
            onPress={handleSendPress}>
            <Text style={styles.buttonText}>It's me. Add the business!</Text>
          </TouchableHighlight>
        </LinearGradient>
      </View>
      <Navigation path="home" />
    </>
  );
});

const styles = StyleSheet.create({
  InfoScreenWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    padding: 10,
  },

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

  PayInfo: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: 10,
    backgroundColor: '#F6F7F8',
    borderRadius: 10,
    marginTop: 10,
  },
});
export default AddingMyBusiness;
