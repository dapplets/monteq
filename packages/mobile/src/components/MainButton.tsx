import React, {useMemo, memo} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  ImageSourcePropType,
} from 'react-native';
import {FontSize, FontFamily, Color, Border, Padding} from '../GlobalStyles';

type MainButtonType = {
  frame470?: ImageSourcePropType;
  startWithWalletConnect?: string;

  /** Style props */
  mainButtonBackgroundColor?: string;
  mainButtonMarginTop?: number | string;

  /** Action props */
  onMainButtonPress?: () => void;
};

const getStyleValue = (key: string, value: string | number | undefined) => {
  if (value === undefined) return;
  return {[key]: value === 'unset' ? undefined : value};
};
const MainButton = memo(
  ({
    onMainButtonPress,
    mainButtonBackgroundColor,
    mainButtonMarginTop,
    frame470,
    startWithWalletConnect,
  }: MainButtonType) => {
    const mainButtonStyle = useMemo(() => {
      return {
        ...getStyleValue('backgroundColor', mainButtonBackgroundColor),
        ...getStyleValue('marginTop', mainButtonMarginTop),
      };
    }, [mainButtonBackgroundColor, mainButtonMarginTop]);

    return (
      <TouchableHighlight
        style={[styles.mainbutton, mainButtonStyle]}
        underlayColor="#2261a5"
        onPress={onMainButtonPress}>
        <>
          <Image
            style={styles.mainbuttonChild}
            resizeMode="cover"
            source={frame470}
          />
          <Text style={styles.startWithWalletconnect}>
            {startWithWalletConnect}
          </Text>
        </>
      </TouchableHighlight>
    );
  },
);

const styles = StyleSheet.create({
  mainbuttonChild: {
    width: 40,
    height: 40,
    overflow: 'hidden',
  },
  startWithWalletconnect: {
    fontSize: FontSize.semibold_size,
    fontWeight: '700',
    fontFamily: FontFamily.robotoBold,
    color: Color.white,
    textAlign: 'left',
    marginLeft: 10,
  },
  mainbutton: {
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
  },
});

export default MainButton;
