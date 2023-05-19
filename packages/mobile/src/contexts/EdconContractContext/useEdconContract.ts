import { useContext } from 'react';

import { EdconContractContext } from './EdconContractContext';

export function useEdconContract() {
  return useContext(EdconContractContext);
}
