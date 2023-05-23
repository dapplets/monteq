import { useState, useEffect } from 'react';

import {
  BASE_CRYPTO_MAX_DIGITS,
  COINGECKO_CRYPTO_CURRENCY_ID,
  COINGECKO_FIAT_CURRENCY_ID,
  COINGECKO_PRICE_URL,
} from '../common/constants';
import { truncate } from '../common/helpers';

export function useCoingecko() {
  const [isRateLoading, setIsRateLoading] = useState(false);
  const [rate, setRate] = useState<string>('0'); // ToDo: use ParsedUint

  useEffect(() => {
    (async () => {
      setIsRateLoading(true);

      try {
        const resp = await fetch(COINGECKO_PRICE_URL);
        const json = await resp.json();
        const price = json[COINGECKO_CRYPTO_CURRENCY_ID][COINGECKO_FIAT_CURRENCY_ID];

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

  return { isRateLoading, rate };
}
