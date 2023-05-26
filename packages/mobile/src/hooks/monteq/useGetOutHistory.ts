import { ethers, utils } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import MONTEQ_ABI from '../../abis/MonteQ.json';
import { MONTEQ_CONTRACT_ADDRESS } from '../../common/constants';
import { ParsedUint } from '../../common/types';
import { useContractRead } from '../useContractRead';

const { formatUnits, formatEther } = utils;

export type HistoryRecord = {
  id: string;
  businessId: string;
  payer: string;
  currencyReceipt: ParsedUint;
  receiptAmount: ParsedUint;
  tipAmount: ParsedUint;
  totalCryptoAmount: ParsedUint;
  timestamp: number;
};

export type GetInHistoryParams = [
  payer: string,
  offset: number,
  limit: number,
  isReversed: boolean
];

export function useGetOutHistory(payer?: string | null) {
  const [outHistory, setOutHistory] = useState<HistoryRecord[]>([]);
  const [spentTotalCryptoAmount, setSpentTotalCryptoAmount] = useState<ParsedUint>('0');
  const [spentTipsCryptoAmount, setSpentTipsCryptoAmount] = useState<ParsedUint>('0');

  const {
    isLoading: isOutHistoryLoading,
    data,
    error: errorOutHistoryLoading,
    refetch,
  } = useContractRead<GetInHistoryParams>({
    address: MONTEQ_CONTRACT_ADDRESS,
    abi: MONTEQ_ABI,
    method: 'getHistoryByPayer',
  });

  const loadMoreOutHistory = useCallback(() => {
    if (!payer) return;
    refetch(payer, 0, 100, true); // ToDo: implement pagination
  }, [payer]);

  useEffect(() => {
    if (data) {
      setOutHistory(
        data.history.map((x: any, index: number) => ({
          id: index, // ToDo: use better id
          businessId: x.businessId,
          payer: x.payer,
          currencyReceipt: formatUnits(x.currencyReceipt, 2),
          receiptAmount: formatEther(x.receiptAmount),
          tipAmount: formatEther(x.tipAmount),
          totalCryptoAmount: formatEther(x.receiptAmount.add(x.tipAmount)),
          timestamp: x.timestamp.toNumber(),
        }))
      );

      setSpentTotalCryptoAmount(
        formatEther(
          data.history.reduce(
            (acc: ethers.BigNumber, x: any) => acc.add(x.receiptAmount.add(x.tipAmount)),
            ethers.BigNumber.from('0')
          )
        )
      );

      setSpentTipsCryptoAmount(
        formatEther(
          data.history.reduce(
            (acc: ethers.BigNumber, x: any) => acc.add(x.tipAmount),
            ethers.BigNumber.from('0')
          )
        )
      );
    } else {
      setOutHistory([]);
      setSpentTotalCryptoAmount('0');
      setSpentTipsCryptoAmount('0');
    }
  }, [data]);

  return {
    outHistory,
    isOutHistoryLoading,
    spentTotalCryptoAmount,
    spentTipsCryptoAmount,
    loadMoreOutHistory,
    errorOutHistoryLoading,
  };
}
