import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';

import { RootStackParamList } from '../App';
import { FontSize, FontFamily, Color, Border, Padding } from '../GlobalStyles';

const HollowButton = memo(() => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  async function navigationConnect() {
    navigation.navigate('HowUse');
  }
  return (
    <TouchableHighlight
      underlayColor="transparent"
      activeOpacity={0.5}
      onPress={navigationConnect}
      style={styles.mainbutton}>
      <Text style={styles.howItWorks}>How it works?</Text>
    </TouchableHighlight>
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
