import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal, useWeb3Modal } from '@web3modal/react';
import { ethers } from 'ethers';
import React, { FC, ReactElement, useMemo } from 'react';
import {
  configureChains,
  createConfig,
  mainnet,
  useAccount,
  useDisconnect,
  WagmiConfig,
} from 'wagmi';

import { WalletContext, WalletContextState } from './WalletContext';
import { IEIP1193Provider, mergeProviders } from './mergeProviders';
import { CHAIN_ID, DEFAULT_CHAIN, JSON_RPC_URL, WC_PROJECT_ID } from '../../common/constants';

const chains = [mainnet, DEFAULT_CHAIN];
const projectId = WC_PROJECT_ID;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }), // Use version param to change WalletConnect version (1 or 2)
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

const readProvider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL, CHAIN_ID);
const readEip1193Provider: IEIP1193Provider = {
  request: ({ method, params }) => readProvider.send(method, params ?? []),
};

type Props = {
  children: ReactElement;
};

const WalletProviderChild: FC<Props> = ({ children }) => {
  const { isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const state: WalletContextState = useMemo(() => {
    const wrireEip1193Provider: IEIP1193Provider = connector
      ? {
          request: ({ method, params }) =>
            // @ts-ignore:next-line
            connector.getWalletClient().then((x) => x.request({ method, params: params ?? [] })),
        }
      : {
          request: () => Promise.reject(new Error('Provider is not initialized')),
        };

    return {
      connect: () => open(),
      disconnect: () => disconnect(),
      web3Provider: mergeProviders(readEip1193Provider, wrireEip1193Provider),
      isConnected: !!connector && isConnected,
    };
  }, [open, connector, disconnect, isConnected]);

  return (
    <WalletContext.Provider value={state}>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        defaultChain={DEFAULT_CHAIN}
      />
      {children}
    </WalletContext.Provider>
  );
};

const WalletProvider: FC<Props> = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <WalletProviderChild>{children}</WalletProviderChild>
    </WagmiConfig>
  );
};

export { WalletProvider };
