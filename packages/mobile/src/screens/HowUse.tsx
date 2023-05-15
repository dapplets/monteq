import * as React from 'react';
import {Text, StyleSheet, ScrollView, TouchableHighlight} from 'react-native';
import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {FontFamily} from '../GlobalStyles';
import InfoUseItem from '../components/InfoUseItem';
import {useWeb3Modal} from '@web3modal/react-native';
import SvgComponentHowBgMain from '../icons/SVGHowBgMain';

const info = [
  {
    id: '1',
    title: 'Connect your crypto wallet',
    description:
      'Use WalletConnect to connect MonteQ to your crypto wallet (we recommend Trust Wallet).',
    img: require('../assets/bgHow1.png'),
  },
  {
    id: '2',
    title: 'Negotiate with a business',
    description:
      'Make sure the recipient is ready to accept crypto instead of cash.',
    img: require('../assets/bgHow2.png'),
  },
  {
    id: '3',
    title: 'QR Codes',
    description: 'Scan QR code to generate transaction for tip and/or payment.',
    img: require('../assets/bgHow3.png'),
  },
  {
    id: '4',
    title: 'Confirming transaction',
    description: 'Sign transaction as you always do.',
    img: require('../assets/bgHow4.png'),
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
        <SvgComponentHowBgMain
          style={isConnected ? styles.mainBg : styles.mainBgNoConnect}
        />
        {info.map((x, i) => {
          return (
            <InfoUseItem
              key={i}
              isLast={i === info.length - 1}
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
  wrapperBlock: {
    height: '100%',
    width: '100%',
  },

  InfoScreenWrapper: {
    display: 'flex',
    width: '100%',
    height: '150%',
    maxHeight: '150%',
    padding: 10,
    overflow: 'scroll',
    marginBottom: 60,
    flexGrow: 1,
  },
  mainBg: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  mainBgNoConnect: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
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
});

export default HowUse;
