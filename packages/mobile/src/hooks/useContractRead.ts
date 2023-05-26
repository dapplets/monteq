import { ethers } from 'ethers';
import { useCallback, useMemo, useState } from 'react';

import { useWallet } from '../contexts/WalletContext';

export function useContractRead<T extends [...any[]], R = any>({
  address,
  abi,
  method,
  doNotThrow = false,
}: {
  address: string;
  abi: ethers.ContractInterface;
  method: string;
  doNotThrow?: boolean;
}) {
  const { web3Provider } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<R | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const contract = useMemo(
    () => (web3Provider ? new ethers.Contract(address, abi, web3Provider.getSigner()) : null),
    [web3Provider]
  );

  const refetch = useCallback(
    async (...args: T) => {
      if (!contract) return;

      try {
        setIsLoading(true);
        const data = await contract[method](...args);
        setData(data);
        return data;
      } catch (err: any) {
        if (!doNotThrow) {
          setError(err);
        }
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );

  return {
    isLoading,
    data,
    error,
    refetch,
  };
}
