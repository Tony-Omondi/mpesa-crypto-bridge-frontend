import axios from 'axios';
import {useEffect, useRef, useState} from 'react';

import {URLS} from '../config';
import {useAppDispatch} from '@/src/store';
import {useAppSelector} from '@/src/store';
import {trc20TokensActions} from '@/src/store/trc20TokensSlice';

const MINUTE = 3;
const CACHE_DURATION = MINUTE * 60 * 1000;

export const useGetTrxData = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {network, trxDataUpdateInterval} = useAppSelector(
    (state) => state.trc20TokensReducer,
  );

  const {walletAddress} = useAppSelector((state) => state.walletReducer);

  const lastUpdateRef = useRef<number>(trxDataUpdateInterval);
  const isFetchingRef = useRef<boolean>(false);

  const fetchTrxData = async () => {
    const now = Date.now();

    if (now - lastUpdateRef.current < CACHE_DURATION) {
      const timeLeftMs = CACHE_DURATION - (now - lastUpdateRef.current);

      const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

      console.log(
        `NEXT UPDATE FOR TRX DATA: ${hours}h ${minutes}m ${seconds}s`,
      );
      setIsLoading(false);
      return;
    }

    if (isFetchingRef.current) {
      setIsLoading(false);
      return console.log('ALREADY FETCHING TRX DATA');
    }

    isFetchingRef.current = true;
    console.log('STARTED FETCHING TRX DATA');

    try {
      const response = await axios.post(URLS.GET_TRX_DATA, {
        walletAddress,
        network,
      });

      lastUpdateRef.current = now;
      dispatch(trc20TokensActions.updatePriceForTRX(response.data.price));
      dispatch(trc20TokensActions.updateBalanceForTRX(response.data.balance));
      dispatch(trc20TokensActions.updateTotalUSDForTRX(response.data.totalUSD));

      dispatch(trc20TokensActions.setTrxDataUpdateInterval(now));
      console.log('SUCCESSFULLY FETCHED TRX DATA');
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchTrxData();
  }, []);

  return {isLoading, fetchTrxData};
};
