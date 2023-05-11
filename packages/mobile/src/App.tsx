import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import {Web3Modal} from '@web3modal/react-native';
import {
  WC_METADATA,
  WC_PROJECT_ID,
  WC_RELAY_URL,
  WC_SESSION_PARAMS,
} from './common/constants';
import InfoScreen from './screens/InfoScreen';
import CameraScreen from './components/CameraComponent';
import TxScreen from './screens/TxScreen';
import {View} from 'react-native';
import {usePatchedWeb3Modal} from './hooks/usePatchedWeb3Modal';
import {MonteqContractProvider} from './contexts/MonteqContractContext';
import MyBusiness from './screens/MyBusiness';
import AddingMyBusiness from './screens/AddingMyBusiness';
import HowUse from './screens/HowUse';
import RemovingMyBusiness from './screens/RemovingMyBuisness';
import {ParsedReceipt} from './common/parseReceipt';
import {enableScreens} from 'react-native-screens';
import {CameraProvider} from './contexts/CameraContext';

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
  const {isConnected, isOpen, isLoading} = usePatchedWeb3Modal();

  return (
    <>
      <View style={{display: isOpen ? undefined : 'none'}}>
        <Web3Modal
          projectId={WC_PROJECT_ID}
          relayUrl={WC_RELAY_URL}
          providerMetadata={WC_METADATA}
          sessionParams={WC_SESSION_PARAMS}
        />
      </View>

      {!isLoading ? (
        <MonteqContractProvider>
          <CameraProvider>
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={{headerShown: false}}
                tabBar={() => null}
                detachInactiveScreens>
                {isConnected ? (
                  <>
                    <Tab.Screen name="InfoScreen" component={InfoScreen} />
                    <Tab.Screen name="TxScreen" component={TxScreen} />
                    <Tab.Screen name="MyBusiness" component={MyBusiness} />
                    <Tab.Screen
                      name="AddingMyBusiness"
                      component={AddingMyBusiness}
                    />
                    <Tab.Screen
                      name="RemovingMyBusiness"
                      component={RemovingMyBusiness}
                    />
                    <Tab.Screen name="HowUse" component={HowUse} />
                  </>
                ) : (
                  <>
                    <Tab.Screen
                      name="WelcomeScreen"
                      component={WelcomeScreen}
                    />
                  </>
                )}
              </Tab.Navigator>
            </NavigationContainer>
          </CameraProvider>
        </MonteqContractProvider>
      ) : null}

      {/* ToDo: Add splashscreen ^ */}
    </>
  );
}

export default App;
