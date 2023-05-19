import React, {
  FC,
  ReactElement,
  useState,
  useEffect,
  useCallback,
} from "react";
import { WalletContext, WalletContextState } from "./WalletContext";
import {
  WC_METADATA,
  WC_PROJECT_ID,
  WC_RELAY_URL,
  WC_SESSION_PARAMS,
} from "../../common/constants";

import { Web3Modal } from "@web3modal/standalone";
import UniversalProvider from "@walletconnect/universal-provider";
import { SessionTypes } from "@walletconnect/types";
import Client from "@walletconnect/sign-client";
import { contextDefaultValues } from "./WalletContext";

type Props = {
  children: ReactElement;
};

const WalletProvider: FC<Props> = ({ children }) => {
  const [client, setClient] = useState<Client>();
  const [session, setSession] = useState<SessionTypes.Struct>();

  const [ethereumProvider, setEthereumProvider] = useState<UniversalProvider>();

  const [hasCheckedPersistedSession, setHasCheckedPersistedSession] =
    useState(false);
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();

  const resetApp = () => {
    setSession(undefined);
  };

  const disconnect = useCallback(async () => {
    if (typeof ethereumProvider === "undefined") {
      throw new Error("ethereumProvider is not initialized");
    }
    await ethereumProvider.disconnect();
    resetApp();
  }, [ethereumProvider]);

  const _subscribeToProviderEvents = useCallback(
    async (_client: UniversalProvider) => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }

      _client.on("display_uri", async (uri: string) => {
        console.log("EVENT", "QR Code Modal open");
        web3Modal?.openModal({ uri });
      });

      // Subscribe to session ping
      _client.on(
        "session_ping",
        ({ id, topic }: { id: number; topic: string }) => {
          console.log("EVENT", "session_ping");
          console.log(id, topic);
        }
      );

      // Subscribe to session event
      _client.on(
        "session_event",
        ({ event, chainId }: { event: any; chainId: string }) => {
          console.log("EVENT", "session_event");
          console.log(event, chainId);
        }
      );

      // Subscribe to session update
      _client.on(
        "session_update",
        ({
          topic,
          session,
        }: {
          topic: string;
          session: SessionTypes.Struct;
        }) => {
          console.log("EVENT", "session_updated");
          setSession(session);
        }
      );

      // Subscribe to session delete
      _client.on(
        "session_delete",
        ({ id, topic }: { id: number; topic: string }) => {
          console.log("EVENT", "session_deleted");
          console.log(id, topic);
          resetApp();
        }
      );
    },
    [web3Modal]
  );

  const createClient = useCallback(async () => {
    try {
      const provider = await UniversalProvider.init({
        projectId: WC_PROJECT_ID,
        relayUrl: WC_RELAY_URL,
      });

      const web3Modal = new Web3Modal({
        projectId: WC_PROJECT_ID,
        walletConnectVersion: 2,
      });

      setEthereumProvider(provider);
      setClient(provider.client);
      setWeb3Modal(web3Modal);
    } catch (err) {
      throw err;
    }
  }, []);

  const connect = useCallback(async () => {
    if (!ethereumProvider) {
      throw new ReferenceError("WalletConnect Client is not initialized.");
    }

    const session = await ethereumProvider.connect({
      namespaces: WC_SESSION_PARAMS.namespaces,
      // pairingTopic: pairing?.topic,
    });

    const _accounts = await ethereumProvider.enable();
    console.log("_accounts", _accounts);
    setSession(session);

    web3Modal?.closeModal();
  }, [ethereumProvider, web3Modal]);

  const onSessionConnected = useCallback(
    async (_session: SessionTypes.Struct) => {
      if (!ethereumProvider) {
        throw new ReferenceError("EthereumProvider is not initialized.");
      }
      const allNamespaceAccounts = Object.values(_session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat();
      const allNamespaceChains = Object.keys(_session.namespaces);

      const chainData = allNamespaceAccounts[0].split(":");
      const caipChainId = `${chainData[0]}:${chainData[1]}`;
      console.log("restored caipChainId", caipChainId);
      setSession(_session);
      console.log("RESTORED", allNamespaceChains, allNamespaceAccounts);
    },
    [ethereumProvider]
  );

  const _checkForPersistedSession = useCallback(
    async (provider: UniversalProvider) => {
      if (typeof provider === "undefined") {
        throw new Error("WalletConnect is not initialized");
      }
      const pairings = provider.client.pairing.getAll({ active: true });
      // populates existing pairings to state
      console.log("RESTORED PAIRINGS: ", pairings);
      if (typeof session !== "undefined") return;
      // populates (the last) existing session to state
      if (ethereumProvider?.session) {
        const _session = ethereumProvider?.session;
        console.log("RESTORED SESSION:", _session);
        await onSessionConnected(_session);
        return _session;
      }
    },
    [session, ethereumProvider, onSessionConnected]
  );

  useEffect(() => {
    if (!client) {
      createClient();
    }
  }, [client, createClient]);

  useEffect(() => {
    if (ethereumProvider && web3Modal)
      _subscribeToProviderEvents(ethereumProvider);
  }, [_subscribeToProviderEvents, ethereumProvider, web3Modal]);

  useEffect(() => {
    const getPersistedSession = async () => {
      if (!ethereumProvider) return;
      await _checkForPersistedSession(ethereumProvider);
      setHasCheckedPersistedSession(true);
    };

    if (ethereumProvider && !hasCheckedPersistedSession) {
      getPersistedSession();
    }
  }, [ethereumProvider, _checkForPersistedSession, hasCheckedPersistedSession]);

  const state: WalletContextState = ethereumProvider
    ? {
        connect: () => connect(),
        disconnect: () => disconnect(),
        provider: {
          request: ({ method, params }) =>
            ethereumProvider.request({ method, params }),
        },
        isConnected: !!session,
      }
    : contextDefaultValues;

  return (
    <WalletContext.Provider value={state}>{children}</WalletContext.Provider>
  );
};

export { WalletProvider };
