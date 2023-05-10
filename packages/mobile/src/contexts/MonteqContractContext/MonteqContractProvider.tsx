import React, {FC, ReactElement, useEffect, useState} from 'react';
import {
  HistoryRecord,
  MonteqContractContext,
  MonteqContractContextState,
  TxStatus,
  ParsedUint,
  contextDefaultValues,
} from './MonteqContractContext';
import {ethers} from 'ethers';
import {useWeb3Modal} from '@web3modal/react-native';
import {
  CHAIN_ID,
  JSON_RPC_URL,
  MONTEQ_CONTRACT_ADDRESS,
  WC_SESSION_PARAMS,
} from '../../common/constants';
import MONTEQ_ABI from '../../abis/MonteQ.json';

type Props = {
  children: ReactElement;
};

const MonteqContractProvider: FC<Props> = ({children}) => {
  const {provider: writeEip1193} = useWeb3Modal();

  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [outHistory, setOutHistory] = useState<HistoryRecord[]>([]);
  const [isOutHistoryLoading, setIsOutHistoryLoading] =
    useState<boolean>(false);
  const [inHistory, setInHistory] = useState<HistoryRecord[]>([]);
  const [isInHistoryLoading, setIsInHistoryLoading] = useState<boolean>(false);
  const [paymentTxStatus, setPaymentTxStatus] = useState<TxStatus>(
    TxStatus.Idle,
  );
  const [addBusinessTxStatus, setAddBusinessTxStatus] = useState<TxStatus>(
    TxStatus.Idle,
  );
  const [removeBusinessTxStatus, setRemoveBusinessTxStatus] =
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
        MONTEQ_CONTRACT_ADDRESS,
        MONTEQ_ABI,
        provider.getSigner(),
      );

      setContract(_contract);
    } else {
      setContract(null);
    }
  }, [writeEip1193]);

  async function loadMoreOutHistory() {
    if (!contract) {
      return;
    }

    // ToDo: naive impl
    const payer = await contract.signer.getAddress();
    const data = await contract.getHistoryByPayer(payer, 0, 100, true);
    // ToDo: pagination

    setOutHistory(
      data.history.map((x: any) => ({
        businessId: x.businessId,
        payer: x.payer,
        currencyReceipt: ethers.utils.formatUnits(x.currencyReceipt, 2),
        receiptAmount: ethers.utils.formatEther(x.receiptAmount),
        tipAmount: ethers.utils.formatEther(x.tipAmount),
        timestamp: x.timestamp.toNumber(),
      })),
    );
  }

  async function loadMoreInHistory() {
    if (!contract) {
      return;
    }

    // ToDo: naive impl
    // todo: mocked businessid
    //'test-bu-02'
    // const payer = await contract.signer.getAddress();
    const data = await contract.getHistoryByBusiness(
      'test-bu-02',
      0,
      100,
      true,
    );
    // ToDo: pagination

    setInHistory(
      data.history.map((x: any) => ({
        businessId: x.businessId,
        payer: x.payer,
        currencyReceipt: ethers.utils.formatUnits(x.currencyReceipt, 2),
        receiptAmount: ethers.utils.formatEther(x.receiptAmount),
        tipAmount: ethers.utils.formatEther(x.tipAmount),
        timestamp: x.timestamp.toNumber(),
      })),
    );
  }

  async function payReceipt(
    businessId: string,
    currencyReceipt: ParsedUint,
    amountReceipt: ParsedUint,
    amountTips: ParsedUint,
  ) {
    if (!contract) {
      return;
    }

    setPaymentTxStatus(TxStatus.Sending);

    let receipt: any | null = null;

    try {
      const currencyReceiptBN = ethers.utils.parseUnits(currencyReceipt, 2); // Fiat currency has 2 decimals
      const amountReceiptBN = ethers.utils.parseEther(amountReceipt);
      const amountTipsBN = ethers.utils.parseEther(amountTips);
      const totalAmountBN = amountReceiptBN.add(amountTipsBN);

      receipt = await contract.payReceipt(
        businessId,
        currencyReceiptBN,
        amountReceiptBN,
        {value: totalAmountBN},
      );
    } catch (e) {
      setPaymentTxStatus(TxStatus.Rejected);
    }

    if (!receipt) {
      return;
    }

    setPaymentTxStatus(TxStatus.Mining);

    try {
      await receipt.wait();
      setPaymentTxStatus(TxStatus.Done);
    } catch (e) {
      console.error(e);
      setPaymentTxStatus(TxStatus.Failed);
    }
  }

  async function addBusiness(businessId: string, name: string) {
    if (!contract) {
      return;
    }

    setAddBusinessTxStatus(TxStatus.Sending);

    let receipt: any | null = null;

    try {
      receipt = await contract.addBusiness(businessId, name);
    } catch (e) {
      console.error(e);
      setAddBusinessTxStatus(TxStatus.Rejected);
    }

    if (!receipt) {
      return;
    }

    setAddBusinessTxStatus(TxStatus.Mining);

    try {
      await receipt.wait();
      setAddBusinessTxStatus(TxStatus.Done);
    } catch (e) {
      console.error(e);
      setAddBusinessTxStatus(TxStatus.Failed);
    }
  }

  async function removeBusiness(businessId: string) {
    if (!contract) {
      return;
    }

    setRemoveBusinessTxStatus(TxStatus.Sending);

    let receipt: any | null = null;
    try {
      receipt = await contract.removeBusiness(businessId);
    } catch (e) {
      console.error(e);
      setRemoveBusinessTxStatus(TxStatus.Rejected);
    }

    if (!receipt) {
      return;
    }

    setRemoveBusinessTxStatus(TxStatus.Mining);

    try {
      await receipt.wait();
      setRemoveBusinessTxStatus(TxStatus.Done);
    } catch (e) {
      console.error(e);
      setRemoveBusinessTxStatus(TxStatus.Failed);
    }
  }

  if (!contract) {
    return (
      <MonteqContractContext.Provider value={contextDefaultValues}>
        {children}
      </MonteqContractContext.Provider>
    );
  }

  const state: MonteqContractContextState = {
    outHistory,
    isOutHistoryLoading,
    loadMoreOutHistory,
    inHistory,
    isInHistoryLoading,
    loadMoreInHistory,
    paymentTxStatus,
    payReceipt,
    addBusinessTxStatus,
    addBusiness,
    removeBusinessTxStatus,
    removeBusiness,
  };

  return (
    <MonteqContractContext.Provider value={state}>
      {children}
    </MonteqContractContext.Provider>
  );
};

export {MonteqContractProvider};
