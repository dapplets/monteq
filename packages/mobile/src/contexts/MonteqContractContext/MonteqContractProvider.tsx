import React, {FC, ReactElement, useCallback, useEffect, useState} from 'react';
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

const {formatUnits, parseUnits, parseEther, formatEther} = ethers.utils;

type Props = {
  children: ReactElement;
};

const MonteqContractProvider: FC<Props> = ({children}) => {
  const {provider: writeEip1193} = useWeb3Modal();

  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<ParsedUint>(
    contextDefaultValues.balance,
  );
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [rate, setRate] = useState<ParsedUint>(contextDefaultValues.rate);
  const [isRateLoading, setIsRateLoading] = useState(false);
  const [spentTotalCryptoAmount, setSpentTotalCryptoAmount] = useState(
    contextDefaultValues.spentTotalCryptoAmount,
  );
  const [spentTipsCryptoAmount, setSpentTipsCryptoAmount] = useState(
    contextDefaultValues.spentTipsCryptoAmount,
  );
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

  useEffect(() => {
    (async () => {
      setIsBalanceLoading(true);

      if (contract) {
        try {
          // ToDo: refresh balance
          const _balance = await contract.signer.getBalance();
          setBalance(formatEther(_balance));
        } catch (e) {
          console.error(e);
          setBalance(contextDefaultValues.balance);
        }
      } else {
        setBalance(contextDefaultValues.balance);
      }

      setIsBalanceLoading(false);
    })();
  }, [contract]);

  useEffect(() => {
    // ToDo: fetch real rate
    setRate('1.1'); // 1 EUR = 1.1 XDAI
  }, []);

  const loadMoreOutHistory = useCallback(async () => {
    if (!contract) {
      return;
    }

    setIsOutHistoryLoading(true);

    try {
      // ToDo: naive impl
      const payer = await contract.signer.getAddress();
      const data = await contract.getHistoryByPayer(payer, 0, 100, true);
      // ToDo: pagination

      setOutHistory(
        data.history.map((x: any) => ({
          businessId: x.businessId,
          payer: x.payer,
          currencyReceipt: formatUnits(x.currencyReceipt, 2),
          receiptAmount: formatEther(x.receiptAmount),
          tipAmount: formatEther(x.tipAmount),
          totalCryptoAmount: formatEther(x.receiptAmount.add(x.tipAmount)),
          timestamp: x.timestamp.toNumber(),
        })),
      );

      setSpentTotalCryptoAmount(
        formatEther(
          data.history.reduce(
            (acc: ethers.BigNumber, x: any) =>
              acc.add(x.receiptAmount.add(x.tipAmount)),
            ethers.BigNumber.from('0'),
          ),
        ),
      );

      setSpentTipsCryptoAmount(
        formatEther(
          data.history.reduce(
            (acc: ethers.BigNumber, x: any) => acc.add(x.tipAmount),
            ethers.BigNumber.from('0'),
          ),
        ),
      );
    } catch (e) {
      console.error(e);
      setOutHistory(contextDefaultValues.outHistory);
      setSpentTotalCryptoAmount(contextDefaultValues.spentTotalCryptoAmount);
      setSpentTipsCryptoAmount(contextDefaultValues.spentTipsCryptoAmount);
    }

    setIsOutHistoryLoading(false);
  }, [contract]);

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
        currencyReceipt: formatUnits(x.currencyReceipt, 2),
        receiptAmount: formatEther(x.receiptAmount),
        tipAmount: formatEther(x.tipAmount),
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

    const currencyReceiptBN = parseUnits(currencyReceipt, 2); // Fiat currency has 2 decimals
    const amountReceiptBN = parseEther(amountReceipt);
    const amountTipsBN = parseEther(amountTips);
    const totalAmountBN = amountReceiptBN.add(amountTipsBN);

    const receiptPromise = contract.payReceipt(
      businessId,
      currencyReceiptBN,
      amountReceiptBN,
      {value: totalAmountBN},
    );

    processTransaction(receiptPromise, setPaymentTxStatus);
  }

  async function addBusiness(businessId: string, name: string) {
    if (!contract) {
      return;
    }

    const receiptPromise = contract.addBusiness(businessId, name);

    processTransaction(receiptPromise, setAddBusinessTxStatus);
  }

  async function removeBusiness(businessId: string) {
    if (!contract) {
      return;
    }

    const receiptPromise = contract.removeBusiness(businessId);

    processTransaction(receiptPromise, setRemoveBusinessTxStatus);
  }

  if (!contract) {
    return (
      <MonteqContractContext.Provider value={contextDefaultValues}>
        {children}
      </MonteqContractContext.Provider>
    );
  }

  const state: MonteqContractContextState = {
    balance,
    isBalanceLoading,
    rate,
    isRateLoading,
    spentTotalCryptoAmount,
    spentTipsCryptoAmount,
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
    return;
  }

  try {
    await receipt.wait();
    setTxStatus(TxStatus.Done);
  } catch (e) {
    console.error(e);
    setTxStatus(TxStatus.Failed);
  }
}

export {MonteqContractProvider};
