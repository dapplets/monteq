import { useEffect, useState } from 'react';

import MONTEQ_ABI from '../../abis/MonteQ.json';
import { MONTEQ_CONTRACT_ADDRESS } from '../../common/constants';
import { useContractRead } from '../useContractRead';

export type BusinessInfo = {
  id: string;
  name: string;
  owner: string;
};

export type GetBusinessByOwnerParams = [owner: string];

export function useGetBusinessByOwner(owner: string | null) {
  const [business, setBusiness] = useState<BusinessInfo | null>(null);

  const {
    isLoading,
    data: businessInfos,
    error,
    refetch: _refetch,
  } = useContractRead<GetBusinessByOwnerParams>({
    address: MONTEQ_CONTRACT_ADDRESS,
    abi: MONTEQ_ABI,
    method: 'getBusinessInfosByOwner',
  });

  async function refetch() {
    if (!owner) return;
    _refetch(owner);
  }

  useEffect(() => {
    refetch();
  }, [owner]);

  useEffect(() => {
    if (businessInfos) {
      if (businessInfos.length > 0) {
        setBusiness({
          id: businessInfos[0].id,
          name: businessInfos[0].name,
          owner: businessInfos[0].owner,
        });
      } else {
        setBusiness(null);
      }
    } else {
      setBusiness(null);
    }
  }, [businessInfos]);

  return {
    business,
    isLoading,
    error,
    refetch,
  };
}
