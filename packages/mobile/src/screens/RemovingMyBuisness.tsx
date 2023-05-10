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
import {RootStackParamList} from '../App';
import PaymentParameters from '../components/PaymentParameters';
import {useWeb3Modal} from '@web3modal/react-native';
import {
  BusinessInfo,
  TxStatus,
} from '../contexts/MonteqContractContext/MonteqContractContext';
import TxModal, {TxStatusType} from '../components/TxModal';

const RemovingMyBusiness: React.FC = memo(() => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {provider} = useWeb3Modal();
  const {
    myBusiness,
    removeBusiness,
    removeBusinessTxStatus,
    resetRemoveBusinessTxStatus,
  } = useMonteqContract();

  const [modalVisible, setModalVisible] = useState(false);

  const [savedMyBusiness, setSavedMyBusiness] = useState<BusinessInfo | null>(
    null,
  );

  useEffect(() => {
    if (myBusiness) {
      setSavedMyBusiness(myBusiness);
    }
  }, [myBusiness]);

  useEffect(() => {
    resetRemoveBusinessTxStatus();
  }, [isFocused, resetRemoveBusinessTxStatus]);

  async function handleCloseButtonPress() {
    navigation.navigate('MyBusiness');
  }

  async function handleSendPress() {
    if (!provider || !savedMyBusiness) {
      return;
    }

    setModalVisible(true);

    // nameCompany
    removeBusiness(savedMyBusiness.id);
  }

  if (!savedMyBusiness) {
    return null;
  }

  return (
    <>
      <Title label="Removing my business" />
      <View style={styles.InfoScreenWrapper}>
        <View style={styles.PayInfo}>
          <PaymentParameters
            parameters={'Business unit'}
            value={savedMyBusiness.id}
          />
          <PaymentParameters
            parameters={'Business name'}
            value={savedMyBusiness.name}
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

      {!modalVisible ? <Navigation path="home" /> : null}

      {removeBusinessTxStatus === TxStatus.Sending ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction signing"
          status={'Signing'}
          type={TxStatusType.Yellow}
          image={require('../assets/inProgress.png')}
          recipient={savedMyBusiness.id}
          onRequestClose={() => setModalVisible(!modalVisible)}
        />
      ) : null}

      {removeBusinessTxStatus === TxStatus.Mining ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction sent"
          status={'Mining'}
          type={TxStatusType.Yellow}
          image={require('../assets/inProgress.png')}
          recipient={savedMyBusiness.id}
          onRequestClose={() => setModalVisible(!modalVisible)}
        />
      ) : null}

      {removeBusinessTxStatus === TxStatus.Done ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction sent"
          status={'Confirmed'}
          type={TxStatusType.Green}
          image={require('../assets/confirmed.png')}
          recipient={savedMyBusiness.id}
          onRequestClose={() => setModalVisible(!modalVisible)}
          primaryButton="Close"
          onPrimaryButtonPress={handleCloseButtonPress}
        />
      ) : null}

      {removeBusinessTxStatus === TxStatus.Rejected ||
      removeBusinessTxStatus === TxStatus.Failed ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction rejected"
          description="ToDo: write description here"
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
