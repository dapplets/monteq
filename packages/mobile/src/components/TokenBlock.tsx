import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode, memo, useEffect, useState } from 'react';
import { StyleSheet, TouchableHighlight, Text } from 'react-native';

type TokenBlockType = {
  onPress?: () => void;
  children: ReactNode;
  title: string;
  onLongPress?: () => void;
  isStatus?: boolean; // ToDo: name looks like enum, rename it.
};

// ToDo: why memo?
const TokenBlock = memo(({ onPress, children, title, onLongPress, isStatus }: TokenBlockType) => {
  // ToDo: refactor as controlled component
  const [isActive, setIsActive] = useState(false);

  // ToDo: what's happening here?
  useEffect(() => {
    isStatus && setIsActive(false);
  }, [isActive, isStatus]);

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.buttonWrapperTokenBlock}
      colors={isActive ? ['#0dd977', '#1da4ac', '#14c48c'] : ['#F6F7F8', '#F6F7F8', '#F6F7F8']}>
      <TouchableHighlight
        underlayColor="#14C58B"
        activeOpacity={0.5}
        style={styles.logOutWrapperTokenBlock}
        onLongPress={() => {
          setIsActive(false);
          onLongPress && onLongPress();
        }}
        onPress={() => {
          setIsActive(true);
          onPress?.();
        }}>
        <>
          {children}

          <Text style={isActive ? styles.titleActiveTokenBlock : styles.titleDefaultTokenBlock}>
            {title}
          </Text>
        </>
      </TouchableHighlight>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  buttonWrapperTokenBlock: {
    display: 'flex',
    flexDirection: 'column',
    padding: 5,
    width: 62,
    borderRadius: 4,
  },
  logOutWrapperTokenBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  titleActiveTokenBlock: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 5,
    lineHeight: 16,
    color: '#ffffff',
  },
  titleDefaultTokenBlock: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    color: '#222222',
    marginTop: 5,
  },
});

export default TokenBlock;
