import axios from 'axios';
import {useEffect, useRef, useState} from 'react';

import {URLS} from '../config';
import {useAppDispatch} from '@/src/store';
import {useAppSelector} from '@/src/store';
import {trc20TokensActions} from '@/src/store/trc20TokensSlice';

const MINUTE = 1;
const CACHE_DURATION = MINUTE * 60 * 1000;

export const useGetPrices = () => {
  const dispatch = useAppDispatch();

  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {list, network, nileTestnetTokens} = useAppSelector(
    (state) => state.trc20TokensReducer,
  );
  const tokensList = network === 'nile' ? nileTestnetTokens : list;
  const {pricesUpdateInterval} = useAppSelector(
    (state) => state.trc20TokensReducer,
  );

  const ids = tokensList.map((token) => token.id).join(',');

  const lastUpdateRef = useRef<number>(pricesUpdateInterval);
  const isFetchingRef = useRef<boolean>(false);

  const fetchPrices = async () => {
    const now = Date.now();

    if (now - lastUpdateRef.current < CACHE_DURATION) {
      const timeLeftMs = CACHE_DURATION - (now - lastUpdateRef.current);

      const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

      console.log(`NEXT UPDATE FOR PRICES: ${hours}h ${minutes}m ${seconds}s`);
      setIsLoading(false);
      return;
    }

    if (isFetchingRef.current) {
      setIsLoading(false);
      return console.log('ALREADY FETCHING PRICES DATA');
    }

    isFetchingRef.current = true;
    console.log('STARTED FETCHING PRICES DATA');

    try {
      setIsLoading(true);

      const response = await axios.post(
        URLS.GET_PRICES,
        {ids},
        {timeout: 10000},
      );

      lastUpdateRef.current = now;
      dispatch(trc20TokensActions.updateTokenPrices(response.data));
      dispatch(trc20TokensActions.setPricesUpdateInterval(now));
      console.log('SUCCESSFULLY FETCHED PRICES DATA');
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.error('ERROR FETCHING PRICES DATA:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return {isLoading, isError, fetchPrices};
};
