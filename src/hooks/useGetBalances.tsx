import axios from 'axios';
import {useEffect, useRef, useState} from 'react';

import {URLS} from '../config';
import {useAppDispatch} from '@/src/store';
import {useAppSelector} from '@/src/store';
import {trc20TokensActions} from '@/src/store/trc20TokensSlice';

const MINUTE = 1;
const CACHE_DURATION = MINUTE * 60 * 1000;

export const useGetBalances = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {network, list, balancesUpdateInterval, nileTestnetTokens} =
    useAppSelector((state) => state.trc20TokensReducer);

  const tokensList = network === 'nile' ? nileTestnetTokens : list;

  const walletAddress = useAppSelector(
    (state) => state.walletReducer.walletAddress,
  );

  const lastUpdateRef = useRef<number>(balancesUpdateInterval);
  const isFetchingRef = useRef<boolean>(false);

  const fetchBalances = async () => {
    const now = Date.now();

    // Check if the last update was within the cache duration
    if (now - lastUpdateRef.current < CACHE_DURATION) {
      const timeLeftMs = CACHE_DURATION - (now - lastUpdateRef.current);

      const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

      console.log(
        `NEXT UPDATE FOR BALANCES: ${hours}h ${minutes}m ${seconds}s`,
      );
      setIsLoading(false);
      return;
    }

    // Check if a fetch is already in progress
    if (isFetchingRef.current) {
      setIsLoading(false);
      return console.log('ALREADY FETCHING BALANCES DATA');
    }

    isFetchingRef.current = true;
    console.log('STARTED FETCHING BALANCES DATA');

    try {
      const listOfTokens = tokensList.map((token) => ({
        contract: token.contract,
        decimals: token.decimals,
      }));

      const data = {
        walletAddress: walletAddress,
        listOfTokens: listOfTokens,
        network: network,
      };
      const response = await axios.post(URLS.GET_BALANCES, data);

      lastUpdateRef.current = now;
      dispatch(trc20TokensActions.updateTokenBalances(response.data));
      dispatch(trc20TokensActions.setBalancesUpdateInterval(now));
      console.log('SUCCESSFULLY FETCHED BALANCES DATA');
    } catch (error) {
      console.error('ERROR FETCHING BALANCES:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (tokensList.length === 0 || nileTestnetTokens.length === 0) {
      setIsLoading(false);
      return;
    }
    fetchBalances();
  }, []);

  return {isLoading, fetchBalances};
};
