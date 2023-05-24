import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import CustomSwitch from './Switch';
import { FontFamily } from '../GlobalStyles';

export type SwitchBlockType = {
  parameters: string;
  onPress: (x: boolean) => void;
  isPress: boolean;
};

const SwitchBlock: React.FC<SwitchBlockType> = ({ parameters, onPress, isPress }) => {
  return (
    <View style={styles.paymentParametersSwitchBlock}>
      <Text style={styles.parametersSwitchBlock}>{parameters}</Text>
      <View>
        <CustomSwitch
          selectionMode={onPress}
          roundCorner
          onSelectSwitch={isPress}
          selectionColor="#14C58B"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paymentParametersSwitchBlock: {
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
  parametersSwitchBlock: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '400',
    color: '#222222',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoRegular,
  },
});

export default SwitchBlock;
