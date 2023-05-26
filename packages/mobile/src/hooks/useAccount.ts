import { useEffect, useState } from 'react';

import { useWallet } from '../contexts/WalletContext';

export function useAccount() {
  const { web3Provider } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!web3Provider) {
      setAddress(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        const _address = await web3Provider.getSigner().getAddress();
        if (web3Provider) {
          setAddress(_address);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [web3Provider]);

  return {
    isLoading,
    address,
    error,
  };
}
