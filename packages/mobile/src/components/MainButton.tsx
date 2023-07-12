import React, { useMemo, memo } from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, ImageSourcePropType } from 'react-native';

import { FontSize, Color, Border, Padding } from '../GlobalStyles';

type MainButtonType = {
  image: ImageSourcePropType;
  label?: string;

  /** Style props */
  mainButtonBackgroundColor?: string;
  mainButtonMarginTop?: number | string;

  /** Action props */
  onPress?: () => void;
};

const getStyleValue = (key: string, value: string | number | undefined) => {
  if (value === undefined) {
    return;
  }

  return { [key]: value === 'unset' ? undefined : value };
};

const MainButton = memo(
  ({
    onPress,
    mainButtonBackgroundColor,
    mainButtonMarginTop,
    image,
    label: startWithWalletConnect,
  }: MainButtonType) => {
    const mainButtonStyle = useMemo(() => {
      return {
        ...getStyleValue('backgroundColor', mainButtonBackgroundColor),
        ...getStyleValue('marginTop', mainButtonMarginTop),
      };
    }, [mainButtonBackgroundColor, mainButtonMarginTop]);

    return (
      <TouchableHighlight
        style={[styles.mainButton, mainButtonStyle]}
        underlayColor="#2261a5"
        onPress={onPress}>
        <>
          <Image style={styles.mainButtonChild} resizeMode="cover" source={image} />
          <Text style={styles.startWithWalletconnect}>{startWithWalletConnect}</Text>
        </>
      </TouchableHighlight>
    );
  }
);

const styles = StyleSheet.create({
  mainButtonChild: {
    width: 24,
    height: 24,
    overflow: 'hidden',
    
  },
  startWithWalletconnect: {
    fontSize: FontSize.semibold_size,
    fontWeight: '600',

    color: Color.white,
    textAlign: 'left',
    marginLeft: 10,
  },
  mainButton: {
    alignSelf: 'stretch',
    borderRadius: Border.br_31xl,
    backgroundColor: Color.dodgerblue,
    height: 48,
    flexDirection: 'row',
    paddingHorizontal: Padding.p_xl,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 10,
  },
});

export default MainButton;
