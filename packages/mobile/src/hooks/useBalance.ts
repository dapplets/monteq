import { utils } from 'ethers';
import { useEffect, useState } from 'react';

import { useWallet } from '../contexts/WalletContext';

export function useBalance() {
  const { web3Provider } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!web3Provider) {
      setBalance(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        const _balance = await web3Provider.getSigner().getBalance();
        if (web3Provider) {
          setBalance(utils.formatEther(_balance));
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
    balance,
    error,
  };
}
