import { createContext } from "react";

export enum WalletTypes {
  WalletConnect,
  EphemeralKey,
}

export interface IEIP1193Provider {
  request(args: { method: string; params?: any[] }): Promise<any>;
}

export type WalletContextState = {
  provider: IEIP1193Provider;
  isConnected: boolean;
  connect: (walletType: WalletTypes) => void;
  disconnect: () => void;
};

export const contextDefaultValues: WalletContextState = {
  provider: {
    request: () => Promise.reject("WalletProvider is not initialized"),
  },
  isConnected: false,
  connect: () => undefined,
  disconnect: () => undefined,
};

export const WalletContext =
  createContext<WalletContextState>(contextDefaultValues);
