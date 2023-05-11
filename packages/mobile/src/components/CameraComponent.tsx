import React, {FC, useCallback} from 'react';
import {BackHandler, StyleSheet, Text, View} from 'react-native';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {RNHoleView} from 'react-native-hole-view';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';

type Props = {
  onQrCodeFound: (data: string) => void;
  onCanceled: () => void;
  onError: (reason: string) => void;
};

const CameraComponent: FC<Props> = ({onQrCodeFound, onCanceled, onError}) => {
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

  const [hasPermission, setHasPermission] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  const handleBackButtonPress = useCallback(() => {
    onCanceled();
    return true;
  }, [onCanceled]);

  const checkCameraPermission = useCallback(async () => {
    // const status = await Camera.getCameraPermissionStatus();
    const status = await Camera.requestCameraPermission();

    if (status !== 'authorized') {
      onError('Camera Permission Denied');
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
      onQrCodeFound(result);
    }
  }, [onQrCodeFound, result]);

  if (!hasPermission) {
    return (
      <View>
        <Text>ToDo: No permission</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View>
        <Text>ToDo: No camera device found</Text>
      </View>
    );
  }

  // ToDo: add close scanning button

  return (
    <>
      <Camera
        style={styles.container}
        device={device}
        isActive={!result}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        audio={false}
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
