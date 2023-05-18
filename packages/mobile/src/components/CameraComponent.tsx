import React, { FC, useState, useCallback } from "react";
import { BackHandler, View, StyleSheet } from "react-native";
import { BarCodeScannedCallback, BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";

type Props = {
  onQrCodeFound: (data: string) => void;
  onCanceled: () => void;
  onError: (error: Error) => void;
};

const CameraComponent: FC<Props> = ({ onQrCodeFound, onCanceled, onError }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleBackButtonPress = useCallback(() => {
    setIsActive(false);
    setTimeout(() => onCanceled(), 500); // ToDo: hack
    return true;
  }, [onCanceled]);

  const checkCameraPermission = useCallback(async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();

    if (status !== "granted") {
      onError(new Error("Camera Permission Denied"));
    } else {
      setIsActive(true);
    }

    setHasPermission(status === "granted");
  }, [onError]);

  React.useEffect(() => {
    checkCameraPermission();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonPress
    );

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
    <View style={styles.container}>
      <Camera
        style={styles.container}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // flexDirection: 'column',
    // justifyContent: 'center',
    height: "100%",
    aspectRatio: 1,
    alignSelf: "center"
  },
});

export default CameraComponent;
