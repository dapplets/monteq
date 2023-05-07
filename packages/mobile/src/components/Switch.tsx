import React, {useState} from 'react';

import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

const CustomSwitch = ({
  selectionMode,
  roundCorner,
  onSelectSwitch,
  selectionColor,
}) => {
  //   const [getSelectionMode, setSelectionMode] = useState(selectionMode);
  const [getRoundCorner, setRoundCorner] = useState(roundCorner);

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
          borderRadius: getRoundCorner ? 25 : 0,
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
            borderRadius: getRoundCorner ? 25 : 0,
          }}></TouchableOpacity>
        <TouchableOpacity
          onPress={updatedSwitchData}
          style={{
            flex: 1,

            backgroundColor: onSelectSwitch ? 'white' : selectionColor,
            borderRadius: getRoundCorner ? 25 : 0,
          }}></TouchableOpacity>
      </View>
    </View>
  );
};
export default CustomSwitch;
