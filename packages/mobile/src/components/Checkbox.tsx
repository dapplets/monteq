import {StyleSheet, Image, View, Pressable} from 'react-native';
import React from 'react';

export type CheckboxType = {
  onPress: () => void;
  isChecked: boolean;
};

const Checkbox = ({onPress, isChecked}: CheckboxType) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={isChecked ? styles.label : styles.labelDefault}
        onPress={onPress}>
        {isChecked ? (
          <Image
            resizeMode="cover"
            source={require('../assets/checked.png')}
            style={styles.ImgCheckbox}
          />
        ) : null}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  ImgCheckbox: {
    width: 8,
    height: 5,
  },
  label: {
    backgroundColor: '#14C58B',
    width: '100%',
    height: '100%',
    borderRadius: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelDefault: {
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: ' #777777',
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
});

export default Checkbox;
