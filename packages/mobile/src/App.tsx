import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import {Web3Modal, useWeb3Modal} from '@web3modal/react-native';
import {WC_METADATA, WC_PROJECT_ID, WC_RELAY_URL} from './common/constants';
import InfoScreen from './screens/InfoScreen';

export type RootStackParamList = {
  InfoScreen: undefined;
  WelcomeScreen: undefined;
};

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const {isConnected} = useWeb3Modal();

  return (
    <NavigationContainer>
      <Web3Modal
        projectId={WC_PROJECT_ID}
        relayUrl={WC_RELAY_URL}
        providerMetadata={WC_METADATA}
      />

      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isConnected ? (
          <>
            <Stack.Screen name="InfoScreen" component={InfoScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
