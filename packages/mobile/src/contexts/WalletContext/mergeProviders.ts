import { ethers } from 'ethers';

import { WC_SESSION_PARAMS } from '../../common/constants';

const WRITE_METHODS = WC_SESSION_PARAMS.namespaces.eip155.methods;

export interface IEIP1193Provider {
  request(args: { method: string; params?: any[] }): Promise<any>;
}

export function mergeProviders(
  readProvider: IEIP1193Provider,
  writeProvider: IEIP1193Provider
): ethers.providers.Web3Provider {
  // The `eth_estimateGas` and `eth_call` calls are not resolved by WC-provider
  // So we split read and write calls by separate providers
  return new ethers.providers.Web3Provider({
    request: ({ method, params }) => {
      return WRITE_METHODS.includes(method)
        ? writeProvider.request({ method, params })
        : readProvider.request({ method, params });
    },
  });
}
