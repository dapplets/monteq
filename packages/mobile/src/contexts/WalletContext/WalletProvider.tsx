import { Web3Modal, useWeb3Modal } from '@web3modal/react-native';
import React, { FC, ReactElement, useMemo } from 'react';

import { WalletContext, WalletContextState, contextDefaultValues } from './WalletContext';
import { WC_METADATA, WC_PROJECT_ID } from '../../common/constants';

const projectId = WC_PROJECT_ID;
const providerMetadata = WC_METADATA;

type Props = {
  children: ReactElement;
};

const WalletProvider: FC<Props> = ({ children }) => {
  const { open, provider, isConnected } = useWeb3Modal();

  const state: WalletContextState = useMemo(
    () => ({
      connect: () => open(),
      disconnect: () => provider?.disconnect(),
      provider: provider
        ? {
            request: provider.request.bind(provider),
          }
        : contextDefaultValues.provider,
      isConnected: !!provider && isConnected,
    }),
    [open, provider, isConnected]
  );

  return (
    <WalletContext.Provider value={state}>
      <Web3Modal projectId={projectId} providerMetadata={providerMetadata} />
      {children}
    </WalletContext.Provider>
  );
};

export { WalletProvider };
