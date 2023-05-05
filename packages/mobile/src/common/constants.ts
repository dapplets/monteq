import type {Metadata, ConnectParams} from '@walletconnect/universal-provider';

export const WC_PROJECT_ID = '19682c1014c476ffa7f0cfb529e5b17a';

export const WC_RELAY_URL = undefined;

export const WC_METADATA: Metadata = {
  name: 'MonteQ',
  description: 'Pay as you like',
  url: 'https://github.com/dapplets/monteq',
  icons: [], // ToDo: add icon
};

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
      ],
      events: ['accountsChanged', 'chainChanged'],
      rpcMap: {
        11155111: 'https://rpc.sepolia.org/',
        100: 'https://rpc.gnosischain.com',
      },
    },
  },
};

export const MONTEQ_CONTRACT_ADDRESS =
  '0x4cB9AC2D41092c739AD00620dbCC7396249A6d82'; // sepolia 0x57710f615Bf482D562F2Cf97E302B89824c1690C
