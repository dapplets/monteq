import type {Metadata} from '@walletconnect/universal-provider';

export const WC_PROJECT_ID = '19682c1014c476ffa7f0cfb529e5b17a';

export const WC_RELAY_URL = undefined;

export const WC_METADATA: Metadata = {
  name: 'MonteQ',
  description: 'Pay as you like',
  url: 'https://github.com/dapplets/monteq',
  icons: [], // ToDo: add icon
};

export const WC_SESSION_PARAMS = {
  namespaces: {
    eip155: {
      chains: ['eip155:100'], // ToDo: specify network id (100 - gnosis chain)
      methods: [
        'eth_sendTransaction',
        'eth_signTransaction',
        'eth_sign',
        'get_balance',
        'personal_sign',
      ],
      events: ['accountsChanged', 'chainChanged'],
    },
  },
};
