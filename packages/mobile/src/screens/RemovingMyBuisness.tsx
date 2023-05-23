import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { memo, useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableHighlight, Platform } from 'react-native';

import { RootStackParamList } from '../App';
import { FontFamily } from '../GlobalStyles';
import Navigation from '../components/Navigation';
import PaymentParameters from '../components/PaymentParameters';
import Title from '../components/TitlePage';
import TxModal, { TxStatusType } from '../components/TxModal';
import { useMonteqContract } from '../contexts/MonteqContractContext';
import { BusinessInfo, TxStatus } from '../contexts/MonteqContractContext/MonteqContractContext';
import TxStatusModal from '../components/TxStatusModal';

const RemovingMyBusiness: React.FC = memo(() => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    myBusiness,
    removeBusiness,
    removeBusinessTxStatus,
    removeBusinessTxError,
    resetRemoveBusinessTxStatus,
  } = useMonteqContract();

  const [modalVisible, setModalVisible] = useState(false);

  const [savedMyBusiness, setSavedMyBusiness] = useState<BusinessInfo | null>(null);

  useEffect(() => {
    if (myBusiness) {
      setSavedMyBusiness(myBusiness);
    }
  }, [myBusiness]);

  useEffect(() => {
    resetRemoveBusinessTxStatus();
  }, [isFocused, resetRemoveBusinessTxStatus]);

  async function handleCloseButtonPress() {
    setModalVisible(false);
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
      <View style={styles.infoScreenWrapperRemovingMyBusiness}>
        <View style={styles.wrapperTitleRemovingMyBusiness}>
          <Title label="Removing my business" />
        </View>

        <View style={styles.payInfoRemovingMyBusiness}>
          <PaymentParameters parameters="Business unit" value={savedMyBusiness.id} />
          <PaymentParameters parameters="Business name" value={savedMyBusiness.name} />
        </View>

        <TouchableHighlight
          underlayColor="#ca3131"
          activeOpacity={0.5}
          style={styles.buttonRemoveRemovingMyBusiness}
          onPress={handleSendPress}>
          <Text style={styles.buttonRemoveTextRemovingMyBusiness}>Remove my business</Text>
        </TouchableHighlight>
      </View>

      {!modalVisible ? <Navigation path="home" /> : null}

      <TxStatusModal
        isVisible={modalVisible}
        recipientId={savedMyBusiness.id}
        recipientName={savedMyBusiness.name}
        onClose={handleCloseButtonPress}
        onRetry={handleSendPress}
        error={removeBusinessTxError}
        txStatus={removeBusinessTxStatus}
      />
    </>
  );
});

const styles = StyleSheet.create({
  infoScreenWrapperRemovingMyBusiness: {
    display: 'flex',
    width: '100%',
    height: '100%',
    padding: 10,
  },
  wrapperTitleRemovingMyBusiness: {
    display: 'flex',
    width: '100%',
  },
  linearGradientRemovingMyBusiness: {
    display: 'flex',
    borderRadius: 50,
    width: '100%',
  },
  buttonRemoveRemovingMyBusiness: {
    backgroundColor: '#FF3E3E',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  buttonRemoveTextRemovingMyBusiness: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    textDecorationLine: 'underline',
    textDecorationColor: '#fff',
    textDecorationStyle: 'solid',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  payInfoRemovingMyBusiness: {
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
