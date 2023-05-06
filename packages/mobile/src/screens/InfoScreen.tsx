import * as React from 'react';
import {Button, Text, FlatList, StyleSheet, View} from 'react-native';

import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import TimeLabel from '../components/TimeLabel';
import {useMonteqContract} from '../contexts/MonteqContractContext';

const InfoScreen = () => {
  const {outHistory, loadMoreOutHistory} = useMonteqContract();
  return (
    <View style={styles.InfoScreenWrapper}>
      <Title label="Payment history" />
      <View style={styles.timeNavigation}>
        <TimeLabel time="Day" isActive={true} />
        <TimeLabel time="Week" isActive={false} />
        <TimeLabel time="Month" isActive={false} />
        <TimeLabel time="Year" isActive={false} />
      </View>
      <View style={styles.list}>
        <FlatList
          data={outHistory.map(x => ({
            key: `${x.currencyReceipt} EUR to ${x.businessId} at ${new Date(
              x.timestamp * 1000,
            ).toISOString()}`,
          }))}
          renderItem={({item}) => <Text>{item.key}</Text>}
        />
        <Button onPress={() => loadMoreOutHistory()} title="Refresh" />
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
  list: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 300,
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
