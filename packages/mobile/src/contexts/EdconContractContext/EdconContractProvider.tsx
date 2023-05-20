import { ethers } from 'ethers';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';

import {
  EdconContractContext,
  EdconContractContextState,
  TxStatus,
  ParsedUint,
  contextDefaultValues,
  MyTokenInfo,
  Address,
  TokenId,
} from './EdconContractContext';
import EDCON_GAME_ABI from '../../abis/EdconGame.json';
import {
  CHAIN_ID,
  JSON_RPC_URL,
  EDCON_GAME_CONTRACT_ADDRESS,
  WC_SESSION_PARAMS,
} from '../../common/constants';
import { parseRevertReason } from '../../common/helpers';
import { useWallet } from '../WalletContext';

type Props = {
  children: ReactElement;
};

const EdconContractProvider: FC<Props> = ({ children }) => {
  const { provider: writeEip1193 } = useWallet();

  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const [myTokens, setMyTokens] = useState<MyTokenInfo[]>([]);
  const [areMyTokensLoading, setAreMyTokensLoading] = useState<boolean>(false);

  const [setAmbassadorTxError, setSetAmbassadorTxError] = useState<string | null>(null);
  const [setAmbassadorTxStatus, setSetAmbassadorTxStatus] = useState<TxStatus>(TxStatus.Idle);

  const [transferOrMintTxError, setTransferOrMintTxError] = useState<string | null>(null);
  const [transferOrMintTxStatus, setTransferOrMintTxStatus] = useState<TxStatus>(TxStatus.Idle);

  useEffect(() => {
    if (writeEip1193) {
      const readProvider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL, CHAIN_ID);

      // The `eth_estimateGas` and `eth_call` calls are not resolved by WC-provider
      // So we split read and write calls by separate providers
      const provider = new ethers.providers.Web3Provider({
        request: ({ method, params }) => {
          const writeMethods = WC_SESSION_PARAMS.namespaces.eip155.methods;
          return writeMethods.includes(method)
            ? writeEip1193.request({ method, params })
            : readProvider.send(method, params ?? []);
        },
      });

      const _contract = new ethers.Contract(
        EDCON_GAME_CONTRACT_ADDRESS,
        EDCON_GAME_ABI,
        provider.getSigner()
      );

      setContract(_contract);
    } else {
      setContract(null);
    }
  }, [writeEip1193]);

  const loadMyTokens = useCallback(async () => {
    if (!contract) {
      return;
    }

    setAreMyTokensLoading(true);

    try {
      // ToDo: naive impl
      // ToDo: pagination
      const address = await contract.signer.getAddress();
      const allTokenInfos = await contract.readToken();
      const allTokenInfoBalances = await Promise.all(
        allTokenInfos.map((token: any, tokenId: number) =>
          Promise.all([
            contract.balanceOf(address, tokenId),
            contract.isAmbassador(address, tokenId),
          ]).then(([balance, isAmbassador]) => ({
            tokenId,
            token,
            balance,
            isAmbassador,
          }))
        )
      );

      const myTokensWithBalance: MyTokenInfo[] = allTokenInfoBalances // ToDo: .filter((x: any) => !x.balance.eq(ethers.BigNumber.from(0)))
        .map((x: any) => ({
          tokenId: x.tokenId,
          ticker: x.token.ticker,
          tokenName: x.token.tokenName,
          iconUrl: x.token.iconUrl,
          creator: x.token.creator,
          balance: x.balance.toString(),
          isAmbassador: x.isAmbassador,
        }));

      setMyTokens(myTokensWithBalance);
    } catch (e) {
      console.error(e);
      setMyTokens(contextDefaultValues.myTokens);
    }

    setAreMyTokensLoading(false);
  }, [contract]);

  async function setAmbassador(address: Address, tokenId: TokenId, ambassadorRank?: number) {
    if (!contract) {
      return;
    }
    // setAmbassador(address, tokenId).calls()
    const txPromise =
      ambassadorRank === undefined
        ? contract['setAmbassador(address,uint8)'](address, tokenId)
        : contract['setAmbassador(address,uint8,uint8)'](address, tokenId, ambassadorRank);

    processTransaction(txPromise, setSetAmbassadorTxStatus, setSetAmbassadorTxError);
  }

  const resetSetAmbassadorTxStatus = useCallback(() => {
    setSetAmbassadorTxStatus(TxStatus.Idle);
    setSetAmbassadorTxError(null);
  }, []);

  async function transferOrMint(tokens: { tokenId: TokenId; amount: ParsedUint }[], to: Address) {
    if (!contract) {
      return;
    }

    const positiveTokens = tokens.filter((token) => !ethers.BigNumber.from(token.amount).eq(0));

    if (positiveTokens.length === 0) {
      throw new Error('Tokens array is empty');
    }

    const txPromise =
      positiveTokens.length === 1
        ? contract.transfer(positiveTokens[0].tokenId, positiveTokens[0].amount, to)
        : contract.transferBatch(
            positiveTokens.map((x) => x.tokenId),
            positiveTokens.map((x) => x.amount),
            to
          );

    processTransaction(txPromise, setTransferOrMintTxStatus, setTransferOrMintTxError);
  }

  const resetTransferOrMintTxStatus = useCallback(() => {
    setTransferOrMintTxStatus(TxStatus.Idle);
    setTransferOrMintTxError(null);
  }, []);

  if (!contract) {
    return (
      <EdconContractContext.Provider value={contextDefaultValues}>
        {children}
      </EdconContractContext.Provider>
    );
  }

  const state: EdconContractContextState = {
    myTokens,
    areMyTokensLoading,
    loadMyTokens,

    setAmbassadorTxError,
    setAmbassadorTxStatus,
    setAmbassador,
    resetSetAmbassadorTxStatus,

    transferOrMintTxError,
    transferOrMintTxStatus,
    transferOrMint,
    resetTransferOrMintTxStatus,
  };

  return <EdconContractContext.Provider value={state}>{children}</EdconContractContext.Provider>;
};

// ToDo: duplicated code
async function processTransaction(
  promise: Promise<any>,
  setTxStatus: (status: TxStatus) => void,
  setTxError: (error: string | null) => void
) {
  setTxStatus(TxStatus.Sending);
  setTxError(null);

  let receipt: any | null = null;

  try {
    receipt = await promise;
    setTxStatus(TxStatus.Mining);
  } catch (e) {
    console.error(e);
    setTxError(parseRevertReason(e));
    setTxStatus(TxStatus.Rejected);
    return false;
  }

  try {
    await receipt.wait();
    setTxStatus(TxStatus.Done);
  } catch (e) {
    console.error(e);
    setTxStatus(TxStatus.Failed);
    return false;
  }

  return true;
}

export { EdconContractProvider };
