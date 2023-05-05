import React, {memo} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Pressable,
  ImageSourcePropType,
} from 'react-native';
import {Color, Border, Padding} from '../GlobalStyles';
type ButtonNavigationDefaultType = {
  image: ImageSourcePropType;

  onPress?: () => void;
};

const ButtonNavigationDefault = memo(
  ({onPress, image}: ButtonNavigationDefaultType) => {
    return (
      <View style={styles.buttonWrapper}>
        <Pressable style={styles.logOutWrapper} onPress={onPress}>
          <Image
            style={[styles.clockIcon, styles.iconLayout]}
            resizeMode="cover"
            source={image}
          />
        </Pressable>
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
  },
});
export default ButtonNavigationDefault;
