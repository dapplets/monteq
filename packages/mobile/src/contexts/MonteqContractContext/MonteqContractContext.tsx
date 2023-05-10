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
  totalCryptoAmount: ParsedUint;
  timestamp: number;
};

export type BusinessInfo = {
  id: string;
  name: string;
  owner: string;
};

export type MonteqContractContextState = {
  // common data
  balance: ParsedUint;
  isBalanceLoading: boolean;

  rate: ParsedUint;
  isRateLoading: boolean;

  spentTotalCryptoAmount: ParsedUint;
  spentTipsCryptoAmount: ParsedUint;
  earnedInvoicesCryptoAmount: ParsedUint;
  earnedTipsCryptoAmount: ParsedUint;
  earnedInvoicesFiatAmount: ParsedUint;

  myBusiness: BusinessInfo | null;
  isMyBusinessLoading: boolean;

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
  resetPaymentTxStatus: () => void;

  // for owner
  // ToDo: rename add/remove to link/unlink or attach/detach
  addBusinessTxStatus: TxStatus;
  addBusiness: (businessId: string, name: string) => void;
  resetAddBusinessTxStatus: () => void;

  removeBusinessTxStatus: TxStatus;
  removeBusiness: (businessId: string) => void;
  resetRemoveBusinessTxStatus: () => void;
};

export const contextDefaultValues: MonteqContractContextState = {
  balance: '0',
  isBalanceLoading: false,

  rate: '0',
  isRateLoading: false,

  spentTotalCryptoAmount: '0',
  spentTipsCryptoAmount: '0',
  earnedInvoicesCryptoAmount: '0',
  earnedTipsCryptoAmount: '0',
  earnedInvoicesFiatAmount: '0',

  myBusiness: null,
  isMyBusinessLoading: false,

  outHistory: [],
  isOutHistoryLoading: false,
  loadMoreOutHistory: () => undefined,

  inHistory: [],
  isInHistoryLoading: false,
  loadMoreInHistory: () => undefined,

  paymentTxStatus: TxStatus.Idle,
  payReceipt: () => undefined,
  resetPaymentTxStatus: () => undefined,

  addBusinessTxStatus: TxStatus.Idle,
  addBusiness: () => undefined,
  resetAddBusinessTxStatus: () => undefined,

  removeBusinessTxStatus: TxStatus.Idle,
  removeBusiness: () => undefined,
  resetRemoveBusinessTxStatus: () => undefined,
};

export const MonteqContractContext =
  createContext<MonteqContractContextState>(contextDefaultValues);
