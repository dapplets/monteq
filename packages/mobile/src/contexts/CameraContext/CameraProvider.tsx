import React, {FC, ReactElement} from 'react';
import {
  CameraContext,
  CameraContextState,
  contextDefaultValues,
} from './CameraContext';
import CameraComponent from '../../components/CameraComponent';
import {View} from 'react-native'

type Props = {
  children: ReactElement;
};

const CameraProvider: FC<Props> = ({children}) => {
  const state: CameraContextState = {};

  return (
    <CameraContext.Provider value={state}>
      <>
        <CameraComponent onQrCodeFound={console.log} />
      </>
      <View style={{ display: 'none'}}>{children}</View>
    </CameraContext.Provider>
  );
};

export {CameraProvider};
