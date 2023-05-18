import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useCallback, useEffect, useState } from "react";
import WelcomeScreen from "./screens/WelcomeScreen";
import { Web3Modal, useWeb3Modal } from "@web3modal/react-native";
import {
  IS_OWNER_VIEW_PREFERRED_KEY,
  WC_METADATA,
  WC_PROJECT_ID,
  WC_RELAY_URL,
  WC_SESSION_PARAMS,
} from "./common/constants";
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
// import SplashScreen from 'react-native-splash-screen';
import { useNetInfo } from "@react-native-community/netinfo";
import { SafeAreaView, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BusinessInfo } from "./contexts/MonteqContractContext/MonteqContractContext";
import TxModal from "./components/TxModal";
import SendTokenScreen from "./screens/SendTokenScreen";
import { EdconContractProvider } from "./contexts/EdconContractContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

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

function App() {
  const { isConnected: isInternetConnected } = useNetInfo();
  const { isConnected: isWalletConnected, provider } = useWeb3Modal();

  const [initialRouteName, setInitialRouteName] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    "roboto_black_italic": require("./assets/fonts/roboto_black_italic.ttf"),
    "roboto_black": require("./assets/fonts/roboto_black.ttf"),
    "roboto_bold_italic": require("./assets/fonts/roboto_bold_italic.ttf"),
    "roboto_bold": require("./assets/fonts/roboto_bold.ttf"),
    "roboto_italic": require("./assets/fonts/roboto_italic.ttf"),
    "roboto_light": require("./assets/fonts/roboto_light.ttf"),
    "roboto_medium_italic": require("./assets/fonts/roboto_medium_italic.ttf"),
    "roboto_medium": require("./assets/fonts/roboto_medium.ttf"),
    "roboto_regular": require("./assets/fonts/roboto_regular.ttf"),
    "roboto_thin_italic": require("./assets/fonts/roboto_thin_italic.ttf"),
    "roboto_thin": require("./assets/fonts/roboto_thin.ttf")
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // ToDo: implement after migration to expo
    // SplashScreen.hide();

    // ToDo: move to separate hook?
    (async () => {
      try {
        const isOwnerViewPreferred = await AsyncStorage.getItem(
          IS_OWNER_VIEW_PREFERRED_KEY
        );

        setInitialRouteName(
          isOwnerViewPreferred === "true" ? "MyBusiness" : "InfoScreen"
        );
      } catch (e) {
        console.error(e);
        setInitialRouteName("InfoScreen");
      }
    })();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (!isInternetConnected && initialRouteName) {
    return (
      <View onLayout={onLayoutRootView}>
        <TxModal
          isVisible={true}
          title="Check your connection"
          description="Try turning on your Wi-Fi or Mobile Data for using the app."
          image={require("./assets/noConnection.png")}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
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
                screenOptions={{ headerShown: false }}
                tabBar={() => null}
                detachInactiveScreens
                initialRouteName="WelcomeScreen"
              >
                <Tab.Screen name="WelcomeScreen" component={WelcomeScreen} />
                <Tab.Screen name="HowUse" component={HowUse} />
              </Tab.Navigator>
            </NavigationContainer>
          ) : (
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
                      <Tab.Screen
                        name="CameraScreen"
                        component={CameraScreen}
                      />
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
                      <Tab.Screen
                        name="SendTokenScreen"
                        component={SendTokenScreen}
                      />
                    </Tab.Navigator>
                  </NavigationContainer>
                </CameraProvider>
              </EdconContractProvider>
            </MonteqContractProvider>
          )}
        </>
      ) : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;
