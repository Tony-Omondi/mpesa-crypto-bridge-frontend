import React from 'react';
import {Image} from 'expo-image';
import {useRouter} from 'expo-router';
import {View, TouchableOpacity} from 'react-native';

import {text} from '@/src/text';
import type {TokenType} from '@/src/types';
import {calculateTotalUSD} from '@/src/utils/calculateTotalUSD';

type Props = {
  token: TokenType;
  isLast?: boolean;
};

export const TokenItem: React.FC<Props> = ({token, isLast}) => {
  const router = useRouter();

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const isExponential = (value: number) => {
    return (
      typeof value === 'number' && value.toString().toLowerCase().includes('e')
    );
  };

  return (
    <TouchableOpacity
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: '#1B2028',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: isLast ? 0 : 6,
      }}
      onPress={() => {
        router.push({pathname: '/token/[id]', params: {id: token.id}});
      }}
    >
      {/* TOP BLOCK */}
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}
      >
        <Image
          transition={1000}
          contentFit='cover'
          placeholder={{blurhash}}
          source={token?.logo}
          style={{width: 16, height: 16, borderRadius: 8}}
        />
        <text.T12 style={{marginRight: 'auto', marginLeft: 7}}>
          {token?.name}
        </text.T12>

        <text.T12>${calculateTotalUSD(token)}</text.T12>
      </View>
      {/* BOTTOM BLOCK */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            backgroundColor: '#0F1620',
            borderRadius: 5,
            paddingHorizontal: 8,
            paddingVertical: 3,
            alignSelf: 'flex-start',
          }}
        >
          <text.T12>
            $
            {isExponential(token?.price)
              ? token.price.toFixed(token?.decimals)
              : token?.price}
          </text.T12>
        </View>

        <View
          style={{
            backgroundColor: '#0F1620',
            borderRadius: 5,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <text.T12>
            {token?.balance} {token?.symbol.toUpperCase()}
          </text.T12>
        </View>
      </View>
    </TouchableOpacity>
  );
};
