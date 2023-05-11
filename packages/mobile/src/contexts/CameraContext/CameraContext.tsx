import {createContext} from 'react';

export type CameraContextState = {
  scan: () => Promise<string>;
};

export const contextDefaultValues: CameraContextState = {
  scan: () => Promise.reject('CameraContext is not initialized'),
};

export const CameraContext =
  createContext<CameraContextState>(contextDefaultValues);
