import React, {FC, ReactElement, useCallback, useEffect, useState} from 'react';
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
import {ethers} from 'ethers';
import {useWeb3Modal} from '@web3modal/react-native';
import {
  CHAIN_ID,
  JSON_RPC_URL,
  EDCON_GAME_CONTRACT_ADDRESS,
  WC_SESSION_PARAMS,
} from '../../common/constants';
import EDCON_GAME_ABI from '../../abis/EdconGame.json';

type Props = {
  children: ReactElement;
};

const EdconContractProvider: FC<Props> = ({children}) => {
  const {provider: writeEip1193} = useWeb3Modal();

  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const [myTokens, setMyTokens] = useState<MyTokenInfo[]>([]);
  const [areMyTokensLoading, setAreMyTokensLoading] = useState<boolean>(false);

  const [setAmbassadorTxStatus, setSetAmbassadorTxStatus] = useState<TxStatus>(
    TxStatus.Idle,
  );

  const [transferOrMintTxStatus, setTransferOrMintTxStatus] =
    useState<TxStatus>(TxStatus.Idle);

  useEffect(() => {
    if (writeEip1193) {
      const readProvider = new ethers.providers.JsonRpcProvider(
        JSON_RPC_URL,
        CHAIN_ID,
      );

      // The `eth_estimateGas` and `eth_call` calls are not resolved by WC-provider
      // So we split read and write calls by separate providers
      const provider = new ethers.providers.Web3Provider({
        request: ({method, params}) => {
          const writeMethods = WC_SESSION_PARAMS.namespaces.eip155.methods;
          return writeMethods.includes(method)
            ? writeEip1193.request({method, params})
            : readProvider.send(method, params ?? []);
        },
      });

      const _contract = new ethers.Contract(
        EDCON_GAME_CONTRACT_ADDRESS,
        EDCON_GAME_ABI,
        provider.getSigner(),
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
          contract
            .balanceOf(address, tokenId)
            .then((balance: any) => ({tokenId, token, balance})),
        ),
      );
      const myTokensWithBalance: MyTokenInfo[] = allTokenInfoBalances // ToDo: .filter((x: any) => !x.balance.eq(ethers.BigNumber.from(0)))
        .map((x: any) => ({
          tokenId: x.tokenId,
          ticker: x.token.ticker,
          tokenName: x.token.tokenName,
          iconUrl: x.token.iconUrl,
          creator: x.token.creator,
          balance: x.balance.toString(),
        }));

      setMyTokens(myTokensWithBalance);
    } catch (e) {
      console.error(e);
      setMyTokens(contextDefaultValues.myTokens);
    }

    setAreMyTokensLoading(false);
  }, [contract]);

  // ToDo: wrap all functions to useCallback

  async function setAmbassador(
    address: Address,
    tokenId: TokenId,
    ambassadorRank?: number,
  ) {
    if (!contract) {
      return;
    }

    const txPromise =
      ambassadorRank === undefined
        ? contract.setAmbassador(address, tokenId)
        : contract.setAmbassador(address, tokenId, ambassadorRank);

    processTransaction(txPromise, setSetAmbassadorTxStatus);
  }

  const resetSetAmbassadorTxStatus = useCallback(() => {
    setSetAmbassadorTxStatus(TxStatus.Idle);
  }, []);

  async function transferOrMint(
    tokens: {tokenId: TokenId; amount: ParsedUint}[],
    to: Address,
  ) {
    if (!contract) {
      return;
    }

    if (tokens.length === 0) {
      throw new Error('Tokens array is empty');
    }

    const txPromise =
      tokens.length === 1
        ? contract.transfer(tokens[0].tokenId, tokens[0].amount, to)
        : contract.transferBatch(
            tokens.map(x => x.tokenId),
            tokens.map(x => x.amount),
            to,
          );

    processTransaction(txPromise, setTransferOrMintTxStatus);
    resetTransferOrMintTxStatus();
  }

  const resetTransferOrMintTxStatus = useCallback(() => {
    setTransferOrMintTxStatus(TxStatus.Idle);
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

    setAmbassadorTxStatus,
    setAmbassador,
    resetSetAmbassadorTxStatus,

    transferOrMintTxStatus,
    transferOrMint,
    resetTransferOrMintTxStatus,
  };

  return (
    <EdconContractContext.Provider value={state}>
      {children}
    </EdconContractContext.Provider>
  );
};

// ToDo: duplicated code
async function processTransaction(
  promise: Promise<any>,
  setTxStatus: (status: TxStatus) => void,
) {
  setTxStatus(TxStatus.Sending);

  let receipt: any | null = null;

  try {
    receipt = await promise;
    setTxStatus(TxStatus.Mining);
  } catch (e) {
    console.error(e);
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

export {EdconContractProvider};
