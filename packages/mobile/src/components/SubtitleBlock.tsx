import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type SubtitleBlockType = {
  label: string;
};

const SubtitleBlock = ({ label }: SubtitleBlockType) => {
  return (
    <View style={styles.profileSubtitle}>
      <Text style={styles.profileSubtitleText}>{label}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  profileSubtitle: {
    display: 'flex',
    marginRight: 'auto',
    marginBottom: 10,
  },

  profileSubtitleText: {
    fontSize: 20,
    color: '#222',
    fontWeight: '600',
  },
});
export default SubtitleBlock;
