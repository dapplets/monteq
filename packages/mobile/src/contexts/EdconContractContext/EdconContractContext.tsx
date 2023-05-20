import { createContext } from 'react';

// ToDo: duplicated code
export enum TxStatus {
  Idle,
  Sending,
  Mining,
  Done,
  Rejected,
  Failed,
}

// ToDo: duplicated code
export type ParsedUint = string;
export type Address = string;
export type TokenId = number;

export type MyTokenInfo = {
  tokenId: TokenId;
  ticker: string;
  tokenName: string;
  iconUrl: string;
  creator: Address;
  balance: ParsedUint;
  isAmbassador: boolean;
};

export type EdconContractContextState = {
  myTokens: MyTokenInfo[];
  areMyTokensLoading: boolean;
  loadMyTokens: () => Promise<void>;

  setAmbassadorTxError: string | null;
  setAmbassadorTxStatus: TxStatus;
  setAmbassador: (address: Address, tokenId: TokenId, ambassadorRank: number) => void;
  resetSetAmbassadorTxStatus: () => void;

  transferOrMintTxError: string | null;
  transferOrMintTxStatus: TxStatus;
  transferOrMint: (tokens: { tokenId: TokenId; amount: ParsedUint }[], to: Address) => void;
  resetTransferOrMintTxStatus: () => void;
};

export const contextDefaultValues: EdconContractContextState = {
  myTokens: [],
  areMyTokensLoading: false,
  loadMyTokens: () => Promise.resolve(),

  setAmbassadorTxError: null,
  setAmbassadorTxStatus: TxStatus.Idle,
  setAmbassador: () => undefined,
  resetSetAmbassadorTxStatus: () => undefined,

  transferOrMintTxError: null,
  transferOrMintTxStatus: TxStatus.Idle,
  transferOrMint: () => undefined,
  resetTransferOrMintTxStatus: () => undefined,
};

export const EdconContractContext = createContext<EdconContractContextState>(contextDefaultValues);
