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
import {MONTEQ_CONTRACT_ADDRESS} from '../../common/constants';
import MONTEQ_ABI from '../../abis/MonteQ.json';

type Props = {
  children: ReactElement;
};

const MonteqContractProvider: FC<Props> = ({children}) => {
  const {provider} = useWeb3Modal();

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
    if (provider) {
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const _contract = new ethers.Contract(
        MONTEQ_CONTRACT_ADDRESS,
        MONTEQ_ABI,
        web3Provider.getSigner(),
      );
      setContract(_contract);
    } else {
      setContract(null);
    }
  }, [provider]);

  async function loadMoreOutHistory() {
    if (!contract) {
      return;
    }

    // ToDo: naive impl
    const jsonRpcProvider = new ethers.providers.JsonRpcProvider(
      'https://rpc.gnosischain.com',
      100,
    );
    const readOnlyContract = new ethers.Contract(
      MONTEQ_CONTRACT_ADDRESS,
      MONTEQ_ABI,
      jsonRpcProvider,
    );
    const payer = await contract.signer.getAddress();
    const data = await readOnlyContract.getHistoryByPayer(payer, 0, 100, true);

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

  function loadMoreInHistory() {}

  async function payReceipt(
    businessId: string,
    currencyReceipt: ParsedUint,
    amountReceipt: ParsedUint,
    amountTips: ParsedUint,
  ) {
    if (!provider) {
      return;
    }

    setPaymentTxStatus(TxStatus.Sending);

    let receipt: any | null = null;

    try {
      const currencyReceiptBN = ethers.utils.parseUnits(currencyReceipt, 2); // Fiat currency has 2 decimals
      const amountReceiptBN = ethers.utils.parseEther(amountReceipt);
      const amountTipsBN = ethers.utils.parseEther(amountTips);
      const totalAmountBN = amountReceiptBN.add(amountTipsBN);

      const web3Provider = new ethers.providers.Web3Provider(provider);
      const _contract = new ethers.Contract(
        MONTEQ_CONTRACT_ADDRESS,
        MONTEQ_ABI,
        web3Provider.getSigner(),
      );

      console.log({
        businessId,
        currencyReceiptBN,
        amountReceiptBN,
        totalAmountBN,
      });

      receipt = await _contract.payReceipt(
        businessId,
        currencyReceiptBN,
        amountReceiptBN,
        {value: totalAmountBN},
      );
    } catch (e) {
      console.error(e);
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

  function addBusiness(businessId: string, name: string) {}

  function removeBusiness(businessId: string) {}

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
