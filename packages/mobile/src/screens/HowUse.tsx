import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Pressable,
  ScrollView,
  FlatList,
} from 'react-native';

import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {usePatchedWeb3Modal} from '../hooks/usePatchedWeb3Modal';
import {FontFamily} from '../GlobalStyles';
import InfoUseItem from '../components/InfoUseItem';

export type HowUseType = {};
const info = [
  {
    id: '1',
    title: 'Amet scelerisque pretium ultrices ac.',
    description:
      'Eget sed mauris ornare nulla pharetra. Felis fringilla mattis aliquet amet. Habitant pellentesque erat morbi morbi aliquet venenatis in. Duis nunc nec vulputate lorem elementum lobortis mauris molestie lectus. Id parturient scelerisque commodo suscipit in ac. Libero volutpat pretium fermentum ultrices molestie.',
    img: require('../assets/howUseTest1.png'),
  },
  {
    id: '2',
    title: 'Eget sed mauris ornare nulla pharetra.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lacus laoreet non curabitur gravida arcu ac. Malesuada proin libero nunc consequat interdum varius sit amet.',
    img: require('../assets/howUseTest1.png'),
  },
];
const HowUse = ({}: HowUseType) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {isConnected} = usePatchedWeb3Modal();
  async function navigationConnect() {
    navigation.navigate('WelcomeScreen');
  }
  return (
    <>
      <ScrollView style={styles.InfoScreenWrapper}>
        {isConnected ? <Title label="How it works?" /> : null}

        {info.map((x, i) => {
          return (
            <InfoUseItem
              key={i}
              title={x.title}
              description={x.description}
              img={x.img}
            />
          );
        })}
      </ScrollView>
      {isConnected ? (
        <Navigation path="help" />
      ) : (
        <Pressable style={styles.back} onPress={navigationConnect}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      )}
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
    overflow: 'scroll',
    marginBottom: 60,
  },

  back: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 247,
    height: 48,
    bottom: 10,
    backgroundColor: '#3B99FC',
    borderRadius: 50,
    alignSelf: 'center',
  },
  backText: {
    fontFamily: FontFamily.robotoBold,
    fontSize: 14,
    lineHeight: 16,
    color: '#fff',
  },
  logOutWrapper: {},
});
export default HowUse;
