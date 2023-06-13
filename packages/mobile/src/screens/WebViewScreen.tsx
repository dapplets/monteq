import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, Platform, SafeAreaView,View,TouchableOpacity,Text } from 'react-native';
import { WebView } from 'react-native-webview';

import { FontFamily } from '../GlobalStyles';

const WEBVIEW_TEST_URL = 'https://metamask.github.io/test-dapp/';

const js = `
  setTimeout(function () {
    window.ReactNativeWebView.postMessage("Hello from WebView!")
  }, 2000);

  // true is required for Android. It's explained in the issue
  // https://github.com/react-native-webview/react-native-webview/issues/2980
  window.addEventListener("message", message => {
    window.ReactNativeWebView.postMessage(message.data) 
  }, true);

  true;
`;

const WebViewScreen: React.FC = () => {
  const isFocused = useIsFocused();
  const webViewRef = React.useRef<WebView>(null);

  function sendDataToWebView() {
    // postMessage is deprecated and we should use injectJavascript
    webViewRef.current!.postMessage('Data from React Native App');
  }

  if (!isFocused) return null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => sendDataToWebView()}
          style={{
            padding: 20,
            width: 300,
            marginTop: 100,
            backgroundColor: '#6751ff',
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 20, color: 'white' }}>Send Data To WebView / Website</Text>
        </TouchableOpacity>
      </View>
      <WebView
        injectedJavaScript={js}
        style={styles.container}
        source={{ uri: WEBVIEW_TEST_URL }}
        onMessage={(event) => {
          alert(event.nativeEvent.data);
        }}
        ref={webViewRef}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  wrapperBlockHowUse: {
    height: '100%',
    width: '100%',
  },

  infoScreenWrapperHowUse: {
    display: 'flex',
    width: '100%',
    height: '150%',
    maxHeight: '150%',
    padding: 10,
    overflow: 'scroll',
    marginBottom: 60,
    flexGrow: 1,
  },
  mainBgHowUse: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  mainBgNoConnectHowUse: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
  },
  backHowUse: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 247,
    height: 48,
    bottom: 10,
    backgroundColor: '#3B99FC',
    borderRadius: 50,
    alignSelf: 'center',
  },
  backTextHowUse: {
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
    fontSize: 14,
    lineHeight: 16,
    color: '#fff',
  },
});

export default WebViewScreen;
