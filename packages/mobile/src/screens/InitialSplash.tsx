import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Border, Color} from '../GlobalStyles';

const InitialSplash = () => {
  return (
    <View style={[styles.initialsplash, styles.bgIconLayout]}>
      <Image
        style={[styles.bgIcon, styles.bgIconLayout]}
        resizeMode="cover"
        source={require('../assets/bg.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bgIconLayout: {
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  },
  bgIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  initialsplash: {
    borderRadius: Border.br_9xs,
    backgroundColor: Color.whitesmoke,
    flex: 1,
    width: '100%',
  },
});

export default InitialSplash;
