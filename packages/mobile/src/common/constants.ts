import type {Metadata, ConnectParams} from '@walletconnect/universal-provider';

export const WC_PROJECT_ID = '19682c1014c476ffa7f0cfb529e5b17a';

export const WC_RELAY_URL = undefined;

export const WC_METADATA: Metadata = {
  name: 'MonteQ',
  description: 'Pay as you like',
  url: 'https://github.com/dapplets/monteq',
  icons: [
    'https://github.com/dapplets/monteq/blob/main/docs/dapp-icon.png?raw=true',
  ],
};

export const JSON_RPC_URL = 'https://gnosis-mainnet.public.blastapi.io';

export const CHAIN_ID = 100;

export const WC_SESSION_PARAMS: ConnectParams = {
  namespaces: {
    eip155: {
      chains: ['eip155:100'],
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
        [CHAIN_ID]: JSON_RPC_URL,
      },
    },
  },
};

export const MONTEQ_CONTRACT_ADDRESS =
  '0x6ecd78Cb2505309bAe00E11105666D2fD93e9634';

export const EDCON_GAME_CONTRACT_ADDRESS =
  '0xB4DDf048f7e220118787BbC1F87b634Cd7ce9AC0';

export const BASE_FIAT_CURRENCY = 'EUR';
export const BASE_FIAT_MAX_DIGITS = 2;

export const BASE_CRYPTO_CURRENCY = 'XDAI';
export const BASE_CRYPTO_MAX_DIGITS = 4;

// ToDo: parametrize decimals

export const COINGECKO_FIAT_CURRENCY_ID = 'eur';
export const COINGECKO_CRYPTO_CURRENCY_ID = 'xdai';
export const COINGECKO_PRICE_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${COINGECKO_CRYPTO_CURRENCY_ID}&vs_currencies=${COINGECKO_FIAT_CURRENCY_ID}`;

export const IS_OWNER_VIEW_PREFERRED_KEY = 'IS_OWNER_VIEW_PREFERRED';
export const USERNAME_KEY = 'USERNAME_KEY';
