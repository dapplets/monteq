import * as React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';

import { FontFamily, FontSize } from '../GlobalStyles';

export type TitleType = {
  label: string;
  isCenter?: boolean;
};

const Title = ({ label, isCenter }: TitleType) => {
  return (
    <View style={isCenter ? styles.textWrapperCenterTitle : styles.textWrapperTitle}>
      <Text style={styles.titleText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textWrapperTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: 48,
    paddingLeft: 0,
    paddingTop: 0,
  },
  textWrapperCenterTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 60,
    paddingLeft: 0,
  },
  titleText: {
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
    color: '#222222',
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 24,
  },
});

export default Title;
