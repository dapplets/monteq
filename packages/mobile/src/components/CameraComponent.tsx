import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {RNHoleView} from 'react-native-hole-view';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';

type Props = {
  onQrCodeFound: (data: string) => void;
};

const CameraComponent: FC<Props> = ({onQrCodeFound}) => {
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

  const [hasPermission, setHasPermission] = React.useState(false);
  const [isScanned, setIsScanned] = React.useState(false);

  React.useEffect(() => {
    checkCameraPermission();
    console.log('test');
  }, []);

  const checkCameraPermission = async () => {
    // const status = await Camera.getCameraPermissionStatus();
    const status = await Camera.requestCameraPermission();
    console.log('status ' + status);
    setHasPermission(status === 'authorized');
  };

  console.log(barcodes)

  React.useEffect(() => {
    toggleActiveState();
    return () => {
      barcodes;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcodes]);

  async function toggleActiveState() {
    if (barcodes && barcodes.length > 0 && isScanned === false) {
      setIsScanned(true);
      // setBarcode('');
      barcodes.forEach(async (scannedBarcode: any) => {
        if (scannedBarcode.rawValue !== '') {
          onQrCodeFound(scannedBarcode.rawValue);
          return;
        }
      });
    }
  }

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

  return (
    <>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!isScanned}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        audio={false}
      />
      <RNHoleView
        holes={[
          {
            x: widthToDP('10%'),
            y: heightToDP('20%'),
            width: widthToDP('80%'),
            height: heightToDP('83%'),
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
});

export default CameraComponent;
