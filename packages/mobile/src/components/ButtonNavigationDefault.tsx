import React, {memo} from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableHighlight,
  ImageSourcePropType,
} from 'react-native';
type ButtonNavigationDefaultType = {
  image?: ImageSourcePropType;

  onPress?: () => void;
  children: any;
};

const ButtonNavigationDefault = memo(
  ({onPress, image, children}: ButtonNavigationDefaultType) => {
    return (
      <View style={styles.buttonWrapper}>
        <TouchableHighlight
          underlayColor={'#14C58B'}
          activeOpacity={0.5}
          style={styles.logOutWrapper}
          onPress={onPress}>
          {/* <Image
            style={[styles.clockIcon, styles.iconLayout]}
            resizeMode="cover"
            source={image}
          /> */}
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
