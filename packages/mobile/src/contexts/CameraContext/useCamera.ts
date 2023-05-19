import { useContext } from 'react';

import { CameraContext } from './CameraContext';

export function useCamera() {
  return useContext(CameraContext);
}
