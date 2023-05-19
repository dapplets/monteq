import React, { FC, ReactElement } from "react";
import { WalletContext, WalletContextState } from "./WalletContext";
import {
  DEFAULT_CHAIN,
  WC_METADATA,
  WC_PROJECT_ID,
} from "../../common/constants";
import { contextDefaultValues } from "./WalletContext";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import {
  configureChains,
  createConfig,
  useAccount,
  useDisconnect,
  WagmiConfig,
} from "wagmi";
import { useWeb3Modal } from "@web3modal/react";

const chains = [DEFAULT_CHAIN];
const projectId = WC_PROJECT_ID;
const metadata = WC_METADATA;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

type Props = {
  children: ReactElement;
};

const WalletProviderChild: FC<Props> = ({ children }) => {
  const { isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const state: WalletContextState = {
    connect: () => open(),
    disconnect: () => disconnect(),
    provider: connector
      ? {
          request: ({ method, params }) =>
            connector
              .getWalletClient()
              // @ts-ignore
              .then((x) => x.request({ method, params })),
        }
      : contextDefaultValues.provider,
    isConnected: isConnected,
  };

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
