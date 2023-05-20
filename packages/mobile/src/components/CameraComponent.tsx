import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import React, { FC, useState, useCallback } from 'react';
import { BackHandler, View, StyleSheet } from 'react-native';
import ButtonNavigationDefault from './ButtonNavigationDefault';
import SvgComponentExit from '../icons/SVGExitCamera';

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
  async function navigationUserHistory() {
    onCanceled();
  }

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
      <View style={styles.container}>
        <Camera
          style={styles.container}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
        />
      </View>

      <View style={styles.cameraScreenBtn}>
        <ButtonNavigationDefault onPress={navigationUserHistory} children={<SvgComponentExit />} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  cameraScreenBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
});

export default CameraComponent;
