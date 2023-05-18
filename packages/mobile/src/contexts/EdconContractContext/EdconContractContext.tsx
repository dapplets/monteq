import { createContext } from "react";
import { number } from "yargs";

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
};

export type EdconContractContextState = {
  myTokens: MyTokenInfo[];
  areMyTokensLoading: boolean;
  loadMyTokens: () => Promise<void>;

  setAmbassadorTxStatus: TxStatus;
  ambassadorRank: (address: Address, tokenId: TokenId) => Promise<number | undefined>;
  setAmbassador: (
    address: Address,
    tokenId: TokenId,
    ambassadorRank: number
  ) => void;
  resetSetAmbassadorTxStatus: () => void;

  transferOrMintTxStatus: TxStatus;
  transferOrMint: (
    tokens: { tokenId: TokenId; amount: ParsedUint }[],
    to: Address
  ) => void;
  resetTransferOrMintTxStatus: () => void;
};

export const contextDefaultValues: EdconContractContextState = {
  myTokens: [],
  areMyTokensLoading: false,
  loadMyTokens: () => Promise.resolve(),

  setAmbassadorTxStatus: TxStatus.Idle,
  setAmbassador: () => undefined,
  resetSetAmbassadorTxStatus: () => undefined,
  ambassadorRank:async () => 0,

  transferOrMintTxStatus: TxStatus.Idle,
  transferOrMint: () => undefined,
  resetTransferOrMintTxStatus: () => undefined,
};

export const EdconContractContext =
  createContext<EdconContractContextState>(contextDefaultValues);
