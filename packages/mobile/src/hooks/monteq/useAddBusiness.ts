import MONTEQ_ABI from '../../abis/MonteQ.json';
import { MONTEQ_CONTRACT_ADDRESS } from '../../common/constants';
import { useContractWrite } from '../useContractWrite';

export function useAddBusiness() {
  return useContractWrite<[businessId: string, name: string]>({
    address: MONTEQ_CONTRACT_ADDRESS,
    abi: MONTEQ_ABI,
    method: 'addBusiness',
  });
}
