import { ethers } from 'ethers';
import { createContext } from 'react';

export enum WalletTypes {
  WalletConnect,
  EphemeralKey,
}

export type WalletContextState = {
  web3Provider: ethers.providers.Web3Provider | null;
  isConnected: boolean;
  connect: (walletType: WalletTypes) => void;
  disconnect: () => void;
};

export const contextDefaultValues: WalletContextState = {
  web3Provider: null,
  isConnected: false,
  connect: () => undefined,
  disconnect: () => undefined,
};

export const WalletContext = createContext<WalletContextState>(contextDefaultValues);
