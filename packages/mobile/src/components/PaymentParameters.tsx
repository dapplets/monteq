import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {FontFamily} from '../GlobalStyles';

export type PaymentParametersType = {
  parameters: string;
  value: string;
  isGray?: boolean;
};

const PaymentParameters: React.FC<PaymentParametersType> = ({
  parameters,
  value,
  isGray,
}) => {
  return (
    <View
      style={isGray ? styles.PaymentParametersGray : styles.PaymentParameters}>
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
  PaymentParametersGray: {
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
  Parameters: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '400',
    color: '#222222',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
  Value: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    color: '#222222',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
});

export default PaymentParameters;
