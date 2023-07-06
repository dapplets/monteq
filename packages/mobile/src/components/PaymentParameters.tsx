import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type PaymentParametersType = {
  parameters: string;
  value: string;
  isGray?: boolean;
};

const PaymentParameters: React.FC<PaymentParametersType> = ({ parameters, value, isGray }) => {
  return (
    <View style={isGray ? styles.paymentParametersGray : styles.paymentParameters}>
      <Text style={styles.parametersPayment}>{parameters}</Text>
      <Text style={styles.valuePayment}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  paymentParameters: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 4,
  },
  paymentParametersGray: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#F6F7F8',
    marginBottom: 10,
    borderRadius: 4,
  },
  parametersPayment: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '400',
    color: '#222222',
  },
  valuePayment: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    color: '#222222',
  },
});

export default PaymentParameters;
