import {createContext} from 'react';

export enum TxStatus {
  Idle,
  Sending,
  Mining,
  Done,
  Rejected,
  Failed,
}

export type ParsedUint = string;

export type HistoryRecord = {
  businessId: string;
  payer: string;
  currencyReceipt: ParsedUint;
  receiptAmount: ParsedUint;
  tipAmount: ParsedUint;
  timestamp: number;
};

export type MonteqContractContextState = {
  // common data
  balance: ParsedUint;
  isBalanceLoading: boolean;

  rate: ParsedUint;
  isRateLoading: boolean;

  // outgoing payments history (payer view)
  outHistory: HistoryRecord[];
  isOutHistoryLoading: boolean;
  loadMoreOutHistory: () => void;

  // incoming payments histroy (owner view)
  inHistory: HistoryRecord[];
  isInHistoryLoading: boolean;
  loadMoreInHistory: () => void;

  // payment
  paymentTxStatus: TxStatus;
  payReceipt: (
    businessId: string,
    currencyReceipt: ParsedUint,
    amountReceipt: ParsedUint,
    amountTips: ParsedUint,
  ) => void;

  // for owner
  // ToDo: rename add/remove to link/unlink or attach/detach
  addBusinessTxStatus: TxStatus;
  addBusiness: (businessId: string, name: string) => void;

  removeBusinessTxStatus: TxStatus;
  removeBusiness: (businessId: string) => void;
};

export const contextDefaultValues: MonteqContractContextState = {
  balance: '0',
  isBalanceLoading: false,

  rate: '0',
  isRateLoading: false,

  outHistory: [],
  isOutHistoryLoading: false,
  loadMoreOutHistory: () => undefined,

  inHistory: [],
  isInHistoryLoading: false,
  loadMoreInHistory: () => undefined,

  paymentTxStatus: TxStatus.Idle,
  payReceipt: () => undefined,

  addBusinessTxStatus: TxStatus.Idle,
  addBusiness: () => undefined,

  removeBusinessTxStatus: TxStatus.Idle,
  removeBusiness: () => undefined,
};

export const MonteqContractContext =
  createContext<MonteqContractContextState>(contextDefaultValues);
