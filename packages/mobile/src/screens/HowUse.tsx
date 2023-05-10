import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';

import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
// import TimeLabel from '../components/TimeLabel';
import {useMonteqContract} from '../contexts/MonteqContractContext';
import {useEffect} from 'react';
import HistoryPay from '../components/HistoryPay';

const HowUse = () => {
  return (
    <>
      <View style={styles.InfoScreenWrapper}>
        <Title label="How it works?" />
        <View style={styles.list}></View>
      </View>
      <Navigation path="help" />
    </>
  );
};

const styles = StyleSheet.create({
  InfoScreenWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    paddingLeft: 20,
    paddingRight: 20,
  },
  timeNavigation: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 60,
    // paddingLeft: 20,
    // paddingRight: 20,
    // marginBottom: 'auto',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 'auto',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    // marginLeft: 10,
    // marginRight: 40,
  },
  wrapperBorder: {},
  clockIcon: {},
  iconLayout: {},
  logOutWrapper: {},
});
export default HowUse;
