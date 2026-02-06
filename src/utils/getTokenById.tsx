import {useAppSelector} from '@/src/store';

export const getTokenById = (id: string) => {
  const {list, trxData, nileTestnetTokens, network} = useAppSelector(
    (state) => state.trc20TokensReducer,
  );

  const tokens = network === 'nile' ? nileTestnetTokens : list;
  return id === 'tron' ? trxData : tokens.find((t) => t.id === id) || null;
};
