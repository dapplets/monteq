import { useEffect } from 'react';

import MONTEQ_ABI from '../../abis/MonteQ.json';
import { MONTEQ_CONTRACT_ADDRESS } from '../../common/constants';
import { useContractRead } from '../useContractRead';

export type BusinessInfo = {
  id: string;
  name: string;
  owner: string;
};

export type GetBusinessByIdParams = [businessId: string];

export function useGetBusinessById(businessId: string) {
  const {
    isLoading,
    data: business,
    error,
    refetch: _refetch,
  } = useContractRead<GetBusinessByIdParams, BusinessInfo>({
    address: MONTEQ_CONTRACT_ADDRESS,
    abi: MONTEQ_ABI,
    method: 'businessInfos',
    doNotThrow: true,
  });

  async function refetch() {
    if (!businessId) return;
    _refetch(businessId);
  }

  useEffect(() => {
    refetch();
  }, []);

  return {
    business,
    isLoading,
    error,
    refetch,
  };
}
