import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { IS_OWNER_VIEW_PREFERRED_KEY } from "./common/constants";
import { ParsedReceipt, ParsedEDCON2023Code } from "./common/parseReceipt";
import { enableScreens } from "react-native-screens";
import { useNetInfo } from "@react-native-community/netinfo";
import { SafeAreaView, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BusinessInfo } from "./contexts/MonteqContractContext/MonteqContractContext";
import TxModal from "./components/TxModal";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { WalletProvider } from "./contexts/WalletContext";
import Router from "./Router";

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

function App() {
  const { isConnected: isInternetConnected } = useNetInfo();

  const [initialRouteName, setInitialRouteName] = useState<string | null>(null);

  const [fontsLoaded, error] = useFonts({
    roboto_black_italic: require("./assets/fonts/roboto_black_italic.ttf"),
    roboto_black: require("./assets/fonts/roboto_black.ttf"),
    roboto_bold_italic: require("./assets/fonts/roboto_bold_italic.ttf"),
    roboto_bold: require("./assets/fonts/roboto_bold.ttf"),
    roboto_italic: require("./assets/fonts/roboto_italic.ttf"),
    roboto_light: require("./assets/fonts/roboto_light.ttf"),
    roboto_medium_italic: require("./assets/fonts/roboto_medium_italic.ttf"),
    roboto_medium: require("./assets/fonts/roboto_medium.ttf"),
    roboto_regular: require("./assets/fonts/roboto_regular.ttf"),
    roboto_thin_italic: require("./assets/fonts/roboto_thin_italic.ttf"),
    roboto_thin: require("./assets/fonts/roboto_thin.ttf"),
  });

  useEffect(() => {
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
      } finally {
        await SplashScreen.hideAsync();
      }
    })();
  }, []);

  // if (!fontsLoaded) {
  //   return null;
  // }

  if (!isInternetConnected && initialRouteName) {
    return (
      <View>
        <TxModal
          isVisible={true}
          title="Check your connection"
          description="Try turning on your Wi-Fi or Mobile Data for using the app."
          image={require("./assets/noConnection.png")}
        />
      </View>
    );
  }

  if (!initialRouteName) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <WalletProvider>
        <Router initialRouteName={initialRouteName} />
      </WalletProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
