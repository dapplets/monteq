import { createContext } from 'react';

export type CameraContextState = {
  isScanning: boolean;
  scan: () => Promise<string>;
  stop: () => void;
};

export const contextDefaultValues: CameraContextState = {
  isScanning: false,
  scan: () => Promise.reject(new Error('CameraContext is not initialized')),
  stop: () => Promise.reject(new Error('CameraContext is not initialized')),
};

export const CameraContext = createContext<CameraContextState>(contextDefaultValues);
