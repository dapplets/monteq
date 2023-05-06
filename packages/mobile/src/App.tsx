import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
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
import CameraScreen from './screens/CameraScreen';
import TxScreen from './screens/TxScreen';
import {View} from 'react-native';
import {usePatchedWeb3Modal} from './hooks/usePatchedWeb3Modal';
import {MonteqContractProvider} from './contexts/MonteqContractContext';

export type RootStackParamList = {
  InfoScreen: undefined;
  CameraScreen: undefined;
  TxScreen: {url: string};
  WelcomeScreen: undefined;
  CodeScanned: undefined;
};

const Stack = createNativeStackNavigator();

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
          <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              {isConnected ? (
                <>
                  <Stack.Screen name="InfoScreen" component={InfoScreen} />
                  <Stack.Screen name="CameraScreen" component={CameraScreen} />
                  <Stack.Screen name="TxScreen" component={TxScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen
                    name="WelcomeScreen"
                    component={WelcomeScreen}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </MonteqContractProvider>
      ) : null}

      {/* ToDo: Add splashscreen ^ */}
    </>
  );
}

export default App;
