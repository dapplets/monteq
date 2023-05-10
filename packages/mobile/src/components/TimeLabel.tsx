import {
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import React from 'react';
export type TimeLabelType = {
  time: string;
  isActive: boolean;
};
const TimeLabel = ({time, isActive}: TimeLabelType) => {
  return (
    <>
      {isActive ? (
        <Pressable style={styles.timeActive}>
          <View style={styles.timeActiveImg} />
          <Text style={styles.timeActiveText}>{time}</Text>
        </Pressable>
      ) : (
        <TouchableHighlight style={styles.timeDefault}>
          <Text style={styles.timeActiveDefault}>{time}</Text>
        </TouchableHighlight>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  timeActive: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    width: 67,
    height: 38,
    borderRadius: 6,
  },
  timeDefault: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'inherit',
    justifyContent: 'center',
    width: 67,
    height: 38,
    borderColor: '#919191',
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  timeActiveDefault: {
    fontSize: 14,
    lineHeight: 17,
    color: '#919191',
  },
  timeActiveImg: {
    backgroundColor: '#14C58B',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timeActiveText: {
    fontSize: 14,
    lineHeight: 17,
    color: '#14C58B',
    fontWeight: '700',
  },
});
export default TimeLabel;
