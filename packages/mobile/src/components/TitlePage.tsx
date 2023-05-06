import * as React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Color, FontFamily, FontSize} from '../GlobalStyles';
export type TitleType = {
  label: string;
};
const Title = ({label}: TitleType) => {
  return (
    <View style={styles.TextWrapper}>
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
    paddingLeft: 20,
    // marginBottom: 'auto',
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
