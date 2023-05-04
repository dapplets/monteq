import * as React from 'react';
import {StyleSheet} from 'react-native';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {RNHoleView} from 'react-native-hole-view';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {RootStackParamList} from '../App';

const CameraScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const devices = useCameraDevices();
  const isFocused = useIsFocused();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([
    BarcodeFormat.QR_CODE, // You can only specify a particular format
  ]);

  const [hasPermission, setHasPermission] = React.useState(false);
  const [isScanned, setIsScanned] = React.useState(false);

  React.useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    const status = await Camera.getCameraPermissionStatus();
    setHasPermission(status === 'authorized');
  };

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
          navigation.goBack();
          navigation.navigate('TxScreen', {data: scannedBarcode.rawValue});
        }
      });
    }
  }

  return (
    device != null &&
    hasPermission && (
      <>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={!isScanned && isFocused}
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
    )
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

export default CameraScreen;
