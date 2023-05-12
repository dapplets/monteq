import * as React from 'react';
import {Text, StyleSheet, ScrollView, TouchableHighlight} from 'react-native';
import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {FontFamily} from '../GlobalStyles';
import InfoUseItem from '../components/InfoUseItem';
import {useWeb3Modal} from '@web3modal/react-native';

const info = [
  {
    id: '1',
    title: 'Connect Trust Wallet (there can be a problems with others)',
    description:
      'Eget sed mauris ornare nulla pharetra. Felis fringilla mattis aliquet amet. Habitant pellentesque erat morbi morbi aliquet venenatis in. Duis nunc nec vulputate lorem elementum lobortis mauris molestie lectus. Id parturient scelerisque commodo suscipit in ac. Libero volutpat pretium fermentum ultrices molestie.',
    img: require('../assets/howUseTest1.png'),
  },
  {
    id: '2',
    title: 'Scan QR code to generate transaction for tip and/or payment',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lacus laoreet non curabitur gravida arcu ac. Malesuada proin libero nunc consequat interdum varius sit amet.',
    img: require('../assets/howUseTest1.png'),
  },
  {
    id: '3',
    title: 'Sign transaction as you always dot',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lacus laoreet non curabitur gravida arcu ac. Malesuada proin libero nunc consequat interdum varius sit amet.',
    img: require('../assets/howUseTest1.png'),
  },
];

export type HowUseProps = {};

const HowUse = ({}: HowUseProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {isConnected} = useWeb3Modal();

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
        <TouchableHighlight
          underlayColor={'#3B99FC'}
          activeOpacity={0.5}
          style={styles.back}
          onPress={navigationConnect}>
          <Text style={styles.backText}>Back</Text>
        </TouchableHighlight>
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
