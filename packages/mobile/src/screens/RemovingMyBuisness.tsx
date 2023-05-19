import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  Platform,
} from 'react-native';
import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import {useMonteqContract} from '../contexts/MonteqContractContext';
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {memo, useEffect, useState} from 'react';
import {RootStackParamList} from '../App';
import PaymentParameters from '../components/PaymentParameters';
import {
  BusinessInfo,
  TxStatus,
} from '../contexts/MonteqContractContext/MonteqContractContext';
import TxModal, {TxStatusType} from '../components/TxModal';
import {FontFamily} from '../GlobalStyles';

const RemovingMyBusiness: React.FC = memo(() => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
    if (!savedMyBusiness) {
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
      <View style={styles.InfoScreenWrapper}>
        <View style={styles.wrapperTitle}>
          <Title label="Removing my business" />
        </View>

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

        <TouchableHighlight
          underlayColor={'#ca3131'}
          activeOpacity={0.5}
          style={styles.buttonRemove}
          onPress={handleSendPress}>
          <Text style={styles.buttonRemoveText}>Remove my business</Text>
        </TouchableHighlight>
      </View>

      {!modalVisible ? <Navigation path="home" /> : null}

      {removeBusinessTxStatus === TxStatus.Sending ? (
        <TxModal
          isVisible={modalVisible}
          title="Transaction signing"
          status={'Signing'}
          type={TxStatusType.Yellow}
          image={require('../assets/inProgress.png')}
          recipientId={savedMyBusiness.id}
          recipientName={savedMyBusiness.name}
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
          recipientId={savedMyBusiness.id}
          recipientName={savedMyBusiness.name}
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
          recipientId={savedMyBusiness.id}
          recipientName={savedMyBusiness.name}
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
          description="You have rejected the transaction in the wallet"
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
  wrapperTitle: {
    display: 'flex',
    width: '100%',
  },
  linearGradient: {
    display: 'flex',
    borderRadius: 50,
    width: '100%',
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
  PayInfo: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: 10,
    backgroundColor: '#F6F7F8',
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default RemovingMyBusiness;
