import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { FC } from "react";
import WelcomeScreen from "./screens/WelcomeScreen";
import InfoScreen from "./screens/InfoScreen";
import CameraScreen from "./components/CameraComponent";
import TxScreen from "./screens/TxScreen";
import { MonteqContractProvider } from "./contexts/MonteqContractContext";
import MyBusiness from "./screens/MyBusiness";
import AddingMyBusiness from "./screens/AddingMyBusiness";
import HowUse from "./screens/HowUse";
import RemovingMyBusiness from "./screens/RemovingMyBuisness";
import { ParsedReceipt, ParsedEDCON2023Code } from "./common/parseReceipt";
import { enableScreens } from "react-native-screens";
import { CameraProvider } from "./contexts/CameraContext";
import { BusinessInfo } from "./contexts/MonteqContractContext/MonteqContractContext";
import SendTokenScreen from "./screens/SendTokenScreen";
import { EdconContractProvider } from "./contexts/EdconContractContext";
import * as SplashScreen from "expo-splash-screen";
import { useWallet } from "./contexts/WalletContext";

SplashScreen.preventAutoHideAsync();

enableScreens();

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
  const { isConnected: isWalletConnected, provider } = useWallet();

  if (!isWalletConnected) {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{ headerShown: false }}
          tabBar={() => null}
          detachInactiveScreens
          initialRouteName="WelcomeScreen"
        >
          <Tab.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Tab.Screen name="HowUse" component={HowUse} />
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
              tabBar={() => null}
              detachInactiveScreens
              initialRouteName={initialRouteName}
            >
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
              <Tab.Screen name="SendTokenScreen" component={SendTokenScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </CameraProvider>
      </EdconContractProvider>
    </MonteqContractProvider>
  );
};

export default Router;
