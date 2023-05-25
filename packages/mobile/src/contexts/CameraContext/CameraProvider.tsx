import React, { FC, ReactElement, useState } from 'react';

import { CameraContext, CameraContextState } from './CameraContext';

import CameraComponent from '../../components/CameraComponent';

type Props = {
  children: ReactElement;
};

const CameraProvider: FC<Props> = ({ children }) => {
  const [scanningPromise, setScanningPromise] = useState<{
    resolve: (data: string) => void;
    reject: (reason?: any) => void;
  } | null>(null);
  function handleQrCodeFound(data: string) {
    if (scanningPromise) {
      scanningPromise.resolve(data);
      setScanningPromise(null);
    }
  }

  function handleScanningCanceled() {
    if (scanningPromise) {
      scanningPromise.reject(new Error('User canceled scanning'));
      setScanningPromise(null);
    }
  }

  function handleScanningError(error: Error) {
    if (scanningPromise) {
      scanningPromise.reject(error);
      setScanningPromise(null);
    }
  }

  async function scan(): Promise<string> {
    return new Promise((resolve, reject) => {
      setScanningPromise({ resolve, reject });
    });
  }

  const state: CameraContextState = {
    scan,
  };

  return (
    <CameraContext.Provider value={state}>
      {scanningPromise ? (
        <CameraComponent
          onQrCodeFound={handleQrCodeFound}
          onCanceled={handleScanningCanceled}
          onError={handleScanningError}
        />
      ) : null}

      {children}
    </CameraContext.Provider>
  );
};

export { CameraProvider };
