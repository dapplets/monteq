import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import React, { FC, useState, useCallback } from 'react';
import { BackHandler, View, StyleSheet, Text, Platform } from 'react-native';
import ButtonNavigationDefault from './ButtonNavigationDefault';
import SvgComponentExit from '../icons/SVGExitCamera';
import Navigation from './Navigation';
import { NavigationContainer } from '@react-navigation/native';
import SvgComponentScanIcon from '../icons/SVGScanIcon';
import { FontFamily } from '../GlobalStyles';
import SvgComponentCameraBorder from '../icons/SVGCameraBorder';

type Props = {
  onQrCodeFound: (data: string) => void;
  onCanceled: () => void;
  onError: (error: Error) => void;
};

const CameraComponent: FC<Props> = ({ onQrCodeFound, onCanceled, onError }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleBackButtonPress = useCallback(() => {
    setTimeout(() => onCanceled(), 500); // ToDo: hack
    return true;
  }, [onCanceled]);
  // async function navigationUserHistory() {
  //   onCanceled();
  // }

  const checkCameraPermission = useCallback(async () => {
    // Use Permissions instead of Camera to workaround the issue
    // https://github.com/expo/expo/issues/7501
    let { status } = await Permissions.getAsync(Permissions.CAMERA); // Camera.getCameraPermissionsAsync();

    if (status === 'undetermined') {
      const result = await Permissions.askAsync(Permissions.CAMERA); // Camera.requestCameraPermissionsAsync();
      status = result.status;

      // if (Platform.OS === "web") {
      //   // Workaround for https://github.com/expo/expo/issues/13431
      //   location.reload();
      // }
    }

    if (status !== 'granted') {
      onError(new Error('Camera Permission Denied'));
    }

    setHasPermission(status === 'granted');
  }, [onError]);

  React.useEffect(() => {
    checkCameraPermission();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);

    return () => backHandler.remove();
  }, [handleBackButtonPress, checkCameraPermission]);

  const handleBarCodeScanned: BarCodeScannedCallback = ({ data }) => {
    setScanned(true);
    onQrCodeFound(data);
  };

  if (hasPermission === null) {
    return null;
  }

  if (hasPermission === false) {
    return null;
  }

  return (
    <>
      <View style={styles.containerCamera}>
        <View style={styles.wrapperCamera}>
          <View style={styles.containerDescription}>
            <SvgComponentScanIcon />
            <Text style={styles.containerDescriptionText}>Scan QR on your receipt</Text>
          </View>
          <View style={styles.container}>
            <SvgComponentCameraBorder style={styles.cameraBorderTopLeft} />
            <SvgComponentCameraBorder style={styles.cameraBorderTopRight} />
            <SvgComponentCameraBorder style={styles.cameraBorderBottomLeft} />
            <SvgComponentCameraBorder style={styles.cameraBorderBottomRight} />
            <Camera
              // style={styles.container}
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              barCodeScannerSettings={{
                barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
              }}
            />
          </View>
        </View>
      </View>

      <View style={styles.cameraScreenBtn}>
        <NavigationContainer>
          <Navigation isCamera path={'Camera'} />
        </NavigationContainer>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerCamera: {
    height: '100%',
    width: '100%',
    aspectRatio: 1,
    alignSelf: 'center',
    backgroundColor: '#000',
    position: 'relative',
  },
  wrapperCamera: {
    margin: 'auto',
    width: 250,
    height: 305,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerDescription: {
    display: 'flex',
    flexDirection: 'row',
    width: 260,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerDescriptionText: {
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
    fontWeight: '600',
    fontSize: 20,
    color: '#fff',
  },
  container: {
    height: 250,
    width: 250,
    padding: 10,
  },
  cameraBorderTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 80,
  },
  cameraBorderTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    transform: [{ scaleX: -1 }],
  },
  cameraBorderBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 80,
    height: 80,
    transform: [{ scaleY: -1 }],
  },
  cameraBorderBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 80,
    height: 80,
    transform: [{ scaleX: -1 }, { scaleY: -1 }],
  },

  cameraScreenBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
  },
});

export default CameraComponent;
