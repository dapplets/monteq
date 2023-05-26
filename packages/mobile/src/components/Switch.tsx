import React from 'react';
import { View, TouchableOpacity } from 'react-native';

// ToDo: rename props or types
export type CustomSwitchProps = {
  getSelectionMode: (x: boolean) => void; // ToDo: `selectionMode` looks like enum
  isRoundCorner: boolean; // ToDo: should be isisRoundCorner if it's boolean
  isSelectSwitch: boolean; // ToDo: `onSelectSwitch` looks like callback
  selectionColor: string;
};

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  getSelectionMode,
  isRoundCorner,
  isSelectSwitch,
  selectionColor,
}) => {
  const updatedSwitchData = () => {
    getSelectionMode(!isSelectSwitch);
  };

  return (
    <View>
      <View
        style={{
          height: 20,
          width: 32,
          backgroundColor: isSelectSwitch ? selectionColor : 'white',
          borderRadius: isRoundCorner ? 25 : 0,
          borderWidth: 1,
          borderColor: isSelectSwitch ? selectionColor : '#CECECE',
          flexDirection: isSelectSwitch ? 'row' : 'row-reverse',
          justifyContent: 'center',
          padding: 2,
        }}>
        <TouchableOpacity
          onPress={updatedSwitchData}
          style={{
            flex: 1,

            backgroundColor: isSelectSwitch ? selectionColor : 'white',
            borderRadius: isRoundCorner ? 25 : 0,
          }}
        />
        <TouchableOpacity
          onPress={updatedSwitchData}
          style={{
            flex: 1,

            backgroundColor: isSelectSwitch ? 'white' : selectionColor,
            borderRadius: isRoundCorner ? 25 : 0,
          }}
        />
      </View>
    </View>
  );
};

export default CustomSwitch;
