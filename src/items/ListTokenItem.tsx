import React from 'react';
import {Image} from 'expo-image';
import {Switch} from 'react-native';
import {TouchableOpacity} from 'react-native';

import {text} from '@/src/text';
import {useAppDispatch} from '@/src/store';
import {useAppSelector} from '@/src/store';
import {trc20TokensActions} from '@/src/store/trc20TokensSlice';

import type {TokenType} from '@/src/types';

export const ListTokenItem = React.memo(({token}: {token: TokenType}) => {
  const dispatch = useAppDispatch();

  const {list} = useAppSelector((state) => state.trc20TokensReducer);

  const ifTokenExistsInList = (tokenId: string) => {
    return list.some((token) => (token.id || token.name) === tokenId);
  };

  const toggleSwitch = (tokenId: string) => {
    const isInList = list.some((token) => (token.id || token.name) === tokenId);

    if (isInList) {
      dispatch(trc20TokensActions.removeToken(tokenId));
    }

    if (!isInList) {
      dispatch(trc20TokensActions.addToken(token));
      dispatch(trc20TokensActions.resetPricesUpdateInterval());
      dispatch(trc20TokensActions.resetBalancesUpdateInterval());
    }
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#1B2028',
        borderRadius: 30,
        padding: 4,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 12,
        borderWidth: 1,
        borderColor: '#232932',
      }}
      onPress={() => toggleSwitch(token.id)}
    >
      <Image
        source={{uri: token.logo}}
        style={{
          width: 20,
          height: 20,
          marginRight: 10,
          borderRadius: 10,
        }}
      />
      <text.T16 style={{marginRight: 'auto'}}>
        {token.symbol.toUpperCase()}
      </text.T16>
      <Switch
        ios_backgroundColor='#3e3e3e'
        value={ifTokenExistsInList(token.id)}
        onValueChange={() => toggleSwitch(token.id)}
        style={{transform: [{scaleX: 0.9}, {scaleY: 0.9}]}}
      />
    </TouchableOpacity>
  );
});
