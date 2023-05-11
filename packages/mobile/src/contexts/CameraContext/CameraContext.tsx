import {createContext} from 'react';

export type CameraContextState = {};

export const contextDefaultValues: CameraContextState = {};

export const CameraContext =
  createContext<CameraContextState>(contextDefaultValues);
