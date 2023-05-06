import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
export type PaymentParametersType = {
  parameters: string;
  value: string;
};
const PaymentParameters = ({parameters, value}: PaymentParametersType) => {
  return (
    <View style={styles.PaymentParameters}>
      <Text style={styles.Parameters}>{parameters}</Text>
      <Text style={styles.Value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  PaymentParameters: {
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
  Parameters: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '400',
    color: '#222222',
  },
  Value: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    color: '#222222',
  },
});
export default PaymentParameters;
