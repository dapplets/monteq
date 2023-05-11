import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useState} from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import {Web3Modal, useWeb3Modal} from '@web3modal/react-native';
import {
  IS_OWNER_VIEW_PREFERRED_KEY,
  WC_METADATA,
  WC_PROJECT_ID,
  WC_RELAY_URL,
  WC_SESSION_PARAMS,
} from './common/constants';
import InfoScreen from './screens/InfoScreen';
import CameraScreen from './components/CameraComponent';
import TxScreen from './screens/TxScreen';
import {MonteqContractProvider} from './contexts/MonteqContractContext';
import MyBusiness from './screens/MyBusiness';
import AddingMyBusiness from './screens/AddingMyBusiness';
import HowUse from './screens/HowUse';
import RemovingMyBusiness from './screens/RemovingMyBuisness';
import {ParsedReceipt} from './common/parseReceipt';
import {enableScreens} from 'react-native-screens';
import {CameraProvider} from './contexts/CameraContext';
import SplashScreen from 'react-native-splash-screen';
import {useNetInfo} from '@react-native-community/netinfo';
import {Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

enableScreens();

export type RootStackParamList = {
  InfoScreen: undefined;
  CameraScreen: undefined;
  TxScreen: {parsedReceipt: ParsedReceipt};
  WelcomeScreen: undefined;
  CodeScanned: undefined;
  MyBusiness: undefined;
  AddingMyBusiness: {parsedReceipt: ParsedReceipt};
  HowUse: undefined;
  RemovingMyBusiness: undefined;
};

const Tab = createBottomTabNavigator();

function App(): JSX.Element {
  const {isConnected: isInternetConnected} = useNetInfo();
  const {isConnected: isWalletConnected, provider} = useWeb3Modal();

  const [initialRouteName, setInitialRouteName] = useState<string | null>(null);

  useEffect(() => {
    SplashScreen.hide();

    // ToDo: move to separate hook?
    (async () => {
      try {
        const isOwnerViewPreferred = await AsyncStorage.getItem(
          IS_OWNER_VIEW_PREFERRED_KEY,
        );

        setInitialRouteName(
          isOwnerViewPreferred === 'true' ? 'MyBusiness' : 'InfoScreen',
        );
      } catch (e) {
        console.error(e);
        setInitialRouteName('InfoScreen');
      }
    })();
  }, []);

  if (!isInternetConnected) {
    return (
      <View>
        <Text>ToDo: no internet connection</Text>
      </View>
    );
  }

  return (
    <>
      <Web3Modal
        projectId={WC_PROJECT_ID}
        relayUrl={WC_RELAY_URL}
        providerMetadata={WC_METADATA}
        sessionParams={WC_SESSION_PARAMS}
      />

      {provider && initialRouteName ? (
        <>
          {!isWalletConnected ? (
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={{headerShown: false}}
                tabBar={() => null}
                detachInactiveScreens
                initialRouteName="WelcomeScreen">
                <Tab.Screen name="WelcomeScreen" component={WelcomeScreen} />
                <Tab.Screen name="HowUse" component={HowUse} />
              </Tab.Navigator>
            </NavigationContainer>
          ) : (
            <MonteqContractProvider>
              <CameraProvider>
                <NavigationContainer>
                  <Tab.Navigator
                    screenOptions={{headerShown: false}}
                    tabBar={() => null}
                    detachInactiveScreens
                    initialRouteName={initialRouteName}>
                    <Tab.Screen name="InfoScreen" component={InfoScreen} />
                    <Tab.Screen name="MyBusiness" component={MyBusiness} />
                    <Tab.Screen name="CameraScreen" component={CameraScreen} />
                    <Tab.Screen name="TxScreen" component={TxScreen} />
                    <Tab.Screen
                      name="AddingMyBusiness"
                      component={AddingMyBusiness}
                    />
                    <Tab.Screen
                      name="RemovingMyBusiness"
                      component={RemovingMyBusiness}
                    />
                    <Tab.Screen name="HowUse" component={HowUse} />
                  </Tab.Navigator>
                </NavigationContainer>
              </CameraProvider>
            </MonteqContractProvider>
          )}
        </>
      ) : null}
    </>
  );
}

export default App;
