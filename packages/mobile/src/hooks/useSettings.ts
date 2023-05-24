import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { IS_OWNER_VIEW_PREFERRED_KEY, USERNAME_KEY } from '../common/constants';

const { getItem, setItem } = AsyncStorage;

// ToDo: move to separate context?
export function useSettings() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isOwnerViewPreferred, setIsOwnerViewPreferred] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setIsOwnerViewPreferred((await getItem(IS_OWNER_VIEW_PREFERRED_KEY)) === 'true');
        setUserName((await getItem(USERNAME_KEY)) ?? '');
      } catch (e) {
        console.error(e);
      } finally {
        setIsInitializing(false);
      }
    })();
  }, []);

  async function changeIsOwnerViewPreferred(value: boolean) {
    setIsOwnerViewPreferred(value);

    try {
      await setItem(IS_OWNER_VIEW_PREFERRED_KEY, value.toString());
    } catch (e) {
      console.error(e);
    }
  }

  async function changeUserName(value: string) {
    setUserName(value);

    try {
      await setItem(USERNAME_KEY, value);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    isInitializing,
    isOwnerViewPreferred,
    changeIsOwnerViewPreferred,
    userName,
    changeUserName,
  };
}
