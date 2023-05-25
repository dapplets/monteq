import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { FC } from 'react';

import { PAGE_TITLE } from './common/constants';
import { ParsedReceipt, ParsedEDCON2023Code } from './common/parseReceipt';
import CameraScreen from './components/CameraComponent';
import Navigation from './components/Navigation';
import { CameraProvider } from './contexts/CameraContext';
import { EdconContractProvider } from './contexts/EdconContractContext';
import { MonteqContractProvider } from './contexts/MonteqContractContext';
import { BusinessInfo } from './contexts/MonteqContractContext/MonteqContractContext';
import { useWallet } from './contexts/WalletContext';
import AddingMyBusiness from './screens/AddingMyBusiness';
import HowUse from './screens/HowUse';
import InfoScreen from './screens/InfoScreen';
import MyBusiness from './screens/MyBusiness';
import RemovingMyBusiness from './screens/RemovingMyBuisness';
import SendTokenScreen from './screens/SendTokenScreen';
import TxScreen from './screens/TxScreen';
import WelcomeScreen from './screens/WelcomeScreen';

export type RootStackParamList = {
  InfoScreen: undefined;
  CameraScreen: undefined;
  TxScreen: { parsedReceipt: ParsedReceipt; businessInfo: BusinessInfo };
  WelcomeScreen: undefined;
  CodeScanned: undefined;
  MyBusiness: undefined;
  AddingMyBusiness: { parsedReceipt: ParsedReceipt };
  HowUse: undefined;
  RemovingMyBusiness: undefined;
  SendTokenScreen: { parsedQrCode: ParsedEDCON2023Code };
};

const Tab = createBottomTabNavigator();

export type Props = {
  initialRouteName: string;
};

const Router: FC<Props> = ({ initialRouteName }) => {
  const { isConnected: isWalletConnected } = useWallet();

  if (!isWalletConnected) {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{ headerShown: false }}
          tabBar={() => null}
          detachInactiveScreens
          initialRouteName="WelcomeScreen">
          <Tab.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={{ title: PAGE_TITLE }}
          />
          <Tab.Screen name="HowUse" component={HowUse} options={{ title: PAGE_TITLE }} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <MonteqContractProvider>
      <EdconContractProvider>
        <CameraProvider>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={{ headerShown: false }}
              tabBar={(props) => <Navigation {...props} />}
              detachInactiveScreens
              initialRouteName={initialRouteName}>
              <Tab.Screen
                name="InfoScreen"
                component={InfoScreen}
                options={{ title: PAGE_TITLE }}
              />
              <Tab.Screen
                name="MyBusiness"
                component={MyBusiness}
                options={{ title: PAGE_TITLE }}
              />
              <Tab.Screen
                name="CameraScreen"
                component={CameraScreen}
                options={{ title: PAGE_TITLE }}
              />
              <Tab.Screen name="TxScreen" component={TxScreen} options={{ title: PAGE_TITLE }} />
              <Tab.Screen
                name="AddingMyBusiness"
                component={AddingMyBusiness}
                options={{ title: PAGE_TITLE }}
              />
              <Tab.Screen
                name="RemovingMyBusiness"
                component={RemovingMyBusiness}
                options={{ title: PAGE_TITLE }}
              />
              <Tab.Screen name="HowUse" component={HowUse} options={{ title: PAGE_TITLE }} />
              <Tab.Screen
                name="SendTokenScreen"
                component={SendTokenScreen}
                options={{ title: PAGE_TITLE }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </CameraProvider>
      </EdconContractProvider>
    </MonteqContractProvider>
  );
};

export default Router;
