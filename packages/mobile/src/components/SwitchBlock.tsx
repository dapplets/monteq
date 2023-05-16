import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomSwitch from './Switch';
import {FontFamily} from '../GlobalStyles';

export type SwitchBlockType = {
  parameters: string;
  onPress: (x: boolean) => void;
  isPress: boolean;
};

const SwitchBlock: React.FC<SwitchBlockType> = ({
  parameters,
  onPress,
  isPress,
}) => {
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
    fontFamily:
      Platform.OS === 'ios' ? 'roboto_regular.ttf' : FontFamily.robotoRegular,
  },
  Value: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    color: '#222222',
    fontFamily:
      Platform.OS === 'ios' ? 'roboto_bold.ttf' : FontFamily.robotoBold,
  },
});

export default SwitchBlock;
