import * as React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Color, FontFamily, FontSize} from '../GlobalStyles';
export type TitleType = {
  label: string;
  isCenter?: boolean;
};
const Title = ({label, isCenter}: TitleType) => {
  return (
    <View style={isCenter ? styles.TextWrapperCenter : styles.TextWrapper}>
      <Text style={styles.TitleText}>{label}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  TextWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: 60,
    paddingLeft: 0,
    // marginBottom: 'auto',
  },
  TextWrapperCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 60,
    paddingLeft: 0,
  },
  TitleText: {
    fontFamily: FontFamily.robotoBold,
    color: '#222222',
    fontWeight: '600',
    fontSize: FontSize.size_9xl,
    lineHeight: 28,
  },
});
export default Title;
