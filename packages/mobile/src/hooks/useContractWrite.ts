import { ethers } from 'ethers';
import { useCallback, useMemo, useState } from 'react';

import { useWallet } from '../contexts/WalletContext';

export enum TxStatus {
  Idle,
  Sending,
  Mining,
  Done,
  Rejected,
  Failed,
}

export function useContractWrite<T extends [...any[]]>({
  address,
  abi,
  method,
  onSuccess,
}: {
  address: string;
  abi: ethers.ContractInterface;
  method: string;
  onSuccess?: (arg: { params: T }) => void | Promise<void>;
}) {
  const { web3Provider } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<TxStatus>(TxStatus.Idle);

  const contract = useMemo(
    () => (web3Provider ? new ethers.Contract(address, abi, web3Provider.getSigner()) : null),
    [web3Provider]
  );

  const send = useCallback(
    async (...args: T) => {
      if (!contract) return;

      setStatus(TxStatus.Sending);
      setError(null);

      let receipt: any | null = null;

      try {
        receipt = await contract[method](...args);
        setStatus(TxStatus.Mining);
      } catch (e) {
        console.error(e);
        setError(parseRevertReason(e));
        setStatus(TxStatus.Rejected);
        return false;
      }

      try {
        await receipt.wait();
        setStatus(TxStatus.Done);
      } catch (e) {
        console.error(e);
        setStatus(TxStatus.Failed);
        return false;
      }

      onSuccess?.({ params: args });

      return true;
    },
    [contract]
  );

  const reset = useCallback(() => {
    setError(null);
    setStatus(TxStatus.Idle);
  }, []);

  return {
    status,
    error,
    send,
    reset,
  };
}

export function parseRevertReason(err: any): string | null {
  try {
    const msg = JSON.parse(err.error.body).error.message;
    const hexReason = /0x[0-9a-fA-F]*/gm.exec(msg)?.[0];
    if (!hexReason) return null;
    if (!ethers.utils.isHexString(hexReason)) return null;
    const reason = ethers.utils.toUtf8String(hexReason);
    return capitalizeFirstLetter(reason);
  } catch (err) {
    console.error(err);
    return null;
  }
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
