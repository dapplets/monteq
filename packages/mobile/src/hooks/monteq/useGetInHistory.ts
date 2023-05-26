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
  businessId: string,
  offset: number,
  limit: number,
  isReversed: boolean
];

export function useGetInHistory(businessId?: string | null) {
  const [inHistory, setInHistory] = useState<HistoryRecord[]>([]);
  const [earnedInvoicesCryptoAmount, setEarnedInvoicesCryptoAmount] = useState<ParsedUint>('0');
  const [earnedTipsCryptoAmount, setEarnedTipsCryptoAmount] = useState<ParsedUint>('0');
  const [earnedInvoicesFiatAmount, setEarnedInvoicesFiatAmount] = useState<ParsedUint>('0');

  const {
    isLoading: isInHistoryLoading,
    data,
    error: errorInHistoryLoading,
    refetch,
  } = useContractRead<GetInHistoryParams>({
    address: MONTEQ_CONTRACT_ADDRESS,
    abi: MONTEQ_ABI,
    method: 'getHistoryByBusiness',
  });

  const loadMoreInHistory = useCallback(() => {
    if (!businessId) return;
    refetch(businessId, 0, 100, true); // ToDo: implement pagination
  }, [businessId]);

  useEffect(() => {
    if (data) {
      setInHistory(
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

      setEarnedInvoicesCryptoAmount(
        formatEther(
          data.history.reduce(
            (acc: ethers.BigNumber, x: any) => acc.add(x.receiptAmount),
            ethers.BigNumber.from('0')
          )
        )
      );

      setEarnedTipsCryptoAmount(
        formatEther(
          data.history.reduce(
            (acc: ethers.BigNumber, x: any) => acc.add(x.tipAmount),
            ethers.BigNumber.from('0')
          )
        )
      );

      // ToDo: unused value. remove?
      setEarnedInvoicesFiatAmount(
        formatUnits(
          data.history.reduce(
            (acc: ethers.BigNumber, x: any) => acc.add(x.currencyReceipt),
            ethers.BigNumber.from('0')
          ),
          2
        )
      );
    } else {
      setInHistory([]);
      setEarnedInvoicesCryptoAmount('0');
      setEarnedTipsCryptoAmount('0');
    }
  }, [data]);

  return {
    inHistory,
    isInHistoryLoading,
    earnedInvoicesCryptoAmount,
    earnedTipsCryptoAmount,
    earnedInvoicesFiatAmount,
    loadMoreInHistory,
    errorInHistoryLoading,
  };
}
