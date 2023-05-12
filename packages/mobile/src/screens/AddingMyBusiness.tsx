import * as React from 'react';
import {Text, StyleSheet, View, TouchableHighlight} from 'react-native';
import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import {useMonteqContract} from '../contexts/MonteqContractContext';
import LinearGradient from 'react-native-linear-gradient';
import {
  NavigationProp,
  RouteProp,
  useIsFocused,
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
import TxModal, {TxStatusType} from '../components/TxModal';
import {FontFamily} from '../GlobalStyles';

type Props = {
  route: RouteProp<{params: {parsedReceipt: ParsedReceipt}}, 'params'>;
};

const AddingMyBusiness: React.FC<Props> = memo(({route}) => {
  const parsedReceipt = route.params.parsedReceipt;

  const isFocused = useIsFocused();

  const [nameCompany, setNameCompany] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {provider} = useWeb3Modal();
  const {addBusiness, resetAddBusinessTxStatus, addBusinessTxStatus} =
    useMonteqContract();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    resetAddBusinessTxStatus();
  }, [isFocused, resetAddBusinessTxStatus]);

  async function handleCloseButtonPress() {
    navigation.navigate('MyBusiness');
  }

  async function handleSendPress() {
    if (!provider || !parsedReceipt) {
      return;
    }

    setModalVisible(true);

    // nameCompany
    addBusiness(parsedReceipt.businessId, nameCompany);
  }

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
            underlayColor={'#1da4ac'}
            activeOpacity={0.5}
            disabled={nameCompany.length === 0}
            style={styles.buttonSend}
            onPress={handleSendPress}>
            <Text style={styles.buttonText}>It's me. Add the business!</Text>
          </TouchableHighlight>
        </LinearGradient>
      </View>

      {!modalVisible ? <Navigation path="home" /> : null}

      {addBusinessTxStatus === TxStatus.Sending ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction signing"
          status={'Signing'}
          type={TxStatusType.Yellow}
          image={require('../assets/inProgress.png')}
          recipient={parsedReceipt.businessId}
          busienssName={nameCompany}
          onRequestClose={() => setModalVisible(!modalVisible)}
        />
      ) : null}

      {addBusinessTxStatus === TxStatus.Mining ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction sent"
          status={'Mining'}
          type={TxStatusType.Yellow}
          image={require('../assets/inProgress.png')}
          recipient={parsedReceipt.businessId}
          busienssName={nameCompany}
          onRequestClose={() => setModalVisible(!modalVisible)}
        />
      ) : null}

      {addBusinessTxStatus === TxStatus.Done ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction sent"
          status={'Confirmed'}
          type={TxStatusType.Green}
          image={require('../assets/confirmed.png')}
          recipient={parsedReceipt.businessId}
          busienssName={nameCompany}
          onRequestClose={() => setModalVisible(!modalVisible)}
          primaryButton="Close"
          onPrimaryButtonPress={handleCloseButtonPress}
        />
      ) : null}

      {addBusinessTxStatus === TxStatus.Rejected ||
      addBusinessTxStatus === TxStatus.Failed ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction rejected"
          description="ToDo: write description here !!!!!"
          image={require('../assets/errorOccured.png')}
          onRequestClose={() => setModalVisible(!modalVisible)}
          primaryButton="Retry"
          onPrimaryButtonPress={handleSendPress}
          secondaryButton="Close"
          onSecondaryButtonPress={handleCloseButtonPress}
        />
      ) : null}
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
    borderRadius: 50,
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
