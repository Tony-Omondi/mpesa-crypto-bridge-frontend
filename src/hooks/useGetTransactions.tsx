import axios from 'axios';
import {useEffect, useState} from 'react';
import {URLS} from '../config';
import {useAppSelector} from '@/src/store';

export const useGetTransactions = (tokenId: string) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {network, list, nileTestnetTokens} = useAppSelector(
    (state) => state.trc20TokensReducer,
  );
  const {walletAddress} = useAppSelector((state) => state.walletReducer);

  const fetchTransactions = async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    try {
      let url = '';
      let tokensList = network === 'nile' ? nileTestnetTokens : list;
      if (tokenId === 'tron') {
        url = `${URLS.MAIN_URL}transactions/${network}/${walletAddress}`;
      } else {
        const contractAddress = tokensList.find(
          (token) => token.id === tokenId,
        )?.contract;
        if (!contractAddress) {
          setTransactions([]);
          setIsLoading(false);
          return;
        }
        console.log('contractAddress', contractAddress);
        url = `${URLS.MAIN_URL}transactions/${network}/${walletAddress}/${contractAddress}`;
      }
      const response = await axios.get(url);
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {transactions, isLoading, refetch: fetchTransactions};
};
