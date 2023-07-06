import { NavigationProp, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Text, StyleSheet, ScrollView, TouchableHighlight } from 'react-native';

import { RootStackParamList } from '../Router';
import InfoUseItem from '../components/InfoUseItem';
import Title from '../components/TitlePage';
import { useWallet } from '../contexts/WalletContext';
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
    description: 'Make sure the recipient is ready to accept crypto instead of cash.',
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

const HowUse: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isConnected } = useWallet();

  async function navigationConnect() {
    navigation.navigate('WelcomeScreen');
  }

  return (
    <>
      <ScrollView style={styles.infoScreenWrapperHowUse}>
        {isConnected ? <Title label="How it works?" /> : null}
        <SvgComponentHowBgMain
          style={isConnected ? styles.mainBgHowUse : styles.mainBgNoConnectHowUse}
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
      {isConnected ? null : (
        <TouchableHighlight
          underlayColor="#3B99FC"
          activeOpacity={0.5}
          style={styles.backHowUse}
          onPress={navigationConnect}>
          <Text style={styles.backTextHowUse}>Back</Text>
        </TouchableHighlight>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapperBlockHowUse: {
    height: '100%',
    width: '100%',
  },

  infoScreenWrapperHowUse: {
    display: 'flex',
    width: '100%',
    height: '150%',
    maxHeight: '150%',
    padding: 10,
    overflow: 'scroll',
    marginBottom: 60,
    flexGrow: 1,
  },
  mainBgHowUse: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  mainBgNoConnectHowUse: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
  },
  backHowUse: {
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
  backTextHowUse: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 16,
    color: '#fff',
  },
});

export default HowUse;
