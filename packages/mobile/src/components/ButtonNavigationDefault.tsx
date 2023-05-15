import React, {ReactNode, memo} from 'react';
import {StyleSheet, View, TouchableHighlight} from 'react-native';

type ButtonNavigationDefaultType = {
  isActive?: boolean;
  onPress?: () => void;
  children: ReactNode;
};

const ButtonNavigationDefault = memo(
  ({onPress, children, isActive}: ButtonNavigationDefaultType) => {
    return (
      <View
        style={isActive ? styles.buttonWrapperActive : styles.buttonWrapper}>
        <TouchableHighlight
          underlayColor={'#14C58B'}
          activeOpacity={0.5}
          style={styles.logOutWrapper}
          onPress={onPress}>
          {children}
        </TouchableHighlight>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: 6,
    borderColor: '#ebebeb',
    flexDirection: 'row',
    backgroundColor: '#F6F7F8',
    shadowColor: '#000',
    borderWidth: 1,
    borderStyle: 'solid',
    width: 44,
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapperActive: {
    borderRadius: 6,
    borderColor: '#14C58B',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    borderWidth: 1,
    borderStyle: 'solid',
    width: 44,
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  clockIcon: {
    overflow: 'hidden',
  },
  iconLayout: {
    height: 24,
    width: 24,
    overflow: 'hidden',
  },
  logOutWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
});

export default ButtonNavigationDefault;
