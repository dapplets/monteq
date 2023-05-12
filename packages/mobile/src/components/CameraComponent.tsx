import React, {FC, useCallback, useState} from 'react';
import {BackHandler, StyleSheet, Text, View} from 'react-native';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {RNHoleView} from 'react-native-hole-view';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';

type Props = {
  onQrCodeFound: (data: string) => void;
  onCanceled: () => void;
  onError: (error: Error) => void;
};

const CameraComponent: FC<Props> = ({onQrCodeFound, onCanceled, onError}) => {
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

  const [hasPermission, setHasPermission] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const handleBackButtonPress = useCallback(() => {
    setIsActive(false);
    setTimeout(() => onCanceled(), 500); // ToDo: hack
    return true;
  }, [onCanceled]);

  const checkCameraPermission = useCallback(async () => {
    // const status = await Camera.getCameraPermissionStatus();
    const status = await Camera.requestCameraPermission();

    if (status !== 'authorized') {
      onError(new Error('Camera Permission Denied'));
    } else {
      setIsActive(true);
    }

    setHasPermission(status === 'authorized');
  }, [onError]);

  React.useEffect(() => {
    checkCameraPermission();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );

    return () => backHandler.remove();
  }, [handleBackButtonPress, checkCameraPermission]);

  React.useEffect(() => {
    if (barcodes && barcodes.length > 0 && result === null) {
      if (!barcodes[0].rawValue) {
        return;
      }

      setResult(barcodes[0].rawValue);
    }
  }, [barcodes, result]);

  React.useEffect(() => {
    if (result) {
      setIsActive(false);
      setTimeout(() => onQrCodeFound(result), 1000);
    }
  }, [onQrCodeFound, result]);

  if (!hasPermission) {
    return null;
  }

  if (device == null) {
    return null;
  }

  // ToDo: add close scanning button !!!!!

  return (
    <>
      <Camera
        style={styles.container}
        device={device}
        isActive={isActive}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        audio={false}
        onError={onError}
      />
      <RNHoleView
        holes={[
          {
            x: widthToDP('10%'),
            y: heightToDP('30%'),
            width: widthToDP('80%'),
            height: heightToDP('40%'),
            borderRadius: 10,
          },
        ]}
        style={styles.rnholeView}
      />
    </>
  );
};

const styles = StyleSheet.create({
  rnholeView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    height: '100%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
});

export default CameraComponent;
