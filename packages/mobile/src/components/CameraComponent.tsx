import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import React, { FC, useState, useCallback } from 'react';
import { BackHandler, View, StyleSheet, Text, Platform } from 'react-native';

import { FontFamily } from '../GlobalStyles';
import SvgComponentCameraBorder from '../icons/SVGCameraBorder';
import SvgComponentScanIcon from '../icons/SVGScanIcon';

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
            <View style={styles.containerBg}></View>
            <SvgComponentCameraBorder style={styles.cameraBorderTopLeft} />
            <SvgComponentCameraBorder style={styles.cameraBorderTopRight} />
            <SvgComponentCameraBorder style={styles.cameraBorderBottomLeft} />
            <SvgComponentCameraBorder style={styles.cameraBorderBottomRight} />
            
            <Camera
            
            // children={
            //   // <View style={styles.containerWindow}></View>
            // }
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              barCodeScannerSettings={{
                barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
              }}
            />
          </View>
        </View>
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
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerDescription: {
    position:'absolute',
    display: 'flex',
    flexDirection: 'row',
    zIndex: 1,
    top: 90,
    width: 260,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerDescriptionText: {
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
    // fontWeight: '600',
    fontSize: 20,
    color: '#fff',
  },
  container: {
    height: '100%',
    width: '100%',
    position:'relative'
    // backgroundColor:'#000',
    // opacity:0.8,
    // zIndex:2
    // padding: 10,
  },
  containerBg:{
    height: '100%',
    width: '100%',
    position:'absolute',
    top:0,
    left:0,
    zIndex:1,
    borderColor:'#000',
    borderStyle:'solid',
    // borderWidth:50,
    borderBottomWidth:200,
  borderLeftWidth:50,
  borderRightWidth:50,
  borderTopWidth:150,
    // backgroundColor:'#000',
    opacity:0.6,
  },
 


  cameraBorderTopLeft: {
    position: 'absolute',
    top: 148,
    left: 48,
    width: 80,
    height: 80,
    zIndex:2
  },
  cameraBorderTopRight: {
    position: 'absolute',
    top: 148,
    right: 48,
    width: 80,
    height: 80,
    transform: [{ scaleX: -1 }],
    zIndex:2
  },
  cameraBorderBottomLeft: {
    position: 'absolute',
    bottom: 198,
    left: 48,
    width: 80,
    height: 80,
    transform: [{ scaleY: -1 }],
    zIndex:2
  },
  cameraBorderBottomRight: {
    position: 'absolute',
    bottom: 198,
    right: 48,
    width: 80,
    height: 80,
    transform: [{ scaleX: -1 }, { scaleY: -1 }],
    zIndex:2
  },

  cameraScreenBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
  },
});

export default CameraComponent;
