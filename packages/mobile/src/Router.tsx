import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { FC } from 'react';

import { PAGE_TITLE } from './common/constants';
import { ParsedReceipt, ParsedEDCON2023Code } from './common/parseReceipt';
import CameraScreen from './components/CameraComponent';
import Navigation from './components/Navigation';
import { CameraProvider } from './contexts/CameraContext';
import { EdconContractProvider } from './contexts/EdconContractContext';
import { useWallet } from './contexts/WalletContext';
import AddingMyBusiness from './screens/AddingMyBusiness';
import HowUse from './screens/HowUse';
import InfoScreen from './screens/InfoScreen';
import MyBusiness from './screens/MyBusiness';
import RemovingMyBusiness from './screens/RemovingMyBuisness';
import SendTokenScreen from './screens/SendTokenScreen';
import TxScreen from './screens/TxScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginRequestScreen from './screens/LoginRequestScreen';
import WhatNextScreen from './screens/WhatNextScreen';

export type RootStackParamList = {
  InfoScreen: undefined;
  CameraScreen: undefined;
  TxScreen: { parsedReceipt: ParsedReceipt };
  WelcomeScreen: undefined;
  CodeScanned: undefined;
  MyBusiness: undefined;
  AddingMyBusiness: { parsedReceipt: ParsedReceipt };
  HowUse: undefined;
  RemovingMyBusiness: undefined;
  SendTokenScreen: { parsedQrCode: ParsedEDCON2023Code };
  ProfileScreen: undefined;
  WhatNextScreen: undefined;
};

const Tab = createBottomTabNavigator();

export type Props = {
  initialRouteName: string;
};

const Router: FC<Props> = ({ initialRouteName }) => {
  const { isConnected: isWalletConnected } = useWallet();

  // if (!isWalletConnected) {
  //   return (
  //     <CameraProvider>
  //       <NavigationContainer>
  //         <Tab.Navigator
  //           screenOptions={{ headerShown: false }}
  //           tabBar={(props) => <Navigation {...props} />}
  //           detachInactiveScreens
  //           initialRouteName="CameraScreen">
  //           <Tab.Screen
  //             name="CameraScreen"
  //             component={CameraScreen}
  //             options={{ title: PAGE_TITLE }}
  //           />
  //           {/* <Tab.Screen name="HowUse" component={HowUse} options={{ title: PAGE_TITLE }} /> */}
  //         </Tab.Navigator>
  //       </NavigationContainer>
  //     </CameraProvider>
  //   );
  // }

  return (
    <EdconContractProvider>
      <CameraProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <Navigation {...props} />}
            detachInactiveScreens
            initialRouteName={initialRouteName}>
            <Tab.Screen
              name="WelcomeScreen"
              component={WelcomeScreen}
              options={{ title: PAGE_TITLE }}
            />
            <Tab.Screen
              name="WhatNextScreen"
              component={WhatNextScreen}
              options={{ title: PAGE_TITLE }}
            />
            <Tab.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{ title: PAGE_TITLE }}
            />

            <Tab.Screen name="MyBusiness" component={MyBusiness} options={{ title: PAGE_TITLE }} />
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
  );
};

export default Router;
