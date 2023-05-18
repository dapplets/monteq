import React, {ReactNode, memo, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FontFamily} from '../GlobalStyles';

type TokenBlockType = {
  onPress?: () => void;
  children: ReactNode;
  title: string;
};

const TokenBlock = memo(({onPress, children, title}: TokenBlockType) => {
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(null);
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={styles.buttonWrapper}
      colors={
        isActive
          ? ['#0dd977', '#1da4ac', '#14c48c']
          : ['#F6F7F8', '#F6F7F8', '#F6F7F8']
      }>
      <TouchableHighlight
        underlayColor={'#14C58B'}
        activeOpacity={0.5}
        style={styles.logOutWrapper}
        onPress={() => {
          setIsActive(true), onPress();
        }}>
        <>
          {children}
          <View style={styles.counter}></View>
          <Text style={isActive ? styles.titleActive : styles.titleDefault}>
            {title}
          </Text>
        </>
      </TouchableHighlight>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: 5,
    width: 62,
    height: 66,
    borderRadius: 4,
  },

  logOutWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  titleActive: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 5,
    lineHeight: 16,
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
  titleDefault: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    color: '#222222',
    marginTop: 5,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
  },
});

export default TokenBlock;
