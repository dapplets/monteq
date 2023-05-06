import {Alert, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomSwitch from './Switch';
export type SwitchBlockType = {
  parameters: string;
  onPress: any;
  isPress: boolean;
  //   value: string;
};
const SwitchBlock = ({parameters, onPress, isPress}: SwitchBlockType) => {
  return (
    <View style={styles.PaymentParameters}>
      <Text style={styles.Parameters}>{parameters}</Text>
      <View>
        <CustomSwitch
          selectionMode={onPress}
          roundCorner={true}
          onSelectSwitch={isPress}
          selectionColor={'#14C58B'}
        />
      </View>
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
export default SwitchBlock;
