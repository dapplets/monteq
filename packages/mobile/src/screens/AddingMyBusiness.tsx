import { NavigationProp, RouteProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { memo, useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';

import { RootStackParamList } from '../Router';
import { BASE_FIAT_CURRENCY } from '../common/constants';
import { ParsedReceipt } from '../common/parseReceipt';
import CompanyParameters from '../components/CompanyParameters';
import PaymentParameters from '../components/PaymentParameters';
import Title from '../components/TitlePage';
import TxStatusModal from '../components/TxStatusModal';
import { useAddBusiness } from '../hooks/monteq/useAddBusiness';

type Props = {
  route: RouteProp<{ params: { parsedReceipt: ParsedReceipt } }, 'params'>;
};

const AddingMyBusiness: React.FC<Props> = memo(({ route }) => {
  const parsedReceipt = route.params.parsedReceipt;

  const isFocused = useIsFocused();

  const [nameCompany, setNameCompany] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    send: addBusiness,
    reset: resetAddBusinessTxStatus,
    error: addBusinessTxError,
    status: addBusinessTxStatus,
  } = useAddBusiness();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    resetAddBusinessTxStatus();
  }, [isFocused, resetAddBusinessTxStatus]);

  async function handleCloseButtonPress() {
    setModalVisible(false);
    navigation.navigate('MyBusiness');
  }

  async function handleSendPress() {
    if (!parsedReceipt) {
      return;
    }

    setModalVisible(true);

    // nameCompany
    addBusiness(parsedReceipt.businessId, nameCompany);
  }

  return (
    <>
      <View style={styles.infoScreenWrapperAddingMyBusiness}>
        <Title label="Adding my business" />
        <View style={styles.payInfoAddingMyBusiness}>
          <CompanyParameters
            parameters="Company"
            value={nameCompany}
            onChangeValue={setNameCompany}
          />
          <PaymentParameters parameters="Business unit" value={parsedReceipt.businessId} />
          <PaymentParameters
            parameters="Amount"
            value={`${parsedReceipt.currencyReceipt} ${BASE_FIAT_CURRENCY}`}
          />
          <PaymentParameters
            parameters="Date"
            value={new Date(parsedReceipt.createdAt).toLocaleString()}
          />
        </View>

        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.linearGradientAddingMyBusiness}
          colors={['#0dd977', '#1da4ac', '#14c48c']}>
          <TouchableHighlight
            underlayColor="#1da4ac"
            activeOpacity={0.5}
            disabled={nameCompany.length === 0}
            style={styles.buttonSendAddingMyBusiness}
            onPress={handleSendPress}>
            <Text style={styles.buttonTextAddingMyBusiness}>It's me. Add the business!</Text>
          </TouchableHighlight>
        </LinearGradient>
      </View>

      <TxStatusModal
        isVisible={modalVisible}
        recipientId={parsedReceipt.businessId}
        recipientName={nameCompany}
        onClose={handleCloseButtonPress}
        onRetry={handleSendPress}
        error={addBusinessTxError}
        txStatus={addBusinessTxStatus}
      />
    </>
  );
});

const styles = StyleSheet.create({
  infoScreenWrapperAddingMyBusiness: {
    display: 'flex',
    width: '100%',
    height: '100%',
    padding: 10,
  },
  linearGradientAddingMyBusiness: {
    display: 'flex',
    borderRadius: 50,
    width: '100%',
  },
  buttonTextAddingMyBusiness: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,

    color: '#ffffff',
  },
  buttonSendAddingMyBusiness: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 50,
  },
  payInfoAddingMyBusiness: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    backgroundColor: '#F6F7F8',
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default AddingMyBusiness;
