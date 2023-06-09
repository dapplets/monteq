import React, { Dispatch, SetStateAction } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { FontFamily } from '../GlobalStyles';

export type CompanyParametersType = {
  parameters: string;
  value: string;
  isGray?: boolean;
  onChangeValue: Dispatch<SetStateAction<string>>;
};

const CompanyParameters = ({ parameters, value, isGray, onChangeValue }: CompanyParametersType) => {
  return (
    <View style={isGray ? styles.PaymentParametersGray : styles.PaymentParameters}>
      <Text style={styles.Parameters}>{parameters}</Text>
      <TextInput
        autoFocus
        numberOfLines={1}
        placeholder="Enter Name"
        value={value}
        maxLength={12}
        onChangeText={onChangeValue}
        style={styles.Value}
      />
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
    backgroundColor: '#fff',
    padding: 2,
    margin: 0,
    textAlign: 'right',
    width: 100,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
});

export default CompanyParameters;
