import { Web3Modal, useWeb3Modal } from '@web3modal/react-native';
import { ethers } from 'ethers';
import React, { FC, ReactElement, useMemo } from 'react';

import { WalletContext, WalletContextState } from './WalletContext';
import { IEIP1193Provider, mergeProviders } from './mergeProviders';
import {
  CHAIN_ID,
  JSON_RPC_URL,
  WC_METADATA,
  WC_PROJECT_ID,
  WC_SESSION_PARAMS,
} from '../../common/constants';

const readProvider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL, CHAIN_ID);
const readEip1193Provider: IEIP1193Provider = {
  request: ({ method, params }) => readProvider.send(method, params ?? []),
};

type Props = {
  children: ReactElement;
};

const WalletProvider: FC<Props> = ({ children }) => {
  const { open, provider, isConnected } = useWeb3Modal();

  const state: WalletContextState = useMemo(() => {
    const writeEip1193Provider = provider
      ? {
          request: provider.request.bind(provider),
        }
      : { request: () => Promise.reject(new Error('Provider in not initialized')) };

    return {
      connect: () => open(),
      disconnect: () => provider?.disconnect(),
      web3Provider: mergeProviders(readEip1193Provider, writeEip1193Provider),
      isConnected: !!provider && isConnected,
    };
  }, [open, provider, isConnected]);

  return (
    <WalletContext.Provider value={state}>
      <Web3Modal
        projectId={WC_PROJECT_ID}
        providerMetadata={WC_METADATA}
        sessionParams={WC_SESSION_PARAMS}
      />
      {children}
    </WalletContext.Provider>
  );
};

export { WalletProvider };
