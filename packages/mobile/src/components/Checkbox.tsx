import React from 'react';
import { StyleSheet, Image, View, Pressable } from 'react-native';

export type CheckboxType = {
  onPress: () => void;
  isChecked: boolean;
};

const Checkbox = ({ onPress, isChecked }: CheckboxType) => {
  return (
    <View style={styles.containerCheckbox}>
      <Pressable
        style={isChecked ? styles.labelCheckbox : styles.labelCheckboxDefault}
        onPress={onPress}>
        {isChecked ? (
          <Image
            resizeMode="cover"
            source={require('../assets/checked.png')}
            style={styles.imgCheckbox}
          />
        ) : null}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  containerCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  imgCheckbox: {
    width: 8,
    height: 5,
  },
  labelCheckbox: {
    backgroundColor: '#14C58B',
    width: '100%',
    height: '100%',
    borderRadius: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelCheckboxDefault: {
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#777777',
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
});

export default Checkbox;
