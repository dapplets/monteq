import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  Image,
  Alert,
} from 'react-native';

import Navigation from '../components/Navigation';
import Title from '../components/TitlePage';
import {useMonteqContract} from '../contexts/MonteqContractContext';
import LinearGradient from 'react-native-linear-gradient';
import SwitchBlock from '../components/SwitchBlock';
import {useEffect} from 'react';
import BarcodeScannerModule from '../modules/BarcodeScannerModule';
import {useWeb3Modal} from '@web3modal/react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';

const MyBusiness = () => {
  const {inHistory, loadMoreInHistory} = useMonteqContract();
  const [isRemember, setRemember] = React.useState(false);
  const {provider} = useWeb3Modal();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  useEffect(() => {
    loadMoreInHistory();
  }, []);
  console.log(inHistory,'MyBusiness');
  async function handleGmsScanPressBusiness() {
    if (!provider) {
      return;
    }

    try {
      const url = await BarcodeScannerModule.scan();
      navigation.navigate('AddingMyBusiness', {url});
    } catch (e) {
      // ToDo: catch CANCELED and FAILURE cases
      console.error(e);
      Alert.alert('Failure or canceled');
    }
  }
  return (
    <>
      <Title label="Owner’s View" />
      <View style={styles.InfoScreenWrapper}>
        <SwitchBlock
          parameters={'Always start from business page'}
          onPress={setRemember}
          isPress={isRemember}
        />
        <Image
          resizeMode="contain"
          style={styles.BusinessImg}
          source={require('../assets/Lines.png')}
        />
        <Text style={styles.DescriptionText}>
          No business is associated with this wallet right now. Connect a
          business to start getting paid in cryptocurrency or log in with the
          right wallet.
        </Text>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.linearGradient}
          colors={['#0dd977', '#1da4ac', '#14c48c']}>
          <TouchableHighlight
            style={styles.buttonSend}
            onPress={handleGmsScanPressBusiness}>
            <Text style={styles.buttonText}>Connect my business</Text>
          </TouchableHighlight>
        </LinearGradient>
      </View>
      <Navigation path="home" />
    </>
  );
};

const styles = StyleSheet.create({
  InfoScreenWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: '#F6F7F8',
    padding: 10,
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
  linearGradient: {
    display: 'flex',
    borderRadius: 50,
    width: '100%',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    // textAlign: 'center',
    color: '#ffffff',
  },
  buttonSend: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  BusinessImg: {
    width: 174,
    height: 158,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 20,
  },
  DescriptionText: {
    fontSize: 12,
    lineHeight: 14,
    color: '#919191',
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
  },
});
export default MyBusiness;
