import React, {memo} from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {FontSize, FontFamily, Color, Border, Padding} from '../GlobalStyles';

const HollowButton = memo(() => {
  return (
    <Pressable style={styles.mainbutton}>
      <Text style={styles.howItWorks}>How it works?</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  howItWorks: {
    fontSize: FontSize.semibold_size,
    textDecorationLine: 'underline',
    fontWeight: '700',
    fontFamily: FontFamily.robotoBold,
    color: Color.gray_300,
    textAlign: 'left',
  },
  mainbutton: {
    alignSelf: 'stretch',
    borderRadius: Border.br_31xl,
    height: 48,
    overflow: 'hidden',
    flexDirection: 'row',
    paddingHorizontal: Padding.p_xl,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default HollowButton;
