import React from 'react';
import { View, TouchableOpacity } from 'react-native';

// ToDo: rename props or types
export type CustomSwitchProps = {
  selectionMode: (x: boolean) => void; // ToDo: `selectionMode` looks like enum
  roundCorner: boolean; // ToDo: should be isRoundCorner if it's boolean
  onSelectSwitch: boolean; // ToDo: `onSelectSwitch` looks like callback
  selectionColor: string;
};

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  selectionMode,
  roundCorner,
  onSelectSwitch,
  selectionColor,
}) => {
  const updatedSwitchData = () => {
    selectionMode(!onSelectSwitch);
  };

  return (
    <View>
      <View
        style={{
          height: 20,
          width: 32,
          backgroundColor: onSelectSwitch ? selectionColor : 'white',
          borderRadius: roundCorner ? 25 : 0,
          borderWidth: 1,
          borderColor: onSelectSwitch ? selectionColor : '#CECECE',
          flexDirection: onSelectSwitch ? 'row' : 'row-reverse',
          justifyContent: 'center',
          padding: 2,
        }}>
        <TouchableOpacity
          onPress={updatedSwitchData}
          style={{
            flex: 1,

            backgroundColor: onSelectSwitch ? selectionColor : 'white',
            borderRadius: roundCorner ? 25 : 0,
          }}
        />
        <TouchableOpacity
          onPress={updatedSwitchData}
          style={{
            flex: 1,

            backgroundColor: onSelectSwitch ? 'white' : selectionColor,
            borderRadius: roundCorner ? 25 : 0,
          }}
        />
      </View>
    </View>
  );
};

export default CustomSwitch;
