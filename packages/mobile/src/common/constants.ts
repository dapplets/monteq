import type {Metadata, ConnectParams} from '@walletconnect/universal-provider';

export const WC_PROJECT_ID = '19682c1014c476ffa7f0cfb529e5b17a';

export const WC_RELAY_URL = undefined;

export const WC_METADATA: Metadata = {
  name: 'MonteQ',
  description: 'Pay as you like',
  url: 'https://github.com/dapplets/monteq',
  icons: [], // ToDo: add icon
};

export const JSON_RPC_URL = 'https://rpc.gnosischain.com';

export const CHAIN_ID = 100;

export const WC_SESSION_PARAMS: ConnectParams = {
  namespaces: {
    eip155: {
      chains: ['eip155:100'], // ToDo: specify network id (100 - gnosis chain, 11155111 - sepolia)
      methods: [
        'eth_sendTransaction',
        'eth_signTransaction',
        'eth_sign',
        'get_balance',
        'personal_sign',
        'eth_accounts',
      ],
      events: ['accountsChanged', 'chainChanged'],
      rpcMap: {
        11155111: 'https://rpc.sepolia.org/',
        [CHAIN_ID]: JSON_RPC_URL,
      },
    },
  },
};

// previous xdai contract was 0x4cB9AC2D41092c739AD00620dbCC7396249A6d82
// 0x902d5cD7414Fa175e7558b329b4eD40E7b1aF407
export const MONTEQ_CONTRACT_ADDRESS =
  '0x6ecd78Cb2505309bAe00E11105666D2fD93e9634';

export const BASE_FIAT_CURRENCY = 'EUR';
export const BASE_FIAT_MAX_DIGITS = 2;

export const BASE_CRYPTO_CURRENCY = 'XDAI';
export const BASE_CRYPTO_MAX_DIGITS = 4;
