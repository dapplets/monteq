import { utils } from 'ethers';

import MONTEQ_ABI from '../../abis/MonteQ.json';
import { MONTEQ_CONTRACT_ADDRESS } from '../../common/constants';
import { ParsedUint } from '../../common/types';
import { useContractWrite } from '../useContractWrite';

export function usePayReceipt() {
  const {
    status,
    error,
    send: _send,
    reset,
  } = useContractWrite({
    address: MONTEQ_CONTRACT_ADDRESS,
    abi: MONTEQ_ABI,
    method: 'payReceipt',
  });

  async function send(
    businessId: string,
    currencyReceipt: ParsedUint,
    amountReceipt: ParsedUint,
    amountTips: ParsedUint
  ) {
    const currencyReceiptBN = utils.parseUnits(currencyReceipt, 2); // Fiat currency has 2 decimals
    const amountReceiptBN = utils.parseEther(amountReceipt);
    const amountTipsBN = utils.parseEther(amountTips);
    const totalAmountBN = amountReceiptBN.add(amountTipsBN);

    await _send(businessId, currencyReceiptBN, amountReceiptBN, {
      value: totalAmountBN,
    });
  }

  return { status, error, send, reset };
}
