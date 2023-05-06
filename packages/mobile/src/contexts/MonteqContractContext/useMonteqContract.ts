import {useContext} from 'react';
import {MonteqContractContext} from './MonteqContractContext';

export function useMonteqContract() {
  return useContext(MonteqContractContext);
}
