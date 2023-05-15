import React from 'react';
import {View, TouchableOpacity} from 'react-native';

// ToDo: rename props or types
export type CustomSwitchProps = {
  selectionMode: (x: boolean) => void;
  roundCorner: boolean;
  onSelectSwitch: boolean;
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
          }}></TouchableOpacity>
        <TouchableOpacity
          onPress={updatedSwitchData}
          style={{
            flex: 1,

            backgroundColor: onSelectSwitch ? 'white' : selectionColor,
            borderRadius: roundCorner ? 25 : 0,
          }}></TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomSwitch;
