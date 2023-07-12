import * as React from 'react';
import { useState } from 'react';
import { View, StyleSheet, Image, TouchableHighlight, ScrollView } from 'react-native';

import Title from '../components/TitlePage';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import SubtitleBlock from '../components/SubtitleBlock';
import EventItem from '../components/EventItem';
import ModalClaimEvent from '../components/ModalClaimEvent';
import ModalClaimed from '../components/ModalClaimed';
const TEST_EVENTS = [
  {
    id: '1',
    name: 'Egestas lacinia',
    img: require('../assets/test_img/next_1.png'),
    time: 'Starts in 15min',
    description:
      'Quam adipiscing massa sapien ultricies. Ac facilisis venenatis mollis nibh aliquam morbi. ',
    from: '40m from Cafe “Almare”',
  },
  {
    id: '2',
    name: 'Luctus',
    img: require('../assets/test_img/next_2.png'),
    time: 'Starts in 15min',
    description:
      'Quam adipiscing massa sapien ultricies. Ac facilisis venenatis mollis nibh aliquam morbi. ',
    from: '40m from Cafe “Almare”',
  },
  {
    id: '3',
    name: 'Mi velit arcu',
    img: require('../assets/test_img/next_3.png'),
    time: 'Starts in 15min',
    description:
      'Quam adipiscing massa sapien ultricies. Ac facilisis venenatis mollis nibh aliquam morbi. ',
    from: '40m from Cafe “Almare”',
  },
];

const WhatNextScreen: React.FC<BottomTabBarProps> = ({ navigation }) => {
  const [isClaimEvent, setClaimEvent] = useState(false);
  const [isClaimed, setClaimed] = useState(false);
  function handleProfileScreen() {
    navigation.navigate('ProfileScreen');
  }

  function handleBack() {
    navigation.navigate('ProfileScreen');
  }
  const openClaimEventModal = () => {
    setClaimEvent(true);
  };
  const claimedEvent = () => {
    setClaimEvent(false);
    openIsClamedModal();
  };
  const closeClaimEventModal= () => {
    setClaimEvent(false);
  };

  const openIsClamedModal = () => {
    setClaimed(true);
  };
  const closeIsClamedModal = () => {
    setClaimed(false);
  };
  React.useEffect(() => {}, []);

  return (
    <>
      <ScrollView style={styles.infoScreenWrapperInfoScreen}>
        {/* title */}
        <View style={styles.wrapperTitleInfoScreen}>
          <View style={styles.profileTitle}>
            <TouchableHighlight
              underlayColor="transparent"
              activeOpacity={0.5}
              onPress={handleBack}
              style={styles.arrowLeftTitleProfile}>
              <Image
                style={styles.shareImgInfoScreen}
                resizeMode="contain"
                source={require('../assets/arrow_left.png')}
              />
            </TouchableHighlight>
            <Title label="What's next" />
          </View>

          <TouchableHighlight
            underlayColor="transparent"
            activeOpacity={0.5}
            onPress={handleProfileScreen}
            style={styles.shareInfoScreen}>
            <Image
              style={styles.shareImgInfoScreen}
              resizeMode="contain"
              source={require('../assets/new_close.png')}
            />
          </TouchableHighlight>
        </View>

        {/* subtitle */}

        <SubtitleBlock label="Upcoming events" />
        {/* Upcoming events */}
        <View style={styles.profileEvents}>
          {TEST_EVENTS.map((x, i) => (
            <View key={i}>
              <EventItem
                img={x.img}
                name={x.name}
                time={x.time}
                description={x.description}
                from={x.from}
                openClaimEventModal={openClaimEventModal}
              />
              <ModalClaimEvent
                isClaimEvent={isClaimEvent}
                claimedEvent={claimedEvent}
                name={x.name}
                img={x.img}
                from={x.from}
                time={x.time}
                description={x.description}
                closeClaimEventModal={closeClaimEventModal}
              />
              <ModalClaimed
                isClaimed={isClaimed}
                closeIsClamedModal={closeIsClamedModal}
                name={x.name}
                img={x.img}
                from={x.from}
                time={x.time}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  infoScreenWrapperInfoScreen: {
    display: 'flex',
    width: '100%',
    height: '100%',
    padding: 10,

    backgroundColor: '#fff',
  },

  profileTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowLeftTitleProfile: {
    backgroundColor: 'transparent',
    width: 24,
    height: 24,
    marginRight: 10,
  },

  wrapperTitleInfoScreen: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 7,
    paddingRight: 7,
  },
  shareInfoScreen: {
    backgroundColor: 'transparent',
    width: 24,
    height: 24,
  },
  shareImgInfoScreen: {
    width: 24,
    height: 24,
  },

  //   news
  profileEvents: {
    paddingLeft: 7,
    paddingRight: 7,
  },
});

export default WhatNextScreen;
