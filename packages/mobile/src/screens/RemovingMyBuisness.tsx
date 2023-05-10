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
import {ParsedReceipt} from '../common/parseReceipt';
import {RootStackParamList} from '../App';
import PaymentParameters from '../components/PaymentParameters';
import {BASE_FIAT_CURRENCY} from '../common/constants';
import CompanyParameters from '../components/CompanyParameters';
import {useWeb3Modal} from '@web3modal/react-native';
import {TxStatus} from '../contexts/MonteqContractContext/MonteqContractContext';
import {FontFamily} from '../GlobalStyles';
type Props = {
  route: RouteProp<{params: {parsedReceipt: ParsedReceipt}}, 'params'>;
};

const RemovingMyBusiness: React.FC<Props> = memo(({route}) => {
  const parsedReceipt = route.params.parsedReceipt;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {provider} = useWeb3Modal();
  const {
    removeBusiness,

    removeBusinessTxStatus,
  } = useMonteqContract();

  useEffect(() => {
    // ToDo: show popup about invalid receipt
    if (!parsedReceipt) {
      navigation.goBack();
    }
  }, [parsedReceipt, navigation]);

  useEffect(() => {
    if (removeBusinessTxStatus === TxStatus.Done) {
      navigation.navigate('MyBusiness');
    }
  }, [removeBusinessTxStatus, navigation]);

  async function handleSendPress() {
    if (!provider || !parsedReceipt) {
      return;
    }
    // nameCompany
    removeBusiness(parsedReceipt.businessId);
  }

  if (!parsedReceipt) {
    // ToDo: invalid receipt
    return null;
  }

  return (
    <>
      <Title label="Removing my business" />
      <View style={styles.InfoScreenWrapper}>
        <View style={styles.PayInfo}>
          <PaymentParameters
            parameters={'Business unit'}
            value={parsedReceipt.businessId}
          />
          <PaymentParameters
            parameters={'Amount'}
            value={`${parsedReceipt.currencyReceipt} ${BASE_FIAT_CURRENCY}`}
          />
          <PaymentParameters
            parameters={'Date'}
            value={new Date(parsedReceipt.createdAt).toLocaleString()}
          />
        </View>

        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.linearGradient}
          colors={['#0dd977', '#1da4ac', '#14c48c']}>
          <TouchableHighlight
            style={styles.buttonSend}
            onPress={handleSendPress}>
            <Text style={styles.buttonText}>It's me. Remove the business!</Text>
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
    fontFamily: FontFamily.robotoBold,
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

export default RemovingMyBusiness;
