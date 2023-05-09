import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';

import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import TimeLabel from '../components/TimeLabel';
import {useMonteqContract} from '../contexts/MonteqContractContext';
import {useEffect} from 'react';

const InfoScreen = () => {
  const {outHistory, loadMoreOutHistory} = useMonteqContract();

  useEffect(() => {
    loadMoreOutHistory();
  }, [loadMoreOutHistory]);

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
        {outHistory.map((x, i) => {
          return (
            <View key={i}>
              <Text>{x.currencyReceipt}</Text>
              <Text>{x.businessId}</Text>
              <Text>{new Date(x.timestamp * 1000).toISOString()}</Text>
            </View>
          );
        })}
      </View>
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
