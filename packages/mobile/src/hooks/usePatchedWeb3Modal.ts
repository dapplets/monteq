import {useWeb3Modal} from '@web3modal/react-native';
import {AccountCtrl} from '@web3modal/react-native/src/controllers/AccountCtrl';
import {ClientCtrl} from '@web3modal/react-native/src/controllers/ClientCtrl';
import {useEffect, useState} from 'react';

// ToDo: remove this hack after this issue resolved
// https://github.com/WalletConnect/web3modal-react-native/issues/17

export function usePatchedWeb3Modal() {
  const {isConnected, provider, open, close, isOpen: _isOpen} = useWeb3Modal();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (!provider) {
        await open();
        await close();
      } else {
        // reuse existing session
        if (provider.session) {
          const activePairings = provider.client.pairing.getAll({active: true});

          if (activePairings.length > 0) {
            ClientCtrl.setSessionTopic(provider.session.topic);
            await AccountCtrl.getAccount();
          }
        }

        setIsOpen(_isOpen);
        setIsLoading(false);
      }
    }

    init();
  }, [provider, open, close, _isOpen]);

  return {isLoading, open, close, provider, isConnected, isOpen};
}
