import React, { FC, ReactElement } from "react";
import {
  WalletContext,
  WalletContextState,
  contextDefaultValues,
} from "./WalletContext";
import { Web3Modal, useWeb3Modal } from "@web3modal/react-native";
import {
  WC_METADATA,
  WC_PROJECT_ID,
  WC_RELAY_URL,
  WC_SESSION_PARAMS,
} from "../../common/constants";

type Props = {
  children: ReactElement;
};

const WalletProvider: FC<Props> = ({ children }) => {
  const { isConnected, open, provider } = useWeb3Modal();

  const state: WalletContextState = provider
    ? {
        isConnected,
        connect: () => open(),
        provider: {
          request: ({ method, params }) => provider.request({ method, params }),
        },
        disconnect: () => provider?.disconnect(),
      }
    : contextDefaultValues;

  return (
    <WalletContext.Provider value={state}>
      <Web3Modal
        projectId={WC_PROJECT_ID}
        relayUrl={WC_RELAY_URL}
        providerMetadata={WC_METADATA}
        sessionParams={WC_SESSION_PARAMS}
      />

      {children}
    </WalletContext.Provider>
  );
};

export { WalletProvider };
