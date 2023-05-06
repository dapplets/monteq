import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import TimeLabel from '../components/TimeLabel';

const InfoScreen = () => {
  return (
    <View style={styles.InfoScreenWrapper}>
      <Title label="Payment history" />
      <View style={styles.timeNavigation}>
        <TimeLabel time="Day" isActive={true} />
        <TimeLabel time="Week" isActive={false} />
        <TimeLabel time="Month" isActive={false} />
        <TimeLabel time="Year" isActive={false} />
      </View>

      {/* <Text>Logged in</Text> */}
      {/* <Button onPress={handleDisconnectPress} title="Disconnect" /> */}
      {/* <Button onPress={handleScanPress} title="Scan via third-party lib" />
      <Button onPress={handleGmsScanPress} title="Scan via gms (preferred)" /> */}
      <Navigation path="user" />
    </View>
  );
};

const styles = StyleSheet.create({
  InfoScreenWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  timeNavigation: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 'auto',
  },
  wrapperBorder: {},
  clockIcon: {},
  iconLayout: {},
  logOutWrapper: {},
});
export default InfoScreen;
