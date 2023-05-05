import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import Navigation from '../components/Navigation';

const InfoScreen = () => {
  return (
    <View style={styles.InfoScreenWrapper}>
      {/* <Text>Logged in</Text> */}
      {/* <Button onPress={handleDisconnectPress} title="Disconnect" /> */}
      {/* <Button onPress={handleScanPress} title="Scan via third-party lib" />
      <Button onPress={handleGmsScanPress} title="Scan via gms (preferred)" /> */}
      <Navigation />
    </View>
  );
};

const styles = StyleSheet.create({
  InfoScreenWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  frameParentPosition: {},
  wrapperBorder: {},
  clockIcon: {},
  iconLayout: {},
  logOutWrapper: {},
});
export default InfoScreen;
