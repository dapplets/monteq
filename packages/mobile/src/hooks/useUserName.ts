import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';

import { USERNAME_KEY } from '../common/constants';

export function useUserName() {
  const [userName, setUserName] = useState('');

  React.useEffect(() => {
    (async () => {
      try {
        // ToDo: move to separate hook?
        const _username = await AsyncStorage.getItem(USERNAME_KEY);
        setUserName(_username ?? '');
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  async function changeUserName(value: string) {
    setUserName(value);

    try {
      // ToDo: move to separate hook?
      await AsyncStorage.setItem(USERNAME_KEY, value);
    } catch (e) {
      console.error(e);
    }
  }

  return { userName, changeUserName };
}
