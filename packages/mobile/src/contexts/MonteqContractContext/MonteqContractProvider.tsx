import React, {FC, ReactElement, useCallback, useEffect, useState} from 'react';
import {
  HistoryRecord,
  MonteqContractContext,
  MonteqContractContextState,
  TxStatus,
  ParsedUint,
  contextDefaultValues,
  BusinessInfo,
  defaultBusinessInfo,
} from './MonteqContractContext';
import {ethers} from 'ethers';
import {useWeb3Modal} from '@web3modal/react-native';
import {
  BASE_CRYPTO_MAX_DIGITS,
  CHAIN_ID,
  COINGECKO_CRYPTO_CURRENCY_ID,
  COINGECKO_FIAT_CURRENCY_ID,
  COINGECKO_PRICE_URL,
  JSON_RPC_URL,
  MONTEQ_CONTRACT_ADDRESS,
  WC_SESSION_PARAMS,
} from '../../common/constants';
import MONTEQ_ABI from '../../abis/MonteQ.json';
import {truncate} from '../../common/helpers';

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
  const [account, setAccount] = useState<string>(contextDefaultValues.account);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [rate, setRate] = useState<ParsedUint>(contextDefaultValues.rate);
  const [isRateLoading, setIsRateLoading] = useState(false);
  const [spentTotalCryptoAmount, setSpentTotalCryptoAmount] = useState(
    contextDefaultValues.spentTotalCryptoAmount,
  );
  const [spentTipsCryptoAmount, setSpentTipsCryptoAmount] = useState(
    contextDefaultValues.spentTipsCryptoAmount,
  );
  const [earnedInvoicesCryptoAmount, setEarnedInvoicesCryptoAmount] = useState(
    contextDefaultValues.earnedInvoicesCryptoAmount,
  );
  const [earnedTipsCryptoAmount, setEarnedTipsCryptoAmount] = useState(
    contextDefaultValues.earnedTipsCryptoAmount,
  );
  const [earnedInvoicesFiatAmount, setEarnedInvoicesFiatAmount] = useState(
    contextDefaultValues.earnedInvoicesFiatAmount,
  );
  const [outHistory, setOutHistory] = useState<HistoryRecord[]>([]);
  const [isOutHistoryLoading, setIsOutHistoryLoading] =
    useState<boolean>(false);
  const [inHistory, setInHistory] = useState<HistoryRecord[]>([]);
  const [isInHistoryLoading, setIsInHistoryLoading] = useState<boolean>(false);
  const [myBusiness, setMyBusiness] = useState<BusinessInfo | null>(null);
  const [isMyBusinessLoading, setIsMyBusinessLoading] =
    useState<boolean>(false);
  const [paymentTxStatus, setPaymentTxStatus] = useState<TxStatus>(
    TxStatus.Idle,
  );
  const [addBusinessTxStatus, setAddBusinessTxStatus] = useState<TxStatus>(
    TxStatus.Idle,
  );
  const [removeBusinessTxStatus, setRemoveBusinessTxStatus] =
    useState<TxStatus>(TxStatus.Idle);

  // ToDo: move to separate hook?
  useEffect(() => {
    (async () => {
      setIsRateLoading(true);

      try {
        const resp = await fetch(COINGECKO_PRICE_URL);
        const json = await resp.json();
        const price =
          json[COINGECKO_CRYPTO_CURRENCY_ID][COINGECKO_FIAT_CURRENCY_ID];

        if (isNaN(price)) {
          throw new Error('Invalid price from CoinGecko received');
        }

        // 1 EUR = ??? XDAI
        const reversedPrice = 1 / price;

        setRate(truncate(reversedPrice.toString(), BASE_CRYPTO_MAX_DIGITS));
      } catch (e) {
        console.error(e);
      }

      setIsRateLoading(false);
    })();
  }, []);

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


  // GET BALANCE
  useEffect(() => {
    (async () => {
      if (contract) {
        const address = await contract.signer.getAddress();
        setAccount(address);
      }
    })();
  }, [contract]);

  const updateUserBalance = useCallback(async () => {
    if (contract) {
      try {
        const _balance = await contract.signer.getBalance();
        setBalance(formatEther(_balance));
      } catch (e) {
        console.error(e);
        setBalance(contextDefaultValues.balance);
      }
    } else {
      setBalance(contextDefaultValues.balance);
    }
  }, [contract]);

  // GET BALANCE
  useEffect(() => {
    (async () => {
      setIsBalanceLoading(true);
      await updateUserBalance();
      setIsBalanceLoading(false);
    })();
  }, [updateUserBalance]);

  // REFRESH BALANCE
  useEffect(() => {
    (async () => updateUserBalance())();
  }, [updateUserBalance, paymentTxStatus]);

  const loadMoreOutHistory = useCallback(async () => {
    if (!contract) {
      return;
      // ToDo: clear state?
    }

    setIsOutHistoryLoading(true);

    try {
      // ToDo: naive impl
      const payer = await contract.signer.getAddress();
      const data = await contract.getHistoryByPayer(payer, 0, 100, true);
      // ToDo: pagination

      setOutHistory(
        data.history.map((x: any, index: number) => ({
          id: index, // ToDo: use better id
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

  const getBusinessInfoById = async (
    businessId: string,
  ): Promise<BusinessInfo> => {
    let businessInfo = defaultBusinessInfo;
    if (contract) {
      try {
        businessInfo = await contract.businessInfos(businessId);
      } catch (err) {
        console.log(err);
      }
    }
    return businessInfo;
  };

  useEffect(() => {
    (async () => {
      if (!contract) {
        return;
        // ToDo: clear state?
      }

      setIsMyBusinessLoading(true);

      try {
        const owner = await contract.signer.getAddress();
        const businessInfos = await contract.getBusinessInfosByOwner(owner);

        if (businessInfos.length > 0) {
          setMyBusiness({
            id: businessInfos[0].id,
            name: businessInfos[0].name,
            owner: businessInfos[0].owner,
          });
        } else {
          setMyBusiness(null);
        }
      } catch (e) {
        console.error(e);
        setMyBusiness(null);
      }

      setIsMyBusinessLoading(false);
    })();
  }, [contract]);

  const loadMoreInHistory = useCallback(async () => {
    if (!contract) {
      return;
    }

    if (!myBusiness) {
      setInHistory([]);
      return;
    }

    setIsInHistoryLoading(true);

    try {
      // ToDo: naive impl
      // ToDo: pagination
      const data = await contract.getHistoryByBusiness(
        myBusiness.id,
        0,
        100,
        true,
      );

      setInHistory(
        data.history.map((x: any, index: number) => ({
          id: index, // ToDo: use better id
          businessId: x.businessId,
          payer: x.payer,
          currencyReceipt: formatUnits(x.currencyReceipt, 2),
          receiptAmount: formatEther(x.receiptAmount),
          tipAmount: formatEther(x.tipAmount),
          totalCryptoAmount: formatEther(x.receiptAmount.add(x.tipAmount)),
          timestamp: x.timestamp.toNumber(),
        })),
      );

      setEarnedInvoicesCryptoAmount(
        formatEther(
          data.history.reduce(
            (acc: ethers.BigNumber, x: any) => acc.add(x.receiptAmount),
            ethers.BigNumber.from('0'),
          ),
        ),
      );

      setEarnedTipsCryptoAmount(
        formatEther(
          data.history.reduce(
            (acc: ethers.BigNumber, x: any) => acc.add(x.tipAmount),
            ethers.BigNumber.from('0'),
          ),
        ),
      );

      // ToDo: unused value. remove?
      setEarnedInvoicesFiatAmount(
        formatUnits(
          data.history.reduce(
            (acc: ethers.BigNumber, x: any) => acc.add(x.currencyReceipt),
            ethers.BigNumber.from('0'),
          ),
          2,
        ),
      );
    } catch (e) {
      console.error(e);
      setInHistory(contextDefaultValues.inHistory);
      setEarnedInvoicesCryptoAmount(
        contextDefaultValues.earnedInvoicesCryptoAmount,
      );
      setEarnedTipsCryptoAmount(contextDefaultValues.earnedTipsCryptoAmount);
    }

    setIsInHistoryLoading(false);
  }, [contract, myBusiness]);

  // ToDo: wrap all functions to useCallback

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

  const resetPaymentTxStatus = useCallback(() => {
    setPaymentTxStatus(TxStatus.Idle);
  }, []);

  async function addBusiness(businessId: string, name: string) {
    if (!contract) {
      return;
    }

    const receiptPromise = contract.addBusiness(businessId, name);

    const success = await processTransaction(
      receiptPromise,
      setAddBusinessTxStatus,
    );

    if (success) {
      setMyBusiness({
        id: businessId,
        name: name,
        owner: await contract.signer.getAddress(),
      });
    }
  }

  const resetAddBusinessTxStatus = useCallback(() => {
    setAddBusinessTxStatus(TxStatus.Idle);
  }, []);

  async function removeBusiness(businessId: string) {
    if (!contract) {
      return;
    }

    const receiptPromise = contract.removeBusiness(businessId);

    const success = await processTransaction(
      receiptPromise,
      setRemoveBusinessTxStatus,
    );

    if (success) {
      setMyBusiness(null);
    }
  }

  const resetRemoveBusinessTxStatus = useCallback(() => {
    setRemoveBusinessTxStatus(TxStatus.Idle);
  }, []);

  if (!contract) {
    return (
      <MonteqContractContext.Provider value={contextDefaultValues}>
        {children}
      </MonteqContractContext.Provider>
    );
  }

  const state: MonteqContractContextState = {
    account,
    balance,
    isBalanceLoading,
    updateUserBalance,
    rate,
    isRateLoading,
    spentTotalCryptoAmount,
    spentTipsCryptoAmount,
    earnedInvoicesCryptoAmount,
    earnedTipsCryptoAmount,
    earnedInvoicesFiatAmount,
    myBusiness,
    isMyBusinessLoading,
    outHistory,
    isOutHistoryLoading,
    loadMoreOutHistory,
    getBusinessInfoById,
    inHistory,
    isInHistoryLoading,
    loadMoreInHistory,
    paymentTxStatus,
    payReceipt,
    resetPaymentTxStatus,
    addBusinessTxStatus,
    addBusiness,
    resetAddBusinessTxStatus,
    removeBusinessTxStatus,
    removeBusiness,
    resetRemoveBusinessTxStatus,
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

export {MonteqContractProvider};
